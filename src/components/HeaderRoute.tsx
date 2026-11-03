// 상단바 아래쪽 가장자리를 경로로 쓰는 진행 표시.
// 섹션마다 작은 정거장 칸이 있고, 지난 칸은 코랄로 차고, 지금 칸은 코랄 테두리다.
// 에이전트 점은 스크롤을 따라 가장자리 위를 끊김 없이 움직인다.
// 랜딩에서는 칸을 누르면 그 섹션으로 가고, 설치 페이지에서는 읽기 진행만 보인다.
import { useEffect, useEffectEvent, useRef, useState } from 'react'

const PAD = 22

type Props = {
  /** 정거장마다의 스크롤 위치. 레이아웃이 바뀔 때마다 다시 부른다. */
  stops: () => number[]
  /** 있으면 칸이 버튼이 된다. 이름은 섹션 제목을 그대로 쓴다. */
  labels?: string[]
  onGo?: (index: number) => void
  /** even: 칸을 고르게 둔다. proportional: 문서 안 위치 비율대로 둔다. */
  spacing?: 'even' | 'proportional'
  /** 바뀌면 다시 잰다(경로 이동 등). */
  layoutKey?: string
}

export function HeaderRoute({ stops, labels, onGo, spacing = 'even', layoutKey }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const trailRef = useRef<SVGLineElement>(null)
  const dotRef = useRef<SVGGElement>(null)
  // 정지점은 레이아웃이 바뀔 때마다 그때의 DOM에서 다시 잰다. 부모가 렌더마다 새 함수를 넘겨도
  // 아래 effect를 다시 걸지 않는다.
  const readStops = useEffectEvent(() => stops())
  const [xs, setXs] = useState<number[]>([])
  const [width, setWidth] = useState(0)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const el = ref.current
    const bar = document.querySelector<HTMLElement>('.site-header__inner')
    if (!el || !bar) return
    let list: number[] = []
    let px: number[] = []
    let w = 0
    let cur = -1

    const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight)

    const update = () => {
      if (!w) return
      const y = window.scrollY
      const max = maxScroll()
      const knots = [{ y: 0, x: PAD }, ...list.map((s, i) => ({ y: s, x: px[i] })), { y: max, x: w - PAD }].sort((a, b) => a.y - b.y)
      let x = knots[knots.length - 1].x
      for (let i = 1; i < knots.length; i++) {
        if (y <= knots[i].y) {
          const a = knots[i - 1]
          const b = knots[i]
          const span = b.y - a.y
          x = span > 0 ? a.x + ((y - a.y) / span) * (b.x - a.x) : b.x
          break
        }
      }
      trailRef.current?.setAttribute('x2', x.toFixed(1))
      dotRef.current?.setAttribute('transform', `translate(${x.toFixed(1)} 8)`)
      let c = 0
      list.forEach((s, i) => {
        if (s <= y + window.innerHeight * 0.35) c = i
      })
      if (c !== cur) {
        cur = c
        setCurrent(c)
      }
    }

    const layout = () => {
      const r = bar.getBoundingClientRect()
      el.style.left = `${r.left}px`
      el.style.top = `${r.bottom - 0.75 - 8}px`
      el.style.width = `${r.width}px`
      w = r.width
      list = readStops()
      const max = maxScroll()
      px =
        spacing === 'even'
          ? list.map((_, i) => PAD + (i * (w - 2 * PAD)) / Math.max(1, list.length - 1))
          : list.map((s) => PAD + Math.min(1, Math.max(0, s / max)) * (w - 2 * PAD))
      setXs(px)
      setWidth(w)
      update()
    }

    let frame = 0
    const queue = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }
    let layoutFrame = 0
    const queueLayout = () => {
      window.cancelAnimationFrame(layoutFrame)
      layoutFrame = window.requestAnimationFrame(layout)
    }

    layout()
    const ro = new ResizeObserver(queueLayout)
    ro.observe(bar)
    const main = document.querySelector('main')
    if (main) ro.observe(main)
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queueLayout)
    return () => {
      ro.disconnect()
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(layoutFrame)
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queueLayout)
    }
  }, [spacing, layoutKey])

  const interactive = Boolean(onGo && labels)

  return (
    <div ref={ref} className="header-route" aria-hidden={interactive ? undefined : true}>
      {width > 0 && (
        <svg width={width} height={16} viewBox={`0 0 ${width} 16`} aria-hidden="true">
          <line ref={trailRef} className="header-route__trail" x1={0} y1={8} x2={PAD} y2={8} />
          {xs.map((x, i) => (
            <rect
              key={i}
              className={i < current ? 'header-route__stop is-done' : i === current ? 'header-route__stop is-current' : 'header-route__stop'}
              x={x - 4}
              y={4}
              width={8}
              height={8}
            />
          ))}
          <g ref={dotRef} className="header-route__agent" transform={`translate(${PAD} 8)`}>
            <circle className="header-route__ring" r={6.5} />
            <circle className="header-route__dot" r={3} />
          </g>
        </svg>
      )}
      {interactive &&
        xs.map((x, i) => (
          <button
            key={i}
            type="button"
            className="header-route__hit"
            style={{ left: x - 11 }}
            aria-label={labels![i]}
            aria-current={i === current ? 'step' : undefined}
            onClick={() => onGo!(i)}
          />
        ))}
    </div>
  )
}
