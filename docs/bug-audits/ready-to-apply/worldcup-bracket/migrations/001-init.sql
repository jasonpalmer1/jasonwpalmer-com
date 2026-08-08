CREATE TABLE IF NOT EXISTS config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  setup_json TEXT NOT NULL DEFAULT '{}',
  results_json TEXT NOT NULL DEFAULT '{}',
  locked INTEGER NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO config (id, setup_json, results_json, locked) VALUES (1, '{}', '{}', 0);

CREATE TABLE IF NOT EXISTS brackets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  picks_json TEXT NOT NULL DEFAULT '{}',
  edit_token TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
