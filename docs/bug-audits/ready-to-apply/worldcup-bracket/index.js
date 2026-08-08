import { TEAMS } from './teams.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-pass, x-edit-token',
};

const MAX_NAME_LEN = 64;
const MAX_BRACKETS = 250;
const PICK_KEY_RE = /^(R32|R16|QF|SF|F)_\d+$/;
const ROUND_MATCH_COUNTS_SERVER = { R32: 16, R16: 8, QF: 4, SF: 2, F: 1 };
const TEAM_NAME_SET = new Set(TEAMS.map((t) => t.name));

function newEditToken() {
  return crypto.randomUUID();
}

function sanitizeName(name) {
  if (typeof name !== 'string') return null;
  const trimmed = name.trim().replace(/\s+/g, ' ');
  if (!trimmed || trimmed.length > MAX_NAME_LEN) return null;
  return trimmed;
}

/** Whitelist pick keys/values. Returns null if payload is abusive/invalid. */
function sanitizePicks(picks) {
  if (!picks || typeof picks !== 'object' || Array.isArray(picks)) return null;
  const out = {};
  for (const [key, value] of Object.entries(picks)) {
    if (!PICK_KEY_RE.test(key)) return null;
    const [round, idxStr] = key.split('_');
    const idx = Number(idxStr);
    const max = ROUND_MATCH_COUNTS_SERVER[round];
    if (!Number.isInteger(idx) || idx < 0 || idx >= max) return null;
    if (typeof value !== 'string' || !TEAM_NAME_SET.has(value)) return null;
    out[key] = value;
  }
  // Cap serialized size as a belt-and-suspenders check
  if (JSON.stringify(out).length > 8000) return null;
  return out;
}

// Passcodes come from Worker env bindings (set via `wrangler secret put` in
// prod, or a .dev.vars file locally) — never hardcoded here. No fallback
// values on purpose: if the env vars aren't set, auth fails closed instead
// of silently accepting a default passcode.
function getRole(pass, env) {
  if (!pass) return null;
  if (env.ADMIN_PASS && pass === env.ADMIN_PASS) return 'admin';
  if (env.FRIEND_PASS && pass === env.FRIEND_PASS) return 'friend';
  return null;
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function errorResponse(msg, status = 400) {
  return jsonResponse({ error: msg }, status);
}

async function handleAPI(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  const pass = request.headers.get('x-pass') || '';
  const role = getRole(pass, env);

  // OPTIONS preflight
  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // POST /api/login
  if (path === '/api/login' && method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const r = getRole(String(body.pass || ''), env);
    if (!r) return jsonResponse({ ok: false, role: null }, 401);
    return jsonResponse({ ok: true, role: r });
  }

  // GET /api/config
  if (path === '/api/config' && method === 'GET') {
    const row = await env.DB.prepare('SELECT setup_json, results_json, locked FROM config WHERE id=1').first();
    if (!row) return jsonResponse({ setup: {}, results: {}, locked: false });
    return jsonResponse({
      setup: JSON.parse(row.setup_json || '{}'),
      results: JSON.parse(row.results_json || '{}'),
      locked: !!row.locked,
    });
  }

  // PUT /api/config/setup
  if (path === '/api/config/setup' && method === 'PUT') {
    if (role !== 'admin') return errorResponse('Admin only', 403);
    const body = await request.json().catch(() => ({}));
    if (!Array.isArray(body.slots) || body.slots.length !== 32) return errorResponse('slots must be array of 32');
    await env.DB.prepare('UPDATE config SET setup_json=? WHERE id=1').bind(JSON.stringify({ slots: body.slots })).run();
    return jsonResponse({ ok: true });
  }

  // PUT /api/config/lock
  if (path === '/api/config/lock' && method === 'PUT') {
    if (role !== 'admin') return errorResponse('Admin only', 403);
    const body = await request.json().catch(() => ({}));
    await env.DB.prepare('UPDATE config SET locked=? WHERE id=1').bind(body.locked ? 1 : 0).run();
    return jsonResponse({ ok: true });
  }

  // PUT /api/config/results
  if (path === '/api/config/results' && method === 'PUT') {
    if (role !== 'admin') return errorResponse('Admin only', 403);
    const body = await request.json().catch(() => ({}));
    await env.DB.prepare('UPDATE config SET results_json=? WHERE id=1').bind(JSON.stringify(body.results || {})).run();
    return jsonResponse({ ok: true });
  }

  // GET /api/brackets — public leaderboard data (never returns edit_token)
  if (path === '/api/brackets' && method === 'GET') {
    const rows = await env.DB.prepare('SELECT id, name, picks_json, created_at, updated_at FROM brackets ORDER BY created_at ASC').all();
    const brackets = (rows.results || []).map(r => ({
      id: r.id,
      name: r.name,
      picks: JSON.parse(r.picks_json || '{}'),
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
    return jsonResponse({ brackets });
  }

  // POST /api/brackets — public create; returns editToken once (store client-side)
  if (path === '/api/brackets' && method === 'POST') {
    const cfg = await env.DB.prepare('SELECT locked FROM config WHERE id=1').first();
    if (cfg && cfg.locked) return errorResponse('Bracket pool is locked', 403);
    const body = await request.json().catch(() => ({}));
    const name = sanitizeName(body.name);
    if (!name) return errorResponse('name required (max ' + MAX_NAME_LEN + ' chars)');
    const picks = sanitizePicks(body.picks || {});
    if (!picks) return errorResponse('invalid picks');
    const countRow = await env.DB.prepare('SELECT COUNT(*) AS n FROM brackets').first();
    if ((countRow?.n || 0) >= MAX_BRACKETS) return errorResponse('Bracket pool is full', 403);
    const editToken = newEditToken();
    const result = await env.DB.prepare(
      'INSERT INTO brackets (name, picks_json, edit_token) VALUES (?, ?, ?)'
    ).bind(name, JSON.stringify(picks), editToken).run();
    return jsonResponse({ ok: true, id: result.meta.last_row_id, editToken });
  }

  // PUT /api/brackets/:id — requires matching editToken (or admin)
  const putMatch = path.match(/^\/api\/brackets\/(\d+)$/);
  if (putMatch && method === 'PUT') {
    const cfg = await env.DB.prepare('SELECT locked FROM config WHERE id=1').first();
    if (cfg && cfg.locked) return errorResponse('Bracket pool is locked', 403);
    const id = parseInt(putMatch[1], 10);
    const body = await request.json().catch(() => ({}));
    const picks = sanitizePicks(body.picks || {});
    if (!picks) return errorResponse('invalid picks');
    const editToken = (typeof body.editToken === 'string' && body.editToken)
      || request.headers.get('x-edit-token')
      || '';
    const isAdmin = role === 'admin';
    if (!isAdmin && !editToken) return errorResponse('editToken required', 403);

    let name = null;
    if (body.name !== undefined && body.name !== null && body.name !== '') {
      name = sanitizeName(body.name);
      if (!name) return errorResponse('invalid name');
    }

    let result;
    if (isAdmin) {
      if (name) {
        result = await env.DB.prepare(
          "UPDATE brackets SET name=?, picks_json=?, updated_at=datetime('now') WHERE id=?"
        ).bind(name, JSON.stringify(picks), id).run();
      } else {
        result = await env.DB.prepare(
          "UPDATE brackets SET picks_json=?, updated_at=datetime('now') WHERE id=?"
        ).bind(JSON.stringify(picks), id).run();
      }
    } else if (name) {
      result = await env.DB.prepare(
        "UPDATE brackets SET name=?, picks_json=?, updated_at=datetime('now') WHERE id=? AND edit_token=?"
      ).bind(name, JSON.stringify(picks), id, editToken).run();
    } else {
      result = await env.DB.prepare(
        "UPDATE brackets SET picks_json=?, updated_at=datetime('now') WHERE id=? AND edit_token=?"
      ).bind(JSON.stringify(picks), id, editToken).run();
    }
    if (!result.meta || result.meta.changes === 0) {
      return errorResponse('Bracket not found or editToken invalid', 404);
    }
    return jsonResponse({ ok: true });
  }

  // DELETE /api/brackets/:id
  const delMatch = path.match(/^\/api\/brackets\/(\d+)$/);
  if (delMatch && method === 'DELETE') {
    if (role !== 'admin') return errorResponse('Admin only', 403);
    const id = parseInt(delMatch[1], 10);
    await env.DB.prepare('DELETE FROM brackets WHERE id=?').bind(id).run();
    return jsonResponse({ ok: true });
  }

  return errorResponse('Not found', 404);
}

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>World Cup 2026 Bracket Pool</title>
<style>
  :root {
    --bg: #0a0e1a;
    --card: #141824;
    --card2: #1c2235;
    --accent: #00d084;
    --gold: #ffd700;
    --red: #ff4d4d;
    --text: #ffffff;
    --muted: #8892a4;
    --border: #2a3246;
    --radius: 12px;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  #app { flex: 1; display: flex; flex-direction: column; }

  /* Gate screen */
  #gate {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 2rem; text-align: center; gap: 1.5rem;
  }
  #gate .ball { font-size: 5rem; }
  #gate h1 { font-size: 2rem; font-weight: 800; line-height: 1.2; }
  #gate p { color: var(--muted); font-size: 1rem; }
  .pass-form { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 320px; }
  .pass-form input {
    background: var(--card); border: 2px solid var(--border);
    border-radius: var(--radius); color: var(--text);
    font-size: 1.2rem; padding: 0.85rem 1rem;
    text-align: center; letter-spacing: 0.3em; outline: none;
    transition: border-color 0.2s;
  }
  .pass-form input:focus { border-color: var(--accent); }
  .btn {
    background: var(--accent); border: none; border-radius: var(--radius);
    color: #000; cursor: pointer; font-size: 1rem; font-weight: 700;
    padding: 0.85rem 1.5rem; transition: opacity 0.2s, transform 0.1s;
  }
  .btn:active { transform: scale(0.97); opacity: 0.9; }
  .btn.secondary { background: var(--card2); color: var(--text); border: 1px solid var(--border); }
  .btn.danger { background: var(--red); color: #fff; }
  .btn.gold-btn { background: var(--gold); color: #000; }
  .gate-request { color: var(--muted); font-size: 0.9rem; }
  .gate-request a { color: var(--accent); text-decoration: none; }

  /* Main layout */
  #main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .tab-content { flex: 1; overflow-y: auto; padding: 1rem; padding-bottom: 5rem; }

  /* Tab bar */
  .tab-bar {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: var(--card); border-top: 1px solid var(--border);
    display: flex; z-index: 100;
  }
  .tab-btn {
    flex: 1; background: none; border: none; color: var(--muted); cursor: pointer;
    font-size: 0.7rem; padding: 0.6rem 0.25rem 0.5rem;
    display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
    transition: color 0.2s;
  }
  .tab-btn .tab-icon { font-size: 1.4rem; }
  .tab-btn.active { color: var(--accent); }

  /* Cards */
  .card { background: var(--card); border-radius: var(--radius); border: 1px solid var(--border); padding: 1rem; margin-bottom: 0.75rem; }
  .card-title { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 0.75rem; }
  .section-header { font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }

  /* Progress bar */
  .progress-bar-wrap { background: var(--border); border-radius: 99px; height: 8px; margin-bottom: 1rem; overflow: hidden; }
  .progress-bar-fill { background: var(--accent); height: 100%; border-radius: 99px; transition: width 0.4s ease; }
  .progress-label { font-size: 0.8rem; color: var(--muted); text-align: right; margin-bottom: 0.4rem; }

  /* Match cards */
  .match-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 0.6rem; overflow: hidden; }
  .match-label { font-size: 0.7rem; color: var(--muted); padding: 0.4rem 0.75rem 0; text-transform: uppercase; letter-spacing: 0.08em; }
  .match-teams { display: flex; gap: 0.5rem; padding: 0.5rem 0.75rem 0.6rem; align-items: stretch; }
  .team-pick-btn {
    flex: 1; background: var(--card2); border: 2px solid transparent; border-radius: 8px;
    color: var(--text); cursor: pointer; display: flex; flex-direction: column;
    align-items: center; gap: 0.25rem; padding: 0.6rem 0.25rem;
    transition: all 0.15s; font-size: 0.85rem; font-weight: 600; line-height: 1.2; text-align: center;
  }
  .team-pick-btn .flag { font-size: 1.5em; }
  .team-pick-btn:hover { border-color: var(--accent); }
  .team-pick-btn.selected { border-color: var(--accent); background: rgba(0,208,132,0.15); color: var(--accent); }
  .team-pick-btn.eliminated { opacity: 0.35; }
  .match-vs { color: var(--muted); font-size: 0.75rem; align-self: center; flex-shrink: 0; }

  /* Round nav */
  .round-nav { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .round-pill { background: var(--card2); border: 1px solid var(--border); border-radius: 99px; color: var(--muted); cursor: pointer; font-size: 0.75rem; padding: 0.3rem 0.75rem; transition: all 0.15s; }
  .round-pill.active { background: var(--accent); border-color: var(--accent); color: #000; font-weight: 700; }
  .round-pill.done { border-color: var(--accent); color: var(--accent); }

  /* Name input */
  .name-section { margin-bottom: 1.25rem; }
  .name-section label { font-size: 0.8rem; color: var(--muted); display: block; margin-bottom: 0.4rem; }
  .name-section input {
    background: var(--card2); border: 2px solid var(--border); border-radius: var(--radius);
    color: var(--text); font-size: 1rem; padding: 0.7rem 1rem; width: 100%; outline: none;
    transition: border-color 0.2s;
  }
  .name-section input:focus { border-color: var(--accent); }
  .submit-section { margin-top: 1rem; }
  .submit-btn-wrap { display: flex; flex-direction: column; gap: 0.5rem; }

  /* Leaderboard */
  .leader-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 0.5rem; cursor: pointer; transition: border-color 0.15s; }
  .leader-row:hover { border-color: var(--accent); }
  .leader-row.expanded { border-color: var(--accent); }
  .rank { font-size: 1.2rem; font-weight: 800; color: var(--gold); min-width: 2rem; text-align: center; }
  .leader-name { font-weight: 700; flex: 1; }
  .leader-score { font-size: 1.1rem; font-weight: 800; color: var(--accent); }
  .leader-champ { font-size: 0.85rem; color: var(--muted); }
  .picks-detail { padding: 0.75rem; background: var(--card2); border-radius: 0 0 var(--radius) var(--radius); margin-top: -0.5rem; margin-bottom: 0.5rem; border: 1px solid var(--border); border-top: none; }
  .picks-round { margin-bottom: 0.5rem; }
  .picks-round-title { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; margin-bottom: 0.3rem; }
  .pick-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; margin-bottom: 0.2rem; }

  /* Brackets tab */
  .bracket-entry { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 0.6rem; overflow: hidden; cursor: pointer; transition: border-color 0.15s; }
  .bracket-entry:hover { border-color: var(--accent); }
  .bracket-entry.expanded { border-color: var(--accent); }
  .bracket-entry-header { padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.75rem; }
  .bracket-entry-name { font-weight: 700; flex: 1; }
  .bracket-entry-champ { font-size: 0.85rem; color: var(--muted); }
  .bracket-entry-body { padding: 0 1rem 1rem; }
  .bracket-round { margin-bottom: 0.5rem; }
  .bracket-round-title { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; margin-bottom: 0.3rem; letter-spacing: 0.08em; }
  .bracket-pick-list { display: flex; flex-wrap: wrap; gap: 0.3rem; }
  .bracket-pick-chip { background: var(--card2); border-radius: 6px; font-size: 0.75rem; padding: 0.2rem 0.5rem; display: flex; align-items: center; gap: 0.3rem; }

  /* Admin */
  .admin-section { margin-bottom: 1.5rem; }
  .admin-section-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border); }
  .slot-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
  .slot-label { font-size: 0.75rem; color: var(--muted); min-width: 4rem; }
  .slot-select { flex: 1; min-width: 120px; background: var(--card2); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-size: 0.82rem; padding: 0.4rem 0.5rem; outline: none; }
  .lock-toggle { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--card2); border-radius: var(--radius); margin-bottom: 0.75rem; }
  .lock-status { flex: 1; font-weight: 700; }
  .lock-status.locked-text { color: var(--red); }
  .lock-status.open-text { color: var(--accent); }
  .result-match { background: var(--card2); border-radius: 8px; margin-bottom: 0.5rem; padding: 0.5rem 0.75rem; }
  .result-match-label { font-size: 0.7rem; color: var(--muted); margin-bottom: 0.4rem; text-transform: uppercase; }
  .result-teams { display: flex; gap: 0.5rem; }
  .result-team-btn { flex: 1; background: var(--card); border: 2px solid transparent; border-radius: 8px; color: var(--text); cursor: pointer; font-size: 0.8rem; padding: 0.4rem 0.25rem; text-align: center; transition: all 0.15s; }
  .result-team-btn:hover { border-color: var(--gold); }
  .result-team-btn.winner { border-color: var(--gold); background: rgba(255,215,0,0.15); color: var(--gold); font-weight: 700; }
  .manage-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; background: var(--card2); border-radius: 8px; margin-bottom: 0.4rem; }
  .manage-name { flex: 1; font-weight: 600; }
  .manage-date { font-size: 0.75rem; color: var(--muted); }

  /* Confetti */
  #confetti-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; display: none; }

  /* Toast */
  #toast {
    position: fixed; bottom: 5rem; left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--card2); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 0.6rem 1.2rem; font-size: 0.9rem; opacity: 0; transition: all 0.3s;
    z-index: 200; white-space: nowrap;
  }
  #toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  #toast.success { border-color: var(--accent); color: var(--accent); }
  #toast.error { border-color: var(--red); color: var(--red); }
  .empty-state { text-align: center; color: var(--muted); padding: 3rem 1rem; font-size: 1.1rem; }
  .waiting-list { margin-top: 1rem; display: flex; flex-direction: column; gap: 0.4rem; }
  .waiting-item { background: var(--card2); border-radius: 8px; padding: 0.5rem 0.75rem; font-size: 0.9rem; }
  .app-header { display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem 0.5rem; }
  .app-title { font-size: 1.05rem; font-weight: 800; letter-spacing: -0.01em; }
  .admin-gear { background: transparent; border: none; font-size: 1.15rem; cursor: pointer; opacity: 0.5; padding: 0.25rem; }
  .admin-gear:hover { opacity: 1; }
  .prize-banner { margin: 0 1rem 0.6rem; padding: 0.6rem 0.85rem; border-radius: 10px; font-size: 0.9rem; text-align: center;
    background: linear-gradient(90deg, rgba(255,215,0,0.14), rgba(0,208,132,0.14)); border: 1px solid rgba(255,215,0,0.35); color: var(--text); }
  .prize-banner b { color: var(--gold); }
  .scoring-note { font-size: 0.78rem; color: var(--muted); text-align: center; margin: -0.3rem 0 0.8rem; line-height: 1.4; }
</style>
</head>
<body>
<canvas id="confetti-canvas"></canvas>
<div id="toast"></div>
<div id="app">
  <div id="main" style="display:none">
    <div class="app-header">
      <span class="app-title">&#x26BD; World Cup 2026 Pool</span>
      <button class="admin-gear" onclick="openAdmin()" title="Admin">&#x2699;&#xFE0F;</button>
    </div>
    <div class="prize-banner">&#x1F3C6; The winner gets <b>$100 donated to the nonprofit of their choice</b></div>
    <div class="tab-content" id="tab-content"></div>
    <nav class="tab-bar" id="tab-bar"></nav>
  </div>
</div>
<script>
var TEAMS_DATA = [{"name": "Mexico", "flag": "🇲🇽", "group": "A"}, {"name": "South Africa", "flag": "🇿🇦", "group": "A"}, {"name": "South Korea", "flag": "🇰🇷", "group": "A"}, {"name": "Czech Republic", "flag": "🇨🇿", "group": "A"}, {"name": "Canada", "flag": "🇨🇦", "group": "B"}, {"name": "Bosnia and Herzegovina", "flag": "🇧🇦", "group": "B"}, {"name": "Qatar", "flag": "🇶🇦", "group": "B"}, {"name": "Switzerland", "flag": "🇨🇭", "group": "B"}, {"name": "Brazil", "flag": "🇧🇷", "group": "C"}, {"name": "Morocco", "flag": "🇲🇦", "group": "C"}, {"name": "Haiti", "flag": "🇭🇹", "group": "C"}, {"name": "Scotland", "flag": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "group": "C"}, {"name": "United States", "flag": "🇺🇸", "group": "D"}, {"name": "Paraguay", "flag": "🇵🇾", "group": "D"}, {"name": "Australia", "flag": "🇦🇺", "group": "D"}, {"name": "Turkey", "flag": "🇹🇷", "group": "D"}, {"name": "Germany", "flag": "🇩🇪", "group": "E"}, {"name": "Curaçao", "flag": "🇨🇼", "group": "E"}, {"name": "Ivory Coast", "flag": "🇨🇮", "group": "E"}, {"name": "Ecuador", "flag": "🇪🇨", "group": "E"}, {"name": "Netherlands", "flag": "🇳🇱", "group": "F"}, {"name": "Japan", "flag": "🇯🇵", "group": "F"}, {"name": "Sweden", "flag": "🇸🇪", "group": "F"}, {"name": "Tunisia", "flag": "🇹🇳", "group": "F"}, {"name": "Belgium", "flag": "🇧🇪", "group": "G"}, {"name": "Egypt", "flag": "🇪🇬", "group": "G"}, {"name": "Iran", "flag": "🇮🇷", "group": "G"}, {"name": "New Zealand", "flag": "🇳🇿", "group": "G"}, {"name": "Spain", "flag": "🇪🇸", "group": "H"}, {"name": "Cape Verde", "flag": "🇨🇻", "group": "H"}, {"name": "Saudi Arabia", "flag": "🇸🇦", "group": "H"}, {"name": "Uruguay", "flag": "🇺🇾", "group": "H"}, {"name": "France", "flag": "🇫🇷", "group": "I"}, {"name": "Senegal", "flag": "🇸🇳", "group": "I"}, {"name": "Iraq", "flag": "🇮🇶", "group": "I"}, {"name": "Norway", "flag": "🇳🇴", "group": "I"}, {"name": "Argentina", "flag": "🇦🇷", "group": "J"}, {"name": "Algeria", "flag": "🇩🇿", "group": "J"}, {"name": "Austria", "flag": "🇦🇹", "group": "J"}, {"name": "Jordan", "flag": "🇯🇴", "group": "J"}, {"name": "Portugal", "flag": "🇵🇹", "group": "K"}, {"name": "DR Congo", "flag": "🇨🇩", "group": "K"}, {"name": "Uzbekistan", "flag": "🇺🇿", "group": "K"}, {"name": "Colombia", "flag": "🇨🇴", "group": "K"}, {"name": "England", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "group": "L"}, {"name": "Croatia", "flag": "🇭🇷", "group": "L"}, {"name": "Ghana", "flag": "🇬🇭", "group": "L"}, {"name": "Panama", "flag": "🇵🇦", "group": "L"}];

// ---- State ----
var appRole = localStorage.getItem('wc_role') || null;
var appPass = localStorage.getItem('wc_pass') || null;
var appName = localStorage.getItem('wc_name') || '';
var appTab = 0;
var configData = { setup: {}, results: {}, locked: false };
var allBrackets = [];
var myBracketId = localStorage.getItem('wc_bracket_id') ? Number(localStorage.getItem('wc_bracket_id')) : null;
var myEditToken = localStorage.getItem('wc_edit_token') || '';
var myPicks = {};
var currentRound = 'R32';
var adminResults = {};
var expandedLeaders = {};
var expandedBrackets = {};

var ROUNDS = ['R32', 'R16', 'QF', 'SF', 'F'];
var ROUND_NAMES = { R32: 'Round of 32', R16: 'Round of 16', QF: 'Quarterfinals', SF: 'Semifinals', F: 'Final' };
var ROUND_MATCH_COUNTS = { R32: 16, R16: 8, QF: 4, SF: 2, F: 1 };
var ROUND_POINTS = { R32: 20, R16: 40, QF: 80, SF: 160, F: 320 }; // ESPN-style: each round totals 320 pts
var TOTAL_PICKS = 31;

function teamFlag(name) {
  var t = TEAMS_DATA.find(function(x) { return x.name === name; });
  return t ? t.flag : '';
}

function getSlots() {
  var s = configData.setup && configData.setup.slots;
  if (s && s.length === 32) return s;
  // default slots
  var grpOrder = ['A','B','C','D','E','F','G','H','I','J','K','L'];
  var byGroup = {};
  TEAMS_DATA.forEach(function(t) { if (!byGroup[t.group]) byGroup[t.group] = []; byGroup[t.group].push(t.name); });
  var slots = [];
  for (var i = 0; i < 12; i++) {
    var g = grpOrder[i];
    if (byGroup[g]) { slots.push(byGroup[g][0] || ''); slots.push(byGroup[g][1] || ''); }
  }
  for (var j = 0; j < 4; j++) {
    var g2 = grpOrder[j];
    if (byGroup[g2]) { slots.push(byGroup[g2][2] || ''); slots.push(byGroup[g2][3] || ''); }
  }
  return slots;
}

function getMatchTeams(round, matchIdx) {
  var slots = getSlots();
  var results = configData.results || {};
  if (round === 'R32') {
    return [slots[matchIdx * 2] || '?', slots[matchIdx * 2 + 1] || '?'];
  }
  var prevRound = ROUNDS[ROUNDS.indexOf(round) - 1];
  var t1 = results[prevRound + '_' + (matchIdx * 2)] || null;
  var t2 = results[prevRound + '_' + (matchIdx * 2 + 1)] || null;
  return [t1 || '?', t2 || '?'];
}

function getPickMatchTeams(round, matchIdx, picks) {
  var slots = getSlots();
  if (round === 'R32') {
    return [slots[matchIdx * 2] || '?', slots[matchIdx * 2 + 1] || '?'];
  }
  var prevRound = ROUNDS[ROUNDS.indexOf(round) - 1];
  var t1 = picks[prevRound + '_' + (matchIdx * 2)] || null;
  var t2 = picks[prevRound + '_' + (matchIdx * 2 + 1)] || null;
  return [t1 || null, t2 || null];
}

function cascadeClean(picks, round, matchIdx) {
  var ri = ROUNDS.indexOf(round);
  var mi = matchIdx;
  for (var r = ri + 1; r < ROUNDS.length; r++) {
    var nr = ROUNDS[r];
    var parentMatch = Math.floor(mi / 2);
    delete picks[nr + '_' + parentMatch];
    mi = parentMatch;
  }
}

function calcScore(picks, results) {
  var score = 0;
  ROUNDS.forEach(function(round) {
    var cnt = ROUND_MATCH_COUNTS[round];
    for (var i = 0; i < cnt; i++) {
      var key = round + '_' + i;
      if (picks[key] && results[key] && picks[key] === results[key]) {
        score += ROUND_POINTS[round];
      }
    }
  });
  return score;
}

function totalPickCount(picks) {
  var total = 0;
  ROUNDS.forEach(function(r) {
    var cnt = ROUND_MATCH_COUNTS[r];
    for (var i = 0; i < cnt; i++) { if (picks[r + '_' + i]) total++; }
  });
  return total;
}

// ---- API helpers ----
function api(method, path, body) {
  var opts = {
    method: method,
    headers: { 'Content-Type': 'application/json', 'x-pass': appPass || '' },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);
  return fetch('/api' + path, opts).then(function(r) { return r.json(); });
}

// ---- Toast ----
var toastTimer = null;
function showToast(msg, type) {
  var el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'show ' + (type || '');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { el.className = ''; }, 2500);
}

// ---- Init ----
function init() {
  // Public pool: everyone participates with no code. Admin role persists only
  // if it was previously unlocked on this device.
  if (appRole !== 'admin') { appRole = 'friend'; appPass = ''; }
  startMain();
}

// Admin unlock (Jason only) — gives the Setup tab + results entry + lock/delete.
function openAdmin() {
  if (appRole === 'admin') {
    appRole = 'friend'; appPass = '';
    localStorage.removeItem('wc_role'); localStorage.removeItem('wc_pass');
    appTab = 0;
    showToast('Admin mode off', 'success');
    renderTabs(); renderTab(appTab);
    return;
  }
  var pass = (window.prompt('Admin code:') || '').trim();
  if (!pass) return;
  api('POST', '/login', { pass: pass }).then(function(data) {
    if (data.ok && data.role === 'admin') {
      appRole = 'admin';
      appPass = pass;
      localStorage.setItem('wc_role', appRole);
      localStorage.setItem('wc_pass', appPass);
      appTab = 0;
      showToast('Admin mode on', 'success');
      renderTabs(); renderTab(appTab);
    } else {
      showToast('Wrong admin code', 'error');
    }
  }).catch(function() { showToast('Connection error', 'error'); });
}

function startMain() {
  document.getElementById('main').style.display = 'flex';
  loadAll();
}

function loadAll() {
  Promise.all([
    api('GET', '/config').then(function(d) { configData = d; adminResults = Object.assign({}, d.results || {}); }),
    api('GET', '/brackets').then(function(d) { allBrackets = d.brackets || []; }),
  ]).then(function() {
    findMyBracket();
    renderTabs();
    renderTab(appTab);
  });
}

function findMyBracket() {
  // Ownership is editToken + id in localStorage — never display-name match
  // (matching by name let anyone overwrite another player's bracket).
  if (!myBracketId || !myEditToken) return;
  var b = allBrackets.find(function(x) { return x.id === myBracketId; });
  if (b) { myPicks = Object.assign({}, b.picks); if (!appName) appName = b.name; }
  else {
    // Stale local id (deleted) — clear ownership so user can create fresh
    myBracketId = null; myEditToken = '';
    localStorage.removeItem('wc_bracket_id');
    localStorage.removeItem('wc_edit_token');
  }
}

function clearMyOwnership() {
  myBracketId = null; myEditToken = ''; myPicks = {};
  localStorage.removeItem('wc_bracket_id');
  localStorage.removeItem('wc_edit_token');
}

// ---- Tab rendering ----
function renderTabs() {
  var bar = document.getElementById('tab-bar');
  var tabs = appRole === 'admin'
    ? [{ icon: '&#x2699;&#xFE0F;', label: 'Setup' }, { icon: '&#x1F3C6;', label: 'Leaderboard' }, { icon: '&#x1F4CB;', label: 'Brackets' }]
    : [{ icon: '&#x26BD;', label: 'My Bracket' }, { icon: '&#x1F3C6;', label: 'Leaderboard' }, { icon: '&#x1F4CB;', label: 'Brackets' }];
  bar.innerHTML = tabs.map(function(t, i) {
    return '<button class="tab-btn' + (i === appTab ? ' active' : '') + '" onclick="switchTab(' + i + ')">' +
      '<span class="tab-icon">' + t.icon + '</span><span>' + t.label + '</span></button>';
  }).join('');
}

function switchTab(i) {
  appTab = i;
  renderTabs();
  renderTab(i);
}

function renderTab(i) {
  var content = document.getElementById('tab-content');
  if (appRole === 'admin') {
    if (i === 0) renderAdminSetup(content);
    else if (i === 1) renderLeaderboard(content);
    else renderBracketsTab(content);
  } else {
    if (i === 0) renderMyBracket(content);
    else if (i === 1) renderLeaderboard(content);
    else renderBracketsTab(content);
  }
}

// ---- My Bracket (friend) ----
function renderMyBracket(content) {
  var html = '<div class="section-header">&#x26BD; My Bracket</div>';

  if (configData.locked) {
    html += '<div class="card" style="border-color:var(--red);color:var(--red);text-align:center;padding:1rem">&#x1F512; Predictions are locked</div>';
  }

  html += '<div class="name-section">' +
    '<label>Your Name</label>' +
    '<input type="text" id="my-name" placeholder="Enter your name" value="' + escHtml(appName) + '" oninput="onNameChange(this.value)">' +
    '</div>';

  var done = totalPickCount(myPicks);
  var pct = Math.round((done / TOTAL_PICKS) * 100);
  html += '<div class="progress-label">' + done + ' / ' + TOTAL_PICKS + ' picks (' + pct + '%)</div>' +
    '<div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:' + pct + '%"></div></div>';

  html += '<div class="round-nav">';
  ROUNDS.forEach(function(r) {
    var cnt = ROUND_MATCH_COUNTS[r];
    var allDone = true;
    for (var i = 0; i < cnt; i++) { if (!myPicks[r + '_' + i]) { allDone = false; break; } }
    var cls = r === currentRound ? ' active' : (allDone ? ' done' : '');
    html += '<button class="round-pill' + cls + '" onclick="setRound(' + "'" + r + "'" + ')">' + ROUND_NAMES[r] + '</button>';
  });
  html += '</div>';

  var matchCount = ROUND_MATCH_COUNTS[currentRound];
  for (var m = 0; m < matchCount; m++) {
    var teams = getPickMatchTeams(currentRound, m, myPicks);
    var t1 = teams[0], t2 = teams[1];
    var picked = myPicks[currentRound + '_' + m] || null;
    var label = ROUND_NAMES[currentRound] + ' -- Match ' + (m + 1);
    html += '<div class="match-card">' +
      '<div class="match-label">' + label + '</div>' +
      '<div class="match-teams">';
    if (!t1 && !t2) {
      html += '<div style="color:var(--muted);font-size:0.85rem;padding:0.5rem">Pick earlier rounds first</div>';
    } else {
      var t1safe = t1 ? jsq(t1) : '';
      var t2safe = t2 ? jsq(t2) : '';
      var t1cls = 'team-pick-btn' + (picked === t1 ? ' selected' : (picked && picked !== t1 ? ' eliminated' : ''));
      var t2cls = 'team-pick-btn' + (picked === t2 ? ' selected' : (picked && picked !== t2 ? ' eliminated' : ''));
      html += '<button class="' + t1cls + '" onclick="makePick(' + Q + currentRound + Q + ',' + m + ',' + Q + t1safe + Q + ')">' +
        '<span class="flag">' + teamFlag(t1) + '</span>' + escHtml(t1) + '</button>';
      html += '<span class="match-vs">VS</span>';
      html += '<button class="' + t2cls + '" onclick="makePick(' + Q + currentRound + Q + ',' + m + ',' + Q + t2safe + Q + ')">' +
        '<span class="flag">' + teamFlag(t2) + '</span>' + escHtml(t2) + '</button>';
    }
    html += '</div></div>';
  }

  html += '<div class="submit-section"><div class="submit-btn-wrap">';
  if (!configData.locked) {
    html += '<button class="btn gold-btn" onclick="submitBracket()">&#x1F4BE; Save Bracket</button>';
  }
  if (myBracketId) {
    html += '<div style="font-size:0.8rem;color:var(--accent);text-align:center">&#x2713; Bracket saved on this device</div>';
    if (!configData.locked) {
      html += '<button class="btn" style="margin-top:0.5rem" onclick="if(confirm(' + Q + 'Start a new bracket? Your old one stays in the pool.' + Q + ')){clearMyOwnership();renderTab(appTab);}">Start new bracket</button>';
    }
  }
  html += '</div></div>';
  content.innerHTML = html;
}

function onNameChange(val) {
  appName = val;
  localStorage.setItem('wc_name', val);
}

function setRound(r) {
  currentRound = r;
  renderTab(appTab);
}

function makePick(round, matchIdx, team) {
  var prev = myPicks[round + '_' + matchIdx];
  if (prev === team) return;
  cascadeClean(myPicks, round, matchIdx);
  myPicks[round + '_' + matchIdx] = team;
  renderTab(appTab);
}

function submitBracket() {
  if (!appName.trim()) { showToast('Enter your name first', 'error'); return; }
  var payload = { name: appName.trim(), picks: myPicks };
  if (myBracketId) {
    if (!myEditToken && appRole !== 'admin') {
      showToast('Missing edit key — start a new bracket on this device', 'error');
      return;
    }
    payload.editToken = myEditToken;
  }
  var p = myBracketId
    ? api('PUT', '/brackets/' + myBracketId, payload)
    : api('POST', '/brackets', payload);
  p.then(function(d) {
    if (d.ok) {
      if (!myBracketId && d.id) {
        myBracketId = d.id;
        localStorage.setItem('wc_bracket_id', String(d.id));
      }
      if (d.editToken) {
        myEditToken = d.editToken;
        localStorage.setItem('wc_edit_token', d.editToken);
      }
      api('GET', '/brackets').then(function(bd) {
        allBrackets = bd.brackets || [];
        showToast('Bracket saved!', 'success');
        launchConfetti();
        renderTab(appTab);
      });
    } else { showToast(d.error || 'Error saving', 'error'); }
  }).catch(function() { showToast('Connection error', 'error'); });
}

// ---- Leaderboard ----
function renderLeaderboard(content) {
  var results = configData.results || {};
  var hasResults = Object.keys(results).length > 0;
  var html = '<div class="section-header">&#x1F3C6; Leaderboard</div>';
  html += '<div class="scoring-note">ESPN-style scoring &mdash; correct pick: R32 20 &middot; R16 40 &middot; QF 80 &middot; SF 160 &middot; Champion 320</div>';
  if (!hasResults) {
    html += '<div class="empty-state">&#x23F3; Waiting for the tournament to start!</div>';
    if (allBrackets.length > 0) {
      html += '<div class="waiting-list">';
      allBrackets.forEach(function(b) {
        var champ = b.picks['F_0'] || '?';
        html += '<div class="waiting-item">&#x26BD; ' + escHtml(b.name) + ' &mdash; picks ' + teamFlag(champ) + ' ' + escHtml(champ) + '</div>';
      });
      html += '</div>';
    }
    content.innerHTML = html;
    return;
  }
  var scored = allBrackets.map(function(b) {
    return { id: b.id, name: b.name, picks: b.picks, score: calcScore(b.picks, results), champ: b.picks['F_0'] || null };
  }).sort(function(a, b) { return b.score - a.score; });
  scored.forEach(function(entry, idx) {
    var rankStr = idx === 0 ? '&#x1F947;' : (idx === 1 ? '&#x1F948;' : (idx === 2 ? '&#x1F949;' : String(idx + 1)));
    var isExp = expandedLeaders[entry.id];
    html += '<div class="leader-row' + (isExp ? ' expanded' : '') + '" onclick="toggleLeader(' + entry.id + ')">' +
      '<div class="rank">' + rankStr + '</div>' +
      '<div style="flex:1"><div class="leader-name">' + escHtml(entry.name) + '</div>' +
      '<div class="leader-champ">' + (entry.champ ? teamFlag(entry.champ) + ' ' + escHtml(entry.champ) : 'No champion pick') + '</div></div>' +
      '<div class="leader-score">' + entry.score + ' pts</div>' +
      '</div>';
    if (isExp) {
      html += '<div class="picks-detail">';
      ROUNDS.forEach(function(round) {
        html += '<div class="picks-round"><div class="picks-round-title">' + ROUND_NAMES[round] + '</div>';
        var cnt = ROUND_MATCH_COUNTS[round];
        for (var i = 0; i < cnt; i++) {
          var key = round + '_' + i;
          var pick = entry.picks[key];
          if (!pick) continue;
          var actual = results[key];
          var icon = actual ? (pick === actual ? '&#x2705;' : '&#x274C;') : '&#x23F3;';
          html += '<div class="pick-item"><span>' + icon + '</span>' + teamFlag(pick) + ' ' + escHtml(pick) + '</div>';
        }
        html += '</div>';
      });
      html += '</div>';
    }
  });
  content.innerHTML = html;
}

function toggleLeader(id) {
  expandedLeaders[id] = !expandedLeaders[id];
  renderTab(appTab);
}

// ---- Brackets tab ----
function renderBracketsTab(content) {
  var html = '<div class="section-header">&#x1F4CB; All Brackets</div>';
  if (allBrackets.length === 0) {
    html += '<div class="empty-state">No brackets submitted yet</div>';
    content.innerHTML = html;
    return;
  }
  allBrackets.forEach(function(b) {
    var champ = b.picks['F_0'] || null;
    var isExp = expandedBrackets[b.id];
    html += '<div class="bracket-entry' + (isExp ? ' expanded' : '') + '" onclick="toggleBracket(' + b.id + ')">' +
      '<div class="bracket-entry-header">' +
      '<div class="bracket-entry-name">&#x26BD; ' + escHtml(b.name) + '</div>' +
      '<div class="bracket-entry-champ">' + (champ ? teamFlag(champ) + ' ' + escHtml(champ) : 'No champ') + '</div>' +
      '</div>';
    if (isExp) {
      html += '<div class="bracket-entry-body">';
      ROUNDS.forEach(function(round) {
        var picks = [];
        var cnt = ROUND_MATCH_COUNTS[round];
        for (var i = 0; i < cnt; i++) {
          var key = round + '_' + i;
          if (b.picks[key]) picks.push(b.picks[key]);
        }
        if (picks.length === 0) return;
        html += '<div class="bracket-round"><div class="bracket-round-title">' + ROUND_NAMES[round] + '</div>' +
          '<div class="bracket-pick-list">';
        picks.forEach(function(p) {
          html += '<span class="bracket-pick-chip">' + teamFlag(p) + ' ' + escHtml(p) + '</span>';
        });
        html += '</div></div>';
      });
      html += '</div>';
    }
    html += '</div>';
  });
  content.innerHTML = html;
}

function toggleBracket(id) {
  expandedBrackets[id] = !expandedBrackets[id];
  renderTab(appTab);
}

// ---- Admin Setup ----
function renderAdminSetup(content) {
  var slots = getSlots();
  var allTeamNames = TEAMS_DATA.map(function(t) { return t.name; });
  var html = '<div class="section-header">&#x2699;&#xFE0F; Admin Setup</div>';

  html += '<div class="admin-section"><div class="admin-section-title">&#x1F512; Lock Status</div>';
  html += '<div class="lock-toggle">' +
    '<div class="lock-status ' + (configData.locked ? 'locked-text' : 'open-text') + '">' +
    (configData.locked ? '&#x1F512; Predictions LOCKED' : '&#x1F513; Predictions OPEN') + '</div>' +
    '<button class="btn ' + (configData.locked ? 'danger' : 'secondary') + '" onclick="toggleLock()">' +
    (configData.locked ? 'Unlock' : 'Lock') + '</button></div></div>';

  html += '<div class="admin-section"><div class="admin-section-title">&#x1F3DF;&#xFE0F; R32 Slot Assignments</div>';
  var matchLabels = [
    'M1 (A1 vs B1)', 'M2 (A2 vs B2)', 'M3 (C1 vs D1)', 'M4 (C2 vs D2)',
    'M5 (E1 vs F1)', 'M6 (E2 vs F2)', 'M7 (G1 vs H1)', 'M8 (G2 vs H2)',
    'M9 (I1 vs J1)', 'M10 (I2 vs J2)', 'M11 (K1 vs L1)', 'M12 (K2 vs L2)',
    'M13 (A3 vs B3)', 'M14 (A4 vs B4)', 'M15 (C3 vs D3)', 'M16 (C4 vs D4)',
  ];
  for (var m = 0; m < 16; m++) {
    var s1i = m * 2, s2i = m * 2 + 1;
    html += '<div class="slot-row">' +
      '<div class="slot-label">' + matchLabels[m] + '</div>' +
      '<select class="slot-select" id="slot-' + s1i + '">' +
      buildTeamOptions(allTeamNames, slots[s1i]) + '</select>' +
      '<span style="color:var(--muted)">vs</span>' +
      '<select class="slot-select" id="slot-' + s2i + '">' +
      buildTeamOptions(allTeamNames, slots[s2i]) + '</select></div>';
  }
  html += '<button class="btn" onclick="saveSetup()" style="margin-top:0.75rem">Save Setup</button></div>';

  html += '<div class="admin-section"><div class="admin-section-title">&#x1F3C6; Enter Results</div>';
  ROUNDS.forEach(function(round) {
    html += '<div style="margin-bottom:0.75rem"><div style="font-size:0.85rem;color:var(--muted);margin-bottom:0.4rem">' + ROUND_NAMES[round] + '</div>';
    var cnt = ROUND_MATCH_COUNTS[round];
    for (var i = 0; i < cnt; i++) {
      var teams = getMatchTeams(round, i);
      var t1 = teams[0], t2 = teams[1];
      var winner = adminResults[round + '_' + i] || null;
      var key = round + '_' + i;
      var t1safe = t1 !== '?' ? jsq(t1) : '';
      var t2safe = t2 !== '?' ? jsq(t2) : '';
      html += '<div class="result-match"><div class="result-match-label">Match ' + (i + 1) + '</div>' +
        '<div class="result-teams">';
      if (t1 !== '?') {
        html += '<button class="result-team-btn' + (winner === t1 ? ' winner' : '') + '" onclick="setResult(' + Q + key + Q + ',' + Q + t1safe + Q + ')">' +
          teamFlag(t1) + ' ' + escHtml(t1) + '</button>';
      } else {
        html += '<div style="flex:1;color:var(--muted);font-size:0.8rem;padding:0.4rem">TBD</div>';
      }
      html += '<span style="color:var(--muted);align-self:center;padding:0 0.25rem">vs</span>';
      if (t2 !== '?') {
        html += '<button class="result-team-btn' + (winner === t2 ? ' winner' : '') + '" onclick="setResult(' + Q + key + Q + ',' + Q + t2safe + Q + ')">' +
          teamFlag(t2) + ' ' + escHtml(t2) + '</button>';
      } else {
        html += '<div style="flex:1;color:var(--muted);font-size:0.8rem;padding:0.4rem">TBD</div>';
      }
      html += '</div></div>';
    }
    html += '</div>';
  });
  html += '<button class="btn" onclick="saveResults()" style="margin-top:0.25rem">Save Results</button></div>';

  html += '<div class="admin-section"><div class="admin-section-title">&#x1F5D1;&#xFE0F; Manage Brackets</div>';
  if (allBrackets.length === 0) {
    html += '<div style="color:var(--muted);font-size:0.9rem">No brackets submitted yet</div>';
  } else {
    allBrackets.forEach(function(b) {
      html += '<div class="manage-row">' +
        '<div class="manage-name">&#x26BD; ' + escHtml(b.name) + '</div>' +
        '<div class="manage-date">' + b.created_at.slice(0,10) + '</div>' +
        '<button class="btn danger" style="padding:0.3rem 0.75rem;font-size:0.8rem" onclick="deleteBracket(' + b.id + ')">Delete</button>' +
        '</div>';
    });
  }
  html += '</div>';
  content.innerHTML = html;
}

function buildTeamOptions(names, selected) {
  return names.map(function(n) {
    return '<option value="' + escHtml(n) + '"' + (n === selected ? ' selected' : '') + '>' + escHtml(n) + '</option>';
  }).join('');
}

function saveSetup() {
  var slots = [];
  for (var i = 0; i < 32; i++) {
    var el = document.getElementById('slot-' + i);
    slots.push(el ? el.value : '');
  }
  api('PUT', '/config/setup', { slots: slots }).then(function(d) {
    if (d.ok) { configData.setup = { slots: slots }; showToast('Setup saved!', 'success'); }
    else showToast(d.error || 'Error', 'error');
  });
}

function toggleLock() {
  api('PUT', '/config/lock', { locked: !configData.locked }).then(function(d) {
    if (d.ok) { configData.locked = !configData.locked; renderTab(appTab); }
    else showToast(d.error || 'Error', 'error');
  });
}

function setResult(key, team) {
  if (adminResults[key] === team) { delete adminResults[key]; }
  else { adminResults[key] = team; }
  renderTab(appTab);
}

function saveResults() {
  api('PUT', '/config/results', { results: adminResults }).then(function(d) {
    if (d.ok) { configData.results = Object.assign({}, adminResults); showToast('Results saved!', 'success'); }
    else showToast(d.error || 'Error', 'error');
  });
}

function deleteBracket(id) {
  if (!confirm('Delete this bracket?')) return;
  api('DELETE', '/brackets/' + id).then(function(d) {
    if (d.ok) {
      allBrackets = allBrackets.filter(function(b) { return b.id !== id; });
      renderTab(appTab);
      showToast('Deleted', 'success');
    } else showToast(d.error || 'Error', 'error');
  });
}

// ---- Confetti ----
function launchConfetti() {
  var canvas = document.getElementById('confetti-canvas');
  canvas.style.display = 'block';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');
  var colors = ['#ff4d4d','#4d79ff','#ffd700','#00d084','#ffffff','#ff9900'];
  var particles = [];
  for (var i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height * 0.5,
      w: 8 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.2,
    });
  }
  var startTime = Date.now();
  function draw() {
    var elapsed = Date.now() - startTime;
    if (elapsed > 3000) { canvas.style.display = 'none'; return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function(p) {
      p.x += p.vx; p.y += p.vy; p.angle += p.spin;
      if (p.y > canvas.height) p.y = -20;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ---- Utils ----
function escHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
// Escape a value for embedding inside a single-quoted JS string in an inline
// onclick handler. Builds the backslash via fromCharCode(92) so there are NO
// literal backslashes in the Worker template literal (avoids double-escaping).
function jsq(s) {
  var BS = String.fromCharCode(92);
  return String(s == null ? '' : s).split(BS).join(BS + BS).split("'").join(BS + "'");
}
// Single-quote char built without a literal quote token — used to assemble
// inline onclick="fn('arg')" attributes without any ambiguous stray quotes.
var Q = String.fromCharCode(39);

// ---- Boot ----
init();
</script>
</body>
</html>`;

const ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: https://worldcup-bracket.jwpalm99.workers.dev/sitemap.xml
`;

const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://worldcup-bracket.jwpalm99.workers.dev/</loc>
  </url>
</urlset>
`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (url.pathname.startsWith('/api/')) {
      return handleAPI(request, env);
    }
    if (url.pathname === '/robots.txt') {
      return new Response(ROBOTS_TXT, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
    if (url.pathname === '/sitemap.xml') {
      return new Response(SITEMAP_XML, {
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
      });
    }
    return new Response(HTML, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  },
};
