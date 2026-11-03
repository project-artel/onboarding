// 랜딩 장면의 반복 timeline. 장면의 기본 모양이 마지막 상태이고, 반복은 섹션이 화면 가까이 있을 때만 돈다.
import { gsap } from 'gsap'
import { easeInOut, pointAt } from './geom'
import { P1_POLY, P3_A, P3_B, S2_CLICKS, S2_PATH, S2_POLY, tileXY } from './sceneGeometry'

export type SceneLoop = { tl: gsap.core.Timeline; rest: () => void; el: Element }

function loopRegression(el: Element) {
  const layers = Array.from(el.querySelectorAll<HTMLElement>('.p1-layer'))
  const traces = Array.from(el.querySelectorAll<SVGPathElement>('.p1-trace'))
  const cursors = Array.from(el.querySelectorAll<SVGPathElement>('.p1-cursor'))
  const L = P1_POLY.total
  const st = { t: 3 }
  const apply = () => {
    const k = Math.min(2, Math.floor(st.t))
    const e = easeInOut(st.t >= 3 ? 1 : st.t - k)
    traces.forEach((p, j) => (p.style.strokeDashoffset = String(j < k ? 0 : j === k ? L * (1 - e) : L)))
    layers.forEach((l, j) => l.classList.toggle('is-on', j === k))
    const pt = pointAt(P1_POLY, e * L)
    cursors[k].setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) scale(1.6)`)
  }
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true })
  tl.fromTo(st, { t: 0 }, { t: 1, duration: 1.9, ease: 'none', onUpdate: apply })
    .to(st, { t: 2, duration: 1.9, ease: 'none', onUpdate: apply }, '+=0.35')
    .to(st, { t: 3, duration: 1.9, ease: 'none', onUpdate: apply }, '+=0.35')
  return {
    tl,
    rest: () => {
      st.t = 3
      apply()
    },
  }
}

function loopRepro(el: Element) {
  const pin = el.querySelector<HTMLElement>('.p2-pin')!
  const loop = el.querySelector<SVGPathElement>('.p2-loop')!
  const tl = gsap.timeline({ repeat: -1, paused: true })
  tl.call(() => pin.classList.remove('is-reopen'), undefined, 0.01)
    .set(loop, { strokeDashoffset: 1 }, 0.01)
    .to(loop, { strokeDashoffset: 0, duration: 1.6, ease: 'power1.inOut' }, 1.1)
    .call(() => pin.classList.add('is-reopen'), undefined, 2.7)
    .to({}, { duration: 2 })
    .to(loop, { opacity: 0, duration: 0.4 })
    .set(loop, { opacity: 1, strokeDashoffset: 1 })
  return {
    tl,
    rest: () => {
      pin.classList.add('is-reopen')
      gsap.set(loop, { strokeDashoffset: 0, opacity: 1 })
    },
  }
}

function loopCases(el: Element) {
  const fresh = Array.from(el.querySelectorAll<HTMLElement>('.p3-new'))
  const curA = el.querySelector<SVGSVGElement>('.p3-cur-a')!
  const curB = el.querySelector<SVGSVGElement>('.p3-cur-b')!
  const tl = gsap.timeline({ repeat: -1, paused: true })
  tl.set(fresh, { opacity: 0, scale: 0.4 }, 0.01)
  fresh.forEach((cell, i) => tl.to(cell, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' }, 0.4 + i * 0.45))
  const hop = (cur: SVGSVGElement, cells: [number, number][], offset: number) => {
    const seq = [...cells, ...[...cells].reverse().slice(1, -1)]
    seq.forEach((cell, i) => {
      const p = tileXY(cell)
      const to = { x: p.x + 8, y: p.y + 8, z: 40 }
      if (i === 0) tl.set(cur, to, offset)
      else tl.to(cur, { ...to, duration: 0.45, ease: 'power2.inOut' }, offset + i * 1.2)
    })
  }
  hop(curA, P3_A, 0.05)
  hop(curB, P3_B, 0.6)
  tl.to({}, { duration: 1.2 })
  return {
    tl,
    rest: () => {
      gsap.set(fresh, { opacity: 1, scale: 1 })
    },
  }
}

function loopConnect(el: Element) {
  const cube = el.querySelector<HTMLElement>('.s1-cube')!
  const check = el.querySelector<HTMLElement>('.s1-check')!
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6, paused: true })
  tl.call(() => check.classList.add('is-off'), undefined, 0.01)
    .fromTo(cube, { x: 110 }, { x: 0, duration: 0.9, ease: 'power3.inOut', immediateRender: false }, 0.2)
    .call(() => check.classList.remove('is-off'), undefined, 1.15)
    .to({}, { duration: 1.8 })
    .call(() => check.classList.add('is-off'))
    .to(cube, { x: 110, duration: 0.5, ease: 'power2.in' })
  return {
    tl,
    rest: () => {
      gsap.set(cube, { x: 0 })
      check.classList.remove('is-off')
    },
  }
}

function loopPlay(el: Element) {
  const cursor = el.querySelector<SVGPathElement>('.s2-cursor')!
  const trail = el.querySelector<SVGPathElement>('.s2-trail')!
  const ripples = Array.from(el.querySelectorAll<SVGCircleElement>('.s2-ripple'))
  const keyW = el.querySelector<HTMLElement>('.s2-key-w')!
  const keySpace = el.querySelector<HTMLElement>('.s2-key-space')!
  const marks = Array.from(el.querySelectorAll<SVGElement>('.s2-mark'))
  const head = el.querySelector<SVGLineElement>('.s2-head')!
  const T = S2_POLY.total
  const st = { t: 1 }
  const apply = () => {
    const L = st.t * T
    const p = pointAt(S2_POLY, L)
    cursor.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(1.5)`)
    trail.style.strokeDashoffset = String(T - L)
    let seg = 1
    while (seg < S2_POLY.cum.length - 1 && S2_POLY.cum[seg] < L) seg++
    keyW.classList.toggle('is-on', Math.abs(S2_PATH[seg].x - S2_PATH[seg - 1].x) < 0.5 && st.t < 1)
    const hx = 20 + st.t * 420
    head.setAttribute('x1', hx.toFixed(1))
    head.setAttribute('x2', hx.toFixed(1))
    marks.forEach((m) => m.classList.toggle('is-past', Number(m.dataset.x) <= hx))
  }
  const D = 4.4
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.9, paused: true })
  tl.fromTo(st, { t: 0 }, { t: 1, duration: D, ease: 'none', onUpdate: apply }, 0)
  S2_CLICKS.forEach((i, k) => {
    const at = (S2_POLY.cum[i] / T) * D
    tl.fromTo(
      ripples[k],
      { scale: 0.3, opacity: 1, transformOrigin: '50% 50%' },
      { scale: 1.9, opacity: 0, duration: 0.6, ease: 'power2.out', immediateRender: false },
      at,
    )
    tl.call(() => keySpace.classList.add('is-on'), undefined, at)
    tl.call(() => keySpace.classList.remove('is-on'), undefined, at + 0.25)
  })
  return {
    tl,
    rest: () => {
      st.t = 1
      apply()
    },
  }
}

function loopRecord(el: Element) {
  const head = el.querySelector<SVGLineElement>('.s3-head')!
  const bbox = el.querySelector<HTMLElement>('.s3-bbox')!
  const issue = el.querySelector<HTMLElement>('.s3-issue')!
  const exp = el.querySelector<SVGPathElement>('.s3-export')!
  const tl = gsap.timeline({ repeat: -1, paused: true })
  tl.call(() => issue.classList.remove('is-up'), undefined, 0.01)
    .set(exp, { strokeDashoffset: 1 }, 0.01)
    .fromTo(head, { attr: { x1: 0, x2: 0 } }, { attr: { x1: 268, x2: 268 }, duration: 2.2, ease: 'none', immediateRender: false }, 0.02)
    .fromTo(bbox, { opacity: 0.3 }, { opacity: 1, duration: 0.18, repeat: 3, yoyo: true, immediateRender: false }, 2.22)
    .call(() => issue.classList.add('is-up'), undefined, 2.5)
    .to(exp, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }, 2.9)
    .to({}, { duration: 1.8 })
  return {
    tl,
    rest: () => {
      issue.classList.add('is-up')
      gsap.set(exp, { strokeDashoffset: 0 })
      gsap.set(bbox, { opacity: 1 })
      gsap.set(head, { attr: { x1: 268, x2: 268 } })
    },
  }
}

const LOOPS: [string, (el: Element) => Omit<SceneLoop, 'el'>][] = [
  ['.p1', loopRegression],
  ['.p2', loopRepro],
  ['.p3', loopCases],
  ['.s1-cube', loopConnect],
  ['.s2-game', loopPlay],
  ['.s3-frozen', loopRecord],
]

/** 영역마다 장면 반복 timeline을 만든다. 만든 쪽에서 재생과 정지를 맡는다. */
export function sceneLoops(scope: Element): SceneLoop[] {
  return LOOPS.flatMap(([sel, make]) => {
    const target = scope.querySelector(sel)
    if (!target) return []
    // § 02 장면은 여러 형제 요소로 이루어져 있어 영역 판 전체를 넘긴다.
    const el = sel.startsWith('.p') ? target : (target.closest('.smc-tile') as Element)
    return [{ ...make(el), el }]
  })
}
