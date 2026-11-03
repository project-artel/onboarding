// 스크롤 스냅. 휠 한 번, 키 한 번에 다음 지정 위치까지 이동한다.
// 데스크톱 정밀 포인터에서만 켠다. 터치와 reduced motion은 기본 스크롤을 둔다.
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

export const snapMedia = '(min-width: 721px) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

const headerOffset = () => (window.matchMedia('(min-width: 721px)').matches ? 64 : 0)

/** `[data-snap]` 요소의 위쪽 끝을 헤더 아래에 맞춘 스크롤 위치. */
export function elementStops(root: ParentNode = document): number[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[data-snap]')).map(
    (el) => el.getBoundingClientRect().top + window.scrollY - headerOffset(),
  )
}

/** 고정(pin)·scrub 구간 안의 정지점. `count`개 단계를 시작부터 끝까지 고르게 나눈다. */
export function triggerStops(st: ScrollTrigger | undefined, count: number): number[] {
  if (!st || count < 1) return []
  if (count === 1) return [st.start]
  return Array.from({ length: count }, (_, i) => st.start + ((st.end - st.start) * i) / (count - 1))
}

type SnapOptions = {
  /** 정지점 목록. 매 입력마다 다시 계산하므로 레이아웃이 바뀌어도 맞는다. 기본은 `elementStops()`. */
  stops?: () => number[]
  duration?: number
  ease?: string
  /** 정지점이 바뀔 때 알림. 진행 표시가 현재 위치를 그리는 데 쓴다. */
  onChange?: (index: number, stops: number[]) => void
}

export type SnapController = {
  destroy: () => void
  /** 정지점 `index`로 이동한다. 진행 표시의 클릭에 쓴다. */
  goTo: (index: number) => void
  stops: () => number[]
}

const interactive = 'input, textarea, select, button, summary, a, [contenteditable], [role="button"]'

export function enableSnap(options: SnapOptions = {}): SnapController {
  const { duration = 0.95, ease = 'power3.inOut', onChange } = options
  const media = window.matchMedia(snapMedia)

  const stops = () => {
    const max = ScrollTrigger.maxScroll(window)
    const raw = [0, ...(options.stops ? options.stops() : elementStops()), max]
    const clamped = raw.map((y) => Math.round(Math.min(Math.max(y, 0), max))).sort((a, b) => a - b)
    return clamped.filter((y, i) => i === 0 || y - clamped[i - 1] > 8)
  }

  let tween: gsap.core.Tween | null = null
  let waitForQuiet = false
  let lastWheel = 0
  let lastIndex = -1

  const indexAt = (y: number, list: number[]) => {
    let best = 0
    list.forEach((stop, i) => {
      if (Math.abs(stop - y) < Math.abs(list[best] - y)) best = i
    })
    return best
  }

  const report = () => {
    const list = stops()
    const index = indexAt(window.scrollY, list)
    if (index !== lastIndex) {
      lastIndex = index
      onChange?.(index, list)
    }
  }

  const scrollTo = (y: number) => {
    tween?.kill()
    tween = gsap.to(window, {
      scrollTo: { y, autoKill: false },
      duration,
      ease,
      onComplete: () => {
        tween = null
        waitForQuiet = true
        report()
      },
    })
  }

  // 정지점 사이가 한 화면보다 훨씬 길면 (긴 FAQ 등) 한 화면씩 읽게 나눠서 이동한다.
  const step = (dir: 1 | -1) => {
    const list = stops()
    const y = window.scrollY
    const page = window.innerHeight - headerOffset()
    const next = dir > 0 ? list.find((s) => s > y + 4) : [...list].reverse().find((s) => s < y - 4)
    if (next === undefined) return
    const gap = Math.abs(next - y)
    scrollTo(gap > page * 1.25 ? y + dir * page * 0.85 : next)
  }

  const onWheel = (event: WheelEvent) => {
    if (!media.matches || event.ctrlKey) return
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return
    const now = performance.now()
    const quietFor = now - lastWheel
    lastWheel = now
    event.preventDefault()
    if (tween) return
    // 트랙패드 관성 꼬리가 다음 이동을 연달아 일으키지 않도록 입력이 한 번 멈출 때까지 기다린다.
    if (waitForQuiet && quietFor < 180) return
    waitForQuiet = false
    if (Math.abs(event.deltaY) < 3) return
    step(event.deltaY > 0 ? 1 : -1)
  }

  const onKey = (event: KeyboardEvent) => {
    if (!media.matches || event.altKey || event.ctrlKey || event.metaKey) return
    const target = event.target as HTMLElement | null
    if (target?.closest('input, textarea, select, [contenteditable]')) return
    const space = event.key === ' '
    if (space && target?.closest(interactive)) return
    let dir: 1 | -1 | 0 = 0
    if (event.key === 'ArrowDown' || event.key === 'PageDown' || (space && !event.shiftKey)) dir = 1
    if (event.key === 'ArrowUp' || event.key === 'PageUp' || (space && event.shiftKey)) dir = -1
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      const list = stops()
      scrollTo(event.key === 'Home' ? 0 : list[list.length - 1])
      return
    }
    if (!dir) return
    event.preventDefault()
    if (!tween) step(dir)
  }

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', onKey)
  window.addEventListener('scroll', report, { passive: true })
  requestAnimationFrame(report)

  return {
    destroy: () => {
      tween?.kill()
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', report)
    },
    goTo: (index: number) => {
      const list = stops()
      const y = list[Math.min(Math.max(index, 0), list.length - 1)]
      if (media.matches) scrollTo(y)
      else window.scrollTo({ top: y })
    },
    stops,
  }
}
