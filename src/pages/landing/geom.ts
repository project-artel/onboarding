// 랜딩 지도의 기하. 직각 경로와 경로 위의 점.

export type Pt = { x: number; y: number }
export type Poly = { pts: Pt[]; cum: number[]; total: number }

/** 직각 경로. 가로로 더 멀면 가로-세로-가로, 아니면 세로-가로-세로로 꺾는다. */
export function elbow(a: Pt, b: Pt): Pt[] {
  const dx = b.x - a.x
  const dy = b.y - a.y
  if (Math.abs(dx) < 0.5 || Math.abs(dy) < 0.5) return [b]
  if (Math.abs(dx) >= Math.abs(dy)) {
    const mx = a.x + dx / 2
    return [{ x: mx, y: a.y }, { x: mx, y: b.y }, b]
  }
  const my = a.y + dy / 2
  return [{ x: a.x, y: my }, { x: b.x, y: my }, b]
}

export const toD = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

export function poly(pts: Pt[]): Poly {
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y))
  return { pts, cum, total: cum[cum.length - 1] }
}

export function pointAt(p: Poly, length: number): Pt {
  const L = Math.max(0, Math.min(p.total, length))
  for (let i = 1; i < p.pts.length; i++) {
    if (p.cum[i] >= L) {
      const seg = p.cum[i] - p.cum[i - 1] || 1
      const k = (L - p.cum[i - 1]) / seg
      const a = p.pts[i - 1]
      const b = p.pts[i]
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }
    }
  }
  return p.pts[p.pts.length - 1]
}

const pad = (n: number, w = 2) => String(n).padStart(w, '0')
export function fmt(sec: number) {
  const ms = Math.max(0, Math.round(sec * 1000))
  return `${pad(Math.floor(ms / 60000))}:${pad(Math.floor(ms / 1000) % 60)}.${pad(ms % 1000, 3)}`
}

export const easeInOut = (f: number) => (f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2)
