// 랜딩. 페이지 전체가 한 장의 화면 지도 위에서 일어난다. 히어로 지도가 무대가 되고, 섹션마다
// 카메라가 같은 판의 다른 영역으로 날아간다. 섹션마다 정지점 하나, 섹션 안의 내용은 한 번에 함께
// 나타난다.
import { Fragment, useEffect, useLayoutEffect, useRef, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { HeaderRoute } from '../../components/HeaderRoute'
import { useCopy } from '../../i18n/useCopy'
import { enableSnap, type SnapController } from '../../lib/snap'
import { FeatureBlock } from './features'
import { elbow, fmt, pointAt, poly, toD, type Pt } from './geom'
import { TILE_Y, type RegionName } from './sceneGeometry'
import { sceneLoops } from './sceneLoops'
import { FlowScenes, ProblemScenes, Region } from './scenes'
import './landing.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

/* ── 지도 데이터 ───────────────────────────────────────── */

type Kind = 'title' | 'list' | 'grid' | 'dialog' | 'hud' | 'form'
type Screen = { x: number; y: number; w: number; h: number; kind: Kind }

const PLANE = { w: 2600, h: 1900 }

const SCREENS: Screen[] = [
  { x: 300, y: 260, w: 240, h: 150, kind: 'title' },
  { x: 760, y: 200, w: 220, h: 138, kind: 'list' },
  { x: 1180, y: 300, w: 260, h: 162, kind: 'grid' },
  { x: 1620, y: 220, w: 220, h: 138, kind: 'dialog' },
  { x: 2060, y: 320, w: 240, h: 150, kind: 'hud' },
  { x: 460, y: 700, w: 220, h: 138, kind: 'form' },
  { x: 900, y: 640, w: 150, h: 230, kind: 'list' },
  { x: 1300, y: 760, w: 280, h: 175, kind: 'hud' },
  { x: 1760, y: 660, w: 220, h: 138, kind: 'grid' },
  { x: 2200, y: 780, w: 220, h: 138, kind: 'title' },
  { x: 620, y: 1120, w: 240, h: 150, kind: 'dialog' },
  { x: 1080, y: 1160, w: 220, h: 138, kind: 'grid' },
  { x: 1560, y: 1180, w: 220, h: 138, kind: 'form' },
  { x: 2000, y: 1140, w: 260, h: 162, kind: 'list' },
  { x: 380, y: 1500, w: 220, h: 138, kind: 'hud' },
  { x: 1300, y: 1560, w: 240, h: 150, kind: 'title' },
]

// 화면 안의 추상 UI 블록. [x, y, w, h] 퍼센트와 톤.
type Block = [number, number, number, number, 1 | 2 | 3]
const UI: Record<Kind, Block[]> = {
  title: [[24, 14, 52, 28, 2], [36, 52, 28, 9, 1], [36, 65, 28, 9, 1], [36, 78, 28, 9, 1]],
  list: [[6, 8, 22, 84, 1], [34, 10, 60, 11, 2], [34, 27, 60, 11, 1], [34, 44, 60, 11, 1], [34, 61, 60, 11, 1], [34, 78, 42, 11, 1]],
  grid: [[6, 10, 26, 36, 1], [37, 10, 26, 36, 2], [68, 10, 26, 36, 1], [6, 54, 26, 36, 1], [37, 54, 26, 36, 1], [68, 54, 26, 36, 1]],
  dialog: [[6, 8, 88, 12, 1], [6, 28, 40, 62, 1], [52, 28, 42, 62, 1], [22, 22, 56, 58, 3], [30, 60, 18, 11, 2], [52, 60, 18, 11, 1]],
  hud: [[5, 8, 30, 8, 2], [78, 8, 8, 12, 1], [88, 8, 8, 12, 1], [44, 38, 12, 22, 1], [22, 78, 12, 13, 1], [36, 78, 12, 13, 1], [50, 78, 12, 13, 1], [64, 78, 12, 13, 1]],
  form: [[22, 10, 56, 10, 2], [22, 28, 56, 12, 1], [22, 46, 56, 12, 1], [22, 64, 56, 12, 1], [52, 82, 26, 10, 2]],
}

const ROUTE = [0, 1, 2, 3, 4, 9, 8, 7, 6, 5, 10, 11, 12, 13, 15]
const LINKS: [number, number][] = [[0, 5], [1, 6], [2, 7], [3, 8], [10, 14], [14, 15], [11, 15], [12, 8], [9, 13]]

const CENTERS = SCREENS.map((s) => ({ x: s.x + s.w / 2, y: s.y + s.h / 2 }))
const ROUTE_PTS: Pt[] = [CENTERS[ROUTE[0]]]
const ROUTE_STOP_IDX = [0]
for (let i = 1; i < ROUTE.length; i++) {
  ROUTE_PTS.push(...elbow(CENTERS[ROUTE[i - 1]], CENTERS[ROUTE[i]]))
  ROUTE_STOP_IDX.push(ROUTE_PTS.length - 1)
}
const ROUTE_POLY = poly(ROUTE_PTS)
const ROUTE_STOPS = ROUTE_STOP_IDX.map((i) => ROUTE_POLY.cum[i])
const ROUTE_D = toD(ROUTE_PTS)
const LINK_DS = LINKS.map(([a, b]) => toD([CENTERS[a], ...elbow(CENTERS[a], CENTERS[b])]))

const SPEED = 520 // plane px / s
const DWELL = 0.5

/* ── 작은 컴포넌트 ─────────────────────────────────────── */

// 한글 덩어리는 Wanted Sans로 떨어지므로 굵기와 자간을 따로 맞춘다.
const HANGUL = /([ᄀ-ᇿ㄰-㆏가-힯]+)/
function Mixed({ text }: { text: string }) {
  return (
    <>
      {text.split(HANGUL).map((part, i) =>
        !part ? null : (
          <Fragment key={i}>{HANGUL.test(part) ? <span className="smc-ko">{part}</span> : part}</Fragment>
        ),
      )}
    </>
  )
}

function ScreenMap() {
  return (
    <div className="smc-map" aria-hidden="true">
      <div className="smc-camera">
        <div className="smc-rig">
          <div className="smc-plane" style={{ width: PLANE.w, height: PLANE.h }}>
            <svg className="smc-plane__svg" width={PLANE.w} height={PLANE.h} viewBox={`0 0 ${PLANE.w} ${PLANE.h}`}>
              <g className="smc-dims">
                <path d="M1180 266V280M1440 266V280M1180 273H1440" />
                <text x="1310" y="258">1920</text>
                <path d="M1146 300H1160M1146 462H1160M1153 300V462" />
                <text x="1132" y="381" transform="rotate(-90 1132 381)">1080</text>
                <path d="M1560 1146V1160M1780 1146V1160M1560 1153H1780" />
                <text x="1670" y="1138">1280</text>
              </g>
              {LINK_DS.map((d, i) => (
                <path key={i} className="smc-link" d={d} />
              ))}
              <path className="smc-route" d={ROUTE_D} />
              <path className="smc-trail" d={ROUTE_D} style={{ strokeDasharray: ROUTE_POLY.total }} />
            </svg>
            {SCREENS.map((s, i) => (
              <div key={i} className="smc-screen" style={{ left: s.x, top: s.y, width: s.w, height: s.h }}>
                <span className="smc-screen__base" />
                <div className="smc-screen__face">
                  {UI[s.kind].map(([x, y, w, h, tone], k) => (
                    <i
                      key={k}
                      className={`smc-ui smc-ui--${tone}`}
                      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
                    />
                  ))}
                  <span className="smc-screen__pin" />
                </div>
                <svg className="smc-screen__flag" viewBox="0 0 20 18">
                  <path d="M10 1 19 17H1Z" />
                </svg>
                <span className="smc-screen__ripple" />
                <span className="smc-screen__tc" />
              </div>
            ))}
            <div className="smc-agent">
              <span className="smc-agent__ring" />
              <span className="smc-agent__core" />
              <span className="smc-agent__stem" />
            </div>
          </div>
        </div>
      </div>
      <span className="smc-crop smc-crop--tl" />
      <span className="smc-crop smc-crop--tr" />
      <span className="smc-crop smc-crop--bl" />
      <span className="smc-crop smc-crop--br" />
    </div>
  )
}

// 질문 하나가 작은 지도 위의 화면 하나다. 열면 화면이 펼쳐지고 떠오른다.
function FaqItem({ q, a, shifted }: { q: string; a: string; shifted: boolean }) {
  const ref = useRef<HTMLDetailsElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const body = bodyRef.current
    return () => {
      if (body) gsap.killTweensOf(body)
    }
  }, [])

  const onClick = (e: MouseEvent<HTMLElement>) => {
    const d = ref.current
    const b = bodyRef.current
    if (!d || !b || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    e.preventDefault()
    gsap.killTweensOf(b)
    const closing = d.dataset.state === 'closing'
    if (d.open && !closing) {
      d.dataset.state = 'closing'
      gsap.to(b, {
        height: 0,
        opacity: 0,
        duration: 0.36,
        ease: 'power2.inOut',
        onComplete: () => {
          d.open = false
          delete d.dataset.state
          gsap.set(b, { clearProps: 'height,opacity' })
        },
      })
    } else {
      const from = closing ? b.offsetHeight : 0
      delete d.dataset.state
      d.open = true
      gsap.fromTo(
        b,
        { height: from, opacity: closing ? Number(getComputedStyle(b).opacity) : 0 },
        {
          height: b.scrollHeight,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          onComplete: () => {
            gsap.set(b, { clearProps: 'height,opacity' })
          },
        },
      )
    }
  }

  return (
    <div className={`smc-qa-slot${shifted ? ' smc-qa-slot--shift' : ''}`}>
      <span className="smc-qa-slot__node" aria-hidden="true" />
      <details ref={ref} className="smc-qa">
        <summary onClick={onClick}>
          <span className="smc-qa__mark" aria-hidden="true" />
          <span className="smc-qa__q">{q}</span>
          <span className="smc-qa__icon" aria-hidden="true" />
        </summary>
        <div ref={bodyRef} className="smc-qa__body">
          <p>{a}</p>
        </div>
      </details>
    </div>
  )
}

/* ── 카메라 ───────────────────────────────────────────── */

// f는 화면 폭에 맞춘 배율을 얼마나 따를지다. 영역은 세 장면이 한 화면에 들어오도록 따른다.
type Cam = { x: number; y: number; ox: number; oy: number; tilt: number; rz: number; s: number; f: number }
const CAM: Record<'hero' | 'mobile' | RegionName, Cam> = {
  hero: { x: 1320, y: 880, ox: 14, oy: 0, tilt: 56, rz: -16, s: 1, f: 0 },
  mobile: { x: 1340, y: 900, ox: 0, oy: -12, tilt: 58, rz: -18, s: 0.62, f: 0 },
  problem: { x: 1300, y: TILE_Y.problem + 850, ox: 0, oy: 5, tilt: 47, rz: 0, s: 0.68, f: 1 },
  flow: { x: 1300, y: TILE_Y.flow + 830, ox: 0, oy: 5, tilt: 46, rz: 0, s: 0.64, f: 1 },
  features: { x: 1300, y: TILE_Y.features + 850, ox: 0, oy: 4, tilt: 44, rz: 0, s: 0.64, f: 1 },
}
const REGIONS: RegionName[] = ['problem', 'flow', 'features']

function camTransform(c: Cam, w: number, h: number, extra = { dx: 0, dy: 0, dt: 0, dr: 0, ds: 0, px: 0, py: 0 }) {
  const fit = 1 + (Math.min(1.2, Math.max(0.55, w / 1440)) - 1) * c.f
  const s = (c.s + extra.ds) * fit
  const tx = (c.ox * w) / 100 + extra.px
  const ty = (c.oy * h) / 100 + extra.py
  return `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) rotateX(${(c.tilt + extra.dt).toFixed(2)}deg) rotateZ(${(c.rz + extra.dr).toFixed(2)}deg) scale(${s.toFixed(3)}) translate3d(${(-(c.x + extra.dx)).toFixed(1)}px, ${(-(c.y + extra.dy)).toFixed(1)}px, 0)`
}

/* ── 정지점 ───────────────────────────────────────────── */

const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY

// 히어로와 네 섹션의 맨 위. 데스크톱에서는 상단바가 섹션 위 여백에 뜬다.
function landingStops(root: HTMLElement | null): number[] {
  if (!root) return []
  return [0, ...Array.from(root.querySelectorAll('[data-station]')).map((el) => Math.round(docTop(el)))]
}

/* ── 모션 ─────────────────────────────────────────────── */

function setupMotion(root: HTMLElement, snapRef: { current: SnapController | null }) {
  const one = <T extends Element = HTMLElement>(sel: string) => root.querySelector(sel) as T
  const all = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll(sel)) as T[]

  const header = document.querySelector<HTMLElement>('.site-header')
  const journey = one('.smc-journey')
  const hero = one('.smc-hero')
  const mapEl = one('.smc-map')
  const camera = one('.smc-camera')
  const stageRig = one('.smc-map .smc-rig')
  const agent = one('.smc-map .smc-agent')
  const trail = one<SVGPathElement>('.smc-trail')
  const screens = all('.smc-screen')
  const tcs = all('.smc-screen__tc')
  const ripples = all('.smc-screen__ripple')
  const title = one('.smc-title')
  const actions = all('.smc-hero__actions > *')
  const sections = REGIONS.map((name) => {
    const el = one(`[data-region="${name}"]`)
    const region = el.querySelector<HTMLElement>('.smc-region')!
    const rig = region.querySelector<HTMLElement>('.smc-rig')!
    const signs = Array.from(el.querySelectorAll<HTMLElement>('[data-sign]')).map((sign) => ({
      sign,
      anchor: region.querySelector<HTMLElement>(`[data-anchor="${sign.dataset.sign}"]`),
    }))
    return { name, el, region, rig, signs, near: false }
  })
  const flowAgent = one('.flow-agent')

  const cam: Cam = { ...CAM.hero }
  const intro = { tilt: 0, s: 0, o: 1 }
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 }
  const route = { L: 0 }
  const live = { active: true, drift: false, shared: false }
  let vw = window.innerWidth
  let vh = window.innerHeight
  let routeTl: gsap.core.Timeline | null = null

  /* 상단바는 지도 위에 뜬다. 높이를 재서 히어로와 섹션 위 여백에 쓴다. */
  const syncHeader = () => root.style.setProperty('--header-h', `${header?.offsetHeight ?? 64}px`)
  syncHeader()

  /* 히어로 지도 */
  const visit = (i: number, time: number, ripple = true) => {
    const n = ROUTE[i]
    screens[n].classList.add('is-visited')
    tcs[n].textContent = fmt(time)
    if (ripple) gsap.fromTo(ripples[n], { scale: 0.3, opacity: 0.9 }, { scale: 2.6, opacity: 0, duration: 1, ease: 'power2.out' })
  }
  const clearVisits = () => screens.forEach((s) => s.classList.remove('is-visited'))

  // 표지판과 섹션 제목은 판 위 기준점의 화면 좌표를 따라 선다. 판의 기울기를 받지 않아 늘 똑바로
  // 읽히고, 처음부터 그 자리에 있던 것처럼 카메라와 함께 움직인다. 기준점이 화면 밖이거나 위쪽
  // 안개(지도 마스크) 속이거나 카메라 뒤면 감춘다.
  const placeSigns = () => {
    sections.forEach((s) => {
      if (!s.near) return
      const r = s.el.getBoundingClientRect()
      s.signs.forEach(({ sign, anchor }) => {
        if (!anchor) return
        const a = anchor.getBoundingClientRect()
        const inside =
          Number.isFinite(a.top) && a.top > vh * 0.16 && a.top < vh + 40 && a.left > -120 && a.left < vw + 120
        sign.style.visibility = inside ? '' : 'hidden'
        if (inside) sign.style.transform = `translate3d(${(a.left - r.left).toFixed(1)}px, ${(a.top - r.top).toFixed(1)}px, 0)`
      })
    })
  }

  const render = (time: number) => {
    ptr.x += (ptr.tx - ptr.x) * 0.05
    ptr.y += (ptr.ty - ptr.y) * 0.05
    const k = live.drift ? 1 : 0
    const extra = {
      dx: Math.sin(time * 0.13) * 30 * k,
      dy: Math.cos(time * 0.09) * 22 * k,
      dt: intro.tilt - ptr.y * 3,
      dr: Math.sin(time * 0.07) * 1.1 * k + ptr.x * 2.4,
      ds: intro.s,
      px: ptr.x * 18,
      py: ptr.y * 12,
    }
    const t = camTransform(cam, vw, vh, extra)
    stageRig.style.transform = t
    if (live.shared) sections.forEach((s) => s.near && (s.rig.style.transform = t))
    camera.style.opacity = String(intro.o)
    const p = pointAt(ROUTE_POLY, route.L)
    agent.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 26px)`
    trail.style.strokeDashoffset = String(ROUTE_POLY.total - route.L)
    if (live.shared) placeSigns()
  }
  const tick = (time: number) => {
    if (live.active) render(time)
  }
  gsap.ticker.add(tick)

  // 무대가 화면 밖이면 ticker와 경로 timeline을 멈춘다.
  const setActive = (on: boolean) => {
    live.active = on
    if (!routeTl) return
    if (on) routeTl.resume()
    else routeTl.pause()
  }

  /* 좁은 화면과 움직임 줄이기: 영역마다 섹션 안의 정적인 지도 띠로 자른다. */
  const frameRegions = () => {
    sections.forEach((s) => {
      const w = s.region.clientWidth
      const h = s.region.clientHeight
      if (!w || !h) return
      // 띠 하나에 영역의 장면이 다 들어오도록 폭에 맞춘다.
      const c = CAM[s.name]
      s.rig.style.transform = camTransform({ ...c, s: Math.min(1.1, w / 2200), f: 0, oy: 6, tilt: c.tilt + 4 }, w, h)
    })
  }

  const onResize = () => {
    vw = window.innerWidth
    vh = window.innerHeight
    if (!live.shared) frameRegions()
  }
  window.addEventListener('resize', onResize)

  const ro = new ResizeObserver(() => syncHeader())
  if (header) ro.observe(header)

  const mm = gsap.matchMedia(root)
  mm.add(
    {
      desktop: '(min-width: 721px) and (prefers-reduced-motion: no-preference)',
      mobile: '(max-width: 720px) and (prefers-reduced-motion: no-preference)',
      reduce: '(prefers-reduced-motion: reduce)',
    },
    (ctx) => {
      const { desktop, mobile, reduce } = ctx.conditions as Record<string, boolean>
      const narrow = window.matchMedia('(max-width: 720px)').matches
      Object.assign(cam, mobile || (reduce && narrow) ? CAM.mobile : CAM.hero)
      live.shared = Boolean(desktop)
      if (desktop) {
        root.classList.add('is-staged')
        // 처음 기준점에 놓이기 전까지 표지판을 섹션 모서리에 그리지 않는다.
        sections.forEach((s) => s.signs.forEach(({ sign }) => (sign.style.visibility = 'hidden')))
      }

      ScrollTrigger.create({
        trigger: desktop ? journey : hero,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (st) => setActive(st.isActive),
        onRefresh: (st) => setActive(st.isActive),
      })

      const loops = sceneLoops(root)
      const loopsOf = (el: Element) => loops.filter((l) => el.contains(l.el)).map((l) => l.tl)

      if (!desktop) {
        sections.forEach((s) => s.signs.forEach(({ sign }) => (sign.style.transform = '')))
        frameRegions()
      }

      if (reduce) {
        // 움직임 없이 최종 상태. 지도는 경로 절반까지, 장면은 뜻이 다 드러난 상태로 멈춘다.
        const upto = 7
        for (let i = 0; i <= upto; i++) visit(i, ROUTE_STOPS[i] / SPEED + i * DWELL, false)
        route.L = ROUTE_STOPS[upto]
        loops.forEach((l) => l.rest())
        render(0)
        return () => {
          clearVisits()
          route.L = 0
        }
      }

      live.drift = true

      /* 히어로: 지도가 내려앉고, 제목 띠가 지도 위를 가로지른 뒤 글자가 올라온다. */
      gsap.fromTo(intro, { tilt: 20, s: -0.16, o: 0 }, { tilt: 0, s: 0, o: 1, duration: 2.4, ease: 'power3.out' })
      SplitText.create(title, {
        type: 'lines,words,chars',
        linesClass: 'smc-tl',
        wordsClass: 'smc-tw',
        charsClass: 'smc-tch',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap
            .timeline({ delay: 0.2 })
            .fromTo(
              self.masks,
              { clipPath: 'inset(0% 100% 0% 0%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power3.inOut', stagger: 0.14 },
            )
            .from(self.chars, { yPercent: 120, duration: 0.9, ease: 'power4.out', stagger: 0.024 }, 0.35),
      })
      gsap.from(actions, { y: 26, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.09, delay: 1.05 })

      /* 에이전트 경로. 화면마다 잠시 머물며 읽고, 끝나면 지도를 비우고 다시 돈다. */
      const tl = gsap.timeline({ repeat: -1, delay: 1.1 })
      tl.fromTo([trail, agent], { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0)
      tl.call(() => visit(0, tl.time()), undefined, 0.05)
      tl.to({}, { duration: DWELL }, 0.05)
      for (let i = 1; i < ROUTE.length; i++) {
        tl.to(route, { L: ROUTE_STOPS[i], duration: (ROUTE_STOPS[i] - ROUTE_STOPS[i - 1]) / SPEED, ease: 'power1.inOut' })
        tl.call(() => visit(i, tl.time()))
        tl.to({}, { duration: DWELL })
      }
      tl.to([trail, agent], { opacity: 0, duration: 0.8 }, '+=1.4')
      tl.call(clearVisits)
      tl.set(route, { L: 0 })
      routeTl = tl
      if (!live.active) tl.pause()

      /* § 02 경로 위의 에이전트 점 */
      const flowDot = gsap.fromTo(
        flowAgent,
        { x: 140, y: 1010, z: 20 },
        { x: 2460, duration: 9, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true },
      )

      /* 영역마다: 카메라가 반쯤 다가왔을 때부터 그리고, 반복을 돌리고, 표지판을 세운다.
         영역 사이는 멀어서 이 경계에서는 영역이 아직 화면 밖이다. 나타나는 순간이 보이지 않는다. */
      sections.forEach((s) => {
        const anims = [...loopsOf(s.region), ...(s.name === 'flow' ? [flowDot] : [])]
        ScrollTrigger.create({
          trigger: s.el,
          start: 'top 55%',
          end: 'bottom 45%',
          onToggle: (st) => {
            s.near = st.isActive
            s.el.classList.toggle('is-near', st.isActive)
            anims.forEach((a) => (st.isActive ? a.play() : a.pause()))
            if (!st.isActive) s.signs.forEach(({ sign }) => (sign.style.visibility = 'hidden'))
          },
        })
      })

      const cleanups: (() => void)[] = [
        () => {
          live.drift = false
          live.shared = false
          routeTl = null
          route.L = 0
          clearVisits()
          sections.forEach((s) => {
            s.near = false
            s.el.classList.remove('is-near')
            s.signs.forEach(({ sign }) => (sign.style.visibility = ''))
          })
        },
      ]

      if (desktop) {
        /* 카메라: 섹션 사이를 스크롤과 함께 날아가 각 정지점에 정확히 내려앉는다. */
        const order: Cam[] = [CAM.hero, CAM.problem, CAM.flow, CAM.features]
        sections.forEach((s, i) =>
          gsap.fromTo(cam, { ...order[i] }, {
            ...order[i + 1],
            // 카메라는 스크롤을 그대로 따른다. 정지점 이동의 감속(expo.out)이 곧 카메라의 감속이다.
            ease: 'none',
            immediateRender: i === 0,
            scrollTrigger: { trigger: s.el, start: 'top bottom', end: 'top top', scrub: true },
          }),
        )
        // 히어로 영역이 카메라 뒤로 지나가면 무대 지도 층을 감춘다.
        ScrollTrigger.create({
          trigger: hero,
          start: 'top bottom',
          end: 'bottom 45%',
          onToggle: (st) => mapEl.classList.toggle('is-far', !st.isActive),
        })

        const onMove = (e: PointerEvent) => {
          ptr.tx = (e.clientX / vw) * 2 - 1
          ptr.ty = (e.clientY / vh) * 2 - 1
        }
        window.addEventListener('pointermove', onMove, { passive: true })
        cleanups.push(() => {
          window.removeEventListener('pointermove', onMove)
          ptr.tx = ptr.ty = ptr.x = ptr.y = 0
          mapEl.classList.remove('is-far')
          root.classList.remove('is-staged')
          sections.forEach((s) => s.signs.forEach(({ sign }) => (sign.style.transform = '')))
        })
      }

      return () => cleanups.forEach((fn) => fn())
    },
  )

  /* 스냅. 섹션마다 정지점 하나. */
  // 빠르게 출발해 천천히 내려앉는다.
  const snap = enableSnap({ stops: () => landingStops(root), duration: 1.25, ease: 'expo.out' })
  snapRef.current = snap

  return () => {
    snap.destroy()
    snapRef.current = null
    mm.revert()
    gsap.ticker.remove(tick)
    window.removeEventListener('resize', onResize)
    ro.disconnect()
    gsap.killTweensOf(ripples)
    clearVisits()
    root.style.removeProperty('--header-h')
  }
}

/* ── 페이지 ───────────────────────────────────────────── */

export function Landing() {
  const { t, href, locale } = useCopy()
  const rootRef = useRef<HTMLDivElement>(null)
  const snapRef = useRef<SnapController | null>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    return setupMotion(root, snapRef)
  }, [])

  // 상단바 가장자리의 정거장 이름은 섹션 제목을 그대로 쓴다.
  const stationLabels = [t.hero.title, t.problem.title, t.steps.title, t.features.title, t.faq.title]
  const go = (i: number) => {
    const target = landingStops(rootRef.current)[i]
    if (target === undefined) return
    const snap = snapRef.current
    if (!snap) {
      window.scrollTo({ top: target })
      return
    }
    const list = snap.stops()
    let best = 0
    list.forEach((s, k) => {
      if (Math.abs(s - target) < Math.abs(list[best] - target)) best = k
    })
    snap.goTo(best)
  }

  return (
    <div ref={rootRef} className="smc">
      <HeaderRoute stops={() => landingStops(rootRef.current)} labels={stationLabels} onGo={go} />

      <div className="smc-journey">
        <ScreenMap />

        <section className="smc-hero">
          <div className="smc-hero__inner">
            <h1 className="smc-title">
              <span className="smc-title__brand">ARTEL</span>
              <br />
              {/* `QA Agent`가 두 줄로 갈리지 않게 붙여 둔다. */}
              <Mixed text={t.hero.title.replace(/QA (agent)/i, 'QA $1')} />
            </h1>
            <div className="smc-hero__actions">
              <Link className="smc-cta smc-cta--primary" to={href('/self-hosting/desktop-app')}>
                {t.hero.appCta}
              </Link>
              <Link className="smc-cta smc-cta--ghost" to={href('/sdk')}>
                {t.hero.sdkCta}
              </Link>
            </div>
          </div>
        </section>

        <section className="smc-sec smc-problem" data-station data-region="problem" aria-labelledby="smc-problem-title">
          <div className="smc-sec__head" data-sign="h">
            <p className="smc-num">§ 01</p>
            <h2 className="smc-h2" id="smc-problem-title">
              <span className="smc-strip">
                <Mixed text={t.problem.title} />
              </span>
            </h2>
          </div>
          <ul className="smc-signs smc-signs--problem">
            {t.problem.items.map((item, i) => (
              <li key={item} className="smc-sign smc-sign--problem" data-sign={`p${i}`}>
                <p className="smc-sign__text">
                  <svg className="smc-sign__mark" viewBox="0 0 20 18" aria-hidden="true">
                    <path d="M10 1 19 17H1Z" />
                  </svg>
                  <span className="smc-strip">{item}</span>
                </p>
              </li>
            ))}
          </ul>
          <Region name="problem">
            <ProblemScenes />
          </Region>
        </section>

        <section className="smc-sec smc-flow" data-station data-region="flow" aria-labelledby="smc-flow-title">
          <div className="smc-sec__head smc-sec__head--row" data-sign="h">
            <div>
              <p className="smc-num">§ 02</p>
              <h2 className="smc-h2" id="smc-flow-title">
                <span className="smc-strip">
                  <Mixed text={t.steps.title} />
                </span>
              </h2>
            </div>
            <Link className="smc-arch" to={href('/docs/architecture')}>
              {t.nav.how} →
            </Link>
          </div>
          <ol className="smc-signs smc-signs--flow">
            {t.steps.items.map((step, i) => (
              <li key={step.index} className="smc-sign smc-sign--step" data-sign={`s${i}`}>
                <div>
                  <span className="smc-sign__num">
                    <span className="smc-strip">{step.index}</span>
                  </span>
                  <h3 className="smc-sign__title">
                    <span className="smc-strip">{step.title}</span>
                  </h3>
                  <p className="smc-sign__body">
                    <span className="smc-strip">{step.body}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <Region name="flow">
            <FlowScenes />
          </Region>
        </section>

        <section className="smc-sec smc-features" data-station data-region="features" aria-labelledby="smc-features-title">
          <FeatureBlock
            features={t.features.items}
            locale={locale}
            heading={
              <div className="smc-sec__head" data-sign="h">
                <p className="smc-num">§ 03</p>
                <h2 className="smc-h2" id="smc-features-title">
                  <span className="smc-strip">
                    <Mixed text={t.features.title} />
                  </span>
                </h2>
              </div>
            }
          />
        </section>
      </div>

      <section className="smc-faq" data-station aria-labelledby="smc-faq-title">
        <div className="shell smc-faq__inner">
          <div className="smc-faq__head">
            <p className="smc-num">§ 04</p>
            <h2 className="smc-h2" id="smc-faq-title">
              <Mixed text={t.faq.title} />
            </h2>
          </div>
          <div className="smc-faq__map">
            {t.faq.items.map((item, i) => (
              <FaqItem key={item.q} q={item.q} a={item.a} shifted={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
