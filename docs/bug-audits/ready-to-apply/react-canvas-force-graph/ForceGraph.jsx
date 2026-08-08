import { useEffect, useRef, useState } from 'react'

// Dependency-free force-directed graph, rendered on a Canvas. A single
// standalone React component: no d3-force, no force-graph, no physics
// library — just React and the Canvas 2D API. Copy this file into your
// project and adapt it as needed.
//
// Props
//   nodes        [{ id, label, r, color, group? }]   (r is a relative radius hint)
//   links        [{ source, target }]                 (ids referencing nodes)
//   ambient      bool   slow perpetual drift vs. settle-and-stop
//   interactive  bool   hover highlight + tooltip (+ optional click)
//   onNodePick   fn(id) optional click handler
//   height       number canvas CSS height (px)
//   maxNodes     number hard cap on rendered nodes (densest links kept)
//
// Performance / correctness guards:
//   - O(n^2) repulsion is fine for the capped node counts (<= ~150)
//   - rAF loop pauses when offscreen (IntersectionObserver) or tab hidden
//   - prefers-reduced-motion => render ONE settled static frame, no animation
//   - deterministic seeding (golden-angle spiral), no Math.random
//   - cleans up rAF + observers + listeners on unmount

const GOLDEN = Math.PI * (3 - Math.sqrt(5)) // ~2.39996 rad

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Build the simulation state once from props (deterministic positions).
function buildSim(nodes, links, w, h) {
  const idx = new Map()
  const N = nodes.map((n, i) => {
    idx.set(n.id, i)
    // golden-angle spiral seed, scaled to the viewport — deterministic.
    const t = i + 0.5
    const rad = Math.sqrt(t / nodes.length) * Math.min(w, h) * 0.42
    const ang = t * GOLDEN
    return {
      id: n.id,
      label: n.label,
      r: Math.max(2.2, n.r || 4),
      color: n.color || '#5b8cff',
      group: n.group,
      x: w / 2 + Math.cos(ang) * rad,
      y: h / 2 + Math.sin(ang) * rad,
      vx: 0,
      vy: 0,
    }
  })
  const L = []
  const adj = nodes.map(() => new Set())
  for (const l of links) {
    const a = idx.get(l.source)
    const b = idx.get(l.target)
    if (a == null || b == null || a === b) continue
    L.push({ a, b, phase: (L.length * 0.37) % 1 })
    adj[a].add(b)
    adj[b].add(a)
  }
  return { N, L, idx, adj }
}

/**
 * Dependency-free, canvas-rendered force-directed graph.
 *
 * @param {Object} props
 * @param {Array<{id: string|number, label?: string, r?: number, color?: string, group?: string}>} props.nodes
 *   Node list. `r` is a relative radius hint (px-ish); `color` defaults to a
 *   generic blue (`#5b8cff`) when omitted; `group` is passed through for
 *   your own use (e.g. color-coding) but isn't read by the component itself.
 * @param {Array<{source: string|number, target: string|number}>} props.links
 *   Edge list referencing node `id`s. Edges with unknown/self ids are skipped.
 * @param {boolean} [props.ambient=false]
 *   When true, the simulation drifts perpetually at a low temperature instead
 *   of cooling down and settling to a stop.
 * @param {boolean} [props.interactive=false]
 *   Enables pointer hover highlighting (dims unrelated nodes/edges) and an
 *   optional tooltip (`.fg-tip` div) showing the hovered node's label.
 * @param {(id: string|number) => void} [props.onNodePick]
 *   Called with a node's `id` on click. Requires `interactive`.
 * @param {number} [props.height=460]
 *   CSS height of the canvas, in pixels. Width always fills the parent.
 * @param {number} [props.maxNodes=150]
 *   Hard cap on rendered nodes. If `nodes` exceeds this, the most-connected
 *   nodes (by degree) are kept and everything else is dropped along with
 *   their edges. Keeps the O(n^2) repulsion pass cheap.
 * @param {boolean} [props.packets=true]
 *   Draws small animated dots traveling along edges. Purely decorative.
 * @param {string} [props.className]
 *   Class applied to the outer wrapper div.
 * @param {string} [props.ariaLabel='Network graph']
 *   Accessible label for the wrapper, which has `role="img"`.
 */
export default function ForceGraph({
  nodes,
  links,
  ambient = false,
  interactive = false,
  onNodePick,
  height = 460,
  maxNodes = 150,
  packets = true,
  className,
  ariaLabel = 'Network graph',
}) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const simRef = useRef(null)
  const rafRef = useRef(0)
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })
  const hoverRef = useRef(-1)
  const visibleRef = useRef(true)
  const tRef = useRef(0)
  // Keep latest callback without rebuilding the simulation on identity change
  const onNodePickRef = useRef(onNodePick)
  onNodePickRef.current = onNodePick
  const [tip, setTip] = useState(null) // { x, y, label }

  const reduce = prefersReducedMotion()
  // stable signature so we only rebuild the sim when the graph truly changes
  const sig =
    nodes.map((n) => n.id).join(',') +
    '|' +
    links.map((l) => l.source + '>' + l.target).join(',')

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')

    // cap nodes: keep the most-connected when over the limit
    let useNodes = nodes
    let useLinks = links
    if (nodes.length > maxNodes) {
      const deg = new Map(nodes.map((n) => [n.id, 0]))
      for (const l of links) {
        deg.set(l.source, (deg.get(l.source) || 0) + 1)
        deg.set(l.target, (deg.get(l.target) || 0) + 1)
      }
      const kept = new Set(
        [...nodes]
          .sort((a, b) => (deg.get(b.id) || 0) - (deg.get(a.id) || 0))
          .slice(0, maxNodes)
          .map((n) => n.id),
      )
      useNodes = nodes.filter((n) => kept.has(n.id))
      useLinks = links.filter((l) => kept.has(l.source) && kept.has(l.target))
    }

    const measure = () => {
      const rect = wrap.getBoundingClientRect()
      const w = Math.max(1, Math.round(rect.width))
      const h = Math.max(1, Math.round(height))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      sizeRef.current = { w, h, dpr }
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
    }
    measure()

    const { w, h } = sizeRef.current
    simRef.current = buildSim(useNodes, useLinks, w, h)

    // -- physics tuning --------------------------------------------------
    const REPULSE = 1400
    const SPRING = 0.012
    const SPRING_LEN = 64
    const GRAVITY = 0.0016
    const DAMP = 0.86
    const AMBIENT_TEMP = ambient ? 0.05 : 0

    function step(cool) {
      const { N, L } = simRef.current
      const { w, h } = sizeRef.current
      const cx = w / 2
      const cy = h / 2
      // pairwise repulsion (O(n^2))
      for (let i = 0; i < N.length; i++) {
        const a = N[i]
        for (let j = i + 1; j < N.length; j++) {
          const b = N[j]
          let dx = a.x - b.x
          let dy = a.y - b.y
          let d2 = dx * dx + dy * dy
          if (d2 < 0.01) {
            dx = (i - j) * 0.5 + 0.1
            dy = (i + j) * 0.5 + 0.1
            d2 = dx * dx + dy * dy
          }
          const d = Math.sqrt(d2)
          const f = REPULSE / d2
          const fx = (dx / d) * f
          const fy = (dy / d) * f
          a.vx += fx
          a.vy += fy
          b.vx -= fx
          b.vy -= fy
        }
      }
      // spring attraction along links
      for (const l of L) {
        const a = N[l.a]
        const b = N[l.b]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.sqrt(dx * dx + dy * dy) || 0.01
        const f = (d - SPRING_LEN) * SPRING
        const fx = (dx / d) * f
        const fy = (dy / d) * f
        a.vx += fx
        a.vy += fy
        b.vx -= fx
        b.vy -= fy
      }
      // centering gravity + integrate + damping
      for (const n of N) {
        n.vx += (cx - n.x) * GRAVITY
        n.vy += (cy - n.y) * GRAVITY
        if (AMBIENT_TEMP) {
          // deterministic-ish jitter from time + index, keeps perpetual drift
          n.vx += Math.sin(tRef.current * 0.7 + n.x * 0.05) * AMBIENT_TEMP
          n.vy += Math.cos(tRef.current * 0.6 + n.y * 0.05) * AMBIENT_TEMP
        }
        n.vx *= DAMP * cool
        n.vy *= DAMP * cool
        n.x += n.vx
        n.y += n.vy
        // soft bounds
        const pad = n.r + 6
        if (n.x < pad) { n.x = pad; n.vx *= -0.4 }
        if (n.x > w - pad) { n.x = w - pad; n.vx *= -0.4 }
        if (n.y < pad) { n.y = pad; n.vy *= -0.4 }
        if (n.y > h - pad) { n.y = h - pad; n.vy *= -0.4 }
      }
    }

    function draw() {
      const { N, L, adj } = simRef.current
      const { w, h, dpr } = sizeRef.current
      const hov = hoverRef.current
      const hiSet = hov >= 0 ? adj[hov] : null
      ctx.save()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      // edges
      ctx.lineWidth = 1
      for (const l of L) {
        const a = N[l.a]
        const b = N[l.b]
        const hot = hov >= 0 && (l.a === hov || l.b === hov)
        const dim = hov >= 0 && !hot
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = hot
          ? 'rgba(155,188,255,0.55)'
          : dim
            ? 'rgba(120,140,180,0.04)'
            : 'rgba(120,140,180,0.10)'
        ctx.lineWidth = hot ? 1.4 : 0.8
        ctx.stroke()

        // animated data packet traveling along the edge
        if (packets && !dim) {
          const p = (tRef.current * 0.18 + l.phase) % 1
          const px = a.x + (b.x - a.x) * p
          const py = a.y + (b.y - a.y) * p
          ctx.beginPath()
          ctx.arc(px, py, hot ? 2 : 1.4, 0, Math.PI * 2)
          ctx.fillStyle = hot ? 'rgba(234,241,255,0.95)' : 'rgba(200,216,255,0.5)'
          ctx.fill()
        }
      }

      // nodes (glow disc)
      for (let i = 0; i < N.length; i++) {
        const n = N[i]
        const isHov = i === hov
        const lit = hov < 0 || isHov || (hiSet && hiSet.has(i))
        const a = lit ? 1 : 0.22
        // outer glow
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3.2)
        glow.addColorStop(0, hexA(n.color, 0.5 * a))
        glow.addColorStop(1, hexA(n.color, 0))
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 3.2, 0, Math.PI * 2)
        ctx.fill()
        // core disc
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = hexA(n.color, a)
        ctx.fill()
        if (isHov) {
          ctx.lineWidth = 1.5
          ctx.strokeStyle = 'rgba(220,231,255,0.9)'
          ctx.stroke()
        }
      }
      ctx.restore()
    }

    let cool = 1
    let settleFrames = 0
    function frame() {
      rafRef.current = 0
      if (!visibleRef.current || document.hidden) return // paused
      tRef.current += 1 / 60
      if (ambient) {
        step(1) // perpetual
      } else {
        cool = Math.max(0.55, cool * 0.992)
        step(cool)
        settleFrames++
      }
      draw()
      // settle-and-stop: cool down then halt (unless ambient or animating packets)
      const keepGoing = ambient || packets || settleFrames < 320
      if (keepGoing) rafRef.current = requestAnimationFrame(frame)
    }

    function staticFrame() {
      // reduced motion: run physics headlessly to settle, draw once, no rAF
      for (let k = 0; k < 280; k++) step(Math.max(0.5, 1 - k / 400))
      draw()
    }

    if (reduce) {
      staticFrame()
    } else {
      rafRef.current = requestAnimationFrame(frame)
    }

    // -- visibility / lifecycle guards -----------------------------------
    const io = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0]?.isIntersecting ?? true
        if (visibleRef.current && !reduce && !rafRef.current) {
          rafRef.current = requestAnimationFrame(frame)
        }
      },
      { threshold: 0.01 },
    )
    io.observe(wrap)

    const onVis = () => {
      if (!document.hidden && !reduce && visibleRef.current && !rafRef.current) {
        rafRef.current = requestAnimationFrame(frame)
      }
    }
    document.addEventListener('visibilitychange', onVis)

    let resizeRAF = 0
    const onResize = () => {
      if (resizeRAF) return
      resizeRAF = requestAnimationFrame(() => {
        resizeRAF = 0
        measure()
        if (reduce) staticFrame()
      })
    }
    window.addEventListener('resize', onResize)

    // -- interactivity ----------------------------------------------------
    function pick(clientX, clientY) {
      const rect = canvas.getBoundingClientRect()
      const mx = clientX - rect.left
      const my = clientY - rect.top
      const { N } = simRef.current
      let best = -1
      let bestD = Infinity
      for (let i = 0; i < N.length; i++) {
        const n = N[i]
        const d = (n.x - mx) ** 2 + (n.y - my) ** 2
        const rr = (n.r + 6) ** 2
        if (d < rr && d < bestD) { bestD = d; best = i }
      }
      return best
    }

    const onMove = (e) => {
      const i = pick(e.clientX, e.clientY)
      if (i !== hoverRef.current) {
        hoverRef.current = i
        canvas.style.cursor = i >= 0 && onNodePickRef.current ? 'pointer' : 'default'
        if (i >= 0) {
          const n = simRef.current.N[i]
          setTip({ x: n.x, y: n.y, label: n.label })
        } else {
          setTip(null)
        }
        // wake the loop if it had settled, so the highlight repaints
        if (!reduce && !rafRef.current && visibleRef.current) {
          rafRef.current = requestAnimationFrame(frame)
        }
        if (reduce) draw()
      }
    }
    const onLeave = () => {
      if (hoverRef.current !== -1) {
        hoverRef.current = -1
        setTip(null)
        if (reduce) draw()
      }
    }
    const onClick = (e) => {
      const pickFn = onNodePickRef.current
      if (!pickFn) return
      const i = pick(e.clientX, e.clientY)
      if (i >= 0) pickFn(simRef.current.N[i].id)
    }

    if (interactive) {
      canvas.addEventListener('pointermove', onMove)
      canvas.addEventListener('pointerleave', onLeave)
      canvas.addEventListener('click', onClick)
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (resizeRAF) cancelAnimationFrame(resizeRAF)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('click', onClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig, ambient, interactive, height, maxNodes, packets, reduce])

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: 'relative', width: '100%', height }}
      role="img"
      aria-label={ariaLabel}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      {interactive && tip && (
        <div
          className="fg-tip"
          style={{ left: tip.x, top: tip.y }}
          aria-hidden="true"
        >
          {tip.label}
        </div>
      )}
    </div>
  )
}

// "#rgb" / "#rrggbb" / "#rrggbbaa" + alpha -> rgba() string. Passes through rgba/hsl.
function hexA(color, a) {
  if (color[0] === '#') {
    let hex = color.slice(1)
    if (hex.length === 3 || hex.length === 4) {
      hex = [...hex].map((c) => c + c).join('')
    }
    if (hex.length >= 6) hex = hex.slice(0, 6)
    const n = parseInt(hex, 16)
    const r = (n >> 16) & 255
    const g = (n >> 8) & 255
    const b = n & 255
    return `rgba(${r},${g},${b},${a})`
  }
  return color
}
