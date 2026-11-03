// 랜딩 § 03 기능. 지도 위 일곱 화면과 표지판, 그리고 기능 하나를 크게 보여 주는 상세 대화상자.
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { authCopy } from '../../auth/copy'
import { MARK_FRAME, MARK_SHARD } from '../../components/ArtelMark'
import type { Locale } from '../../i18n/locale'
import type { Feature, FeatureKey } from '../../i18n/messages'
import { elbow, toD, type Pt } from './geom'
import { TILE_H, TILE_W } from './sceneGeometry'
import { Region } from './scenes'

// GitHub mark. Octicons `mark-github` 16×16 경로(MIT).
const GITHUB_MARK =
  'M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z'

/* ── 기능 장면. 지도 화면 안과 대화상자 안에서 같이 쓴다. ──────────
   기본 모양이 마지막 상태이고, 살아 있을 때만 CSS 반복이 그 위에서 돈다. */

const CURSOR = 'M0 0V14L3.6 10.6 6.2 16.2 8.6 15.1 6 9.6H11Z'

function FeatureArt({ k }: { k: FeatureKey }) {
  return (
    <svg className={`fx fx--${k}`} viewBox="0 0 300 168" aria-hidden="true">
      {k === 'scenario' && (
        <>
          {/* 왼쪽은 챗봇 대화. 사용자가 말하면 챗봇이 답하며 케이스를 만들어 오른쪽 시나리오 줄에 끼운다. */}
          <rect className="fx-chat" x={12} y={16} width={104} height={136} />
          <rect className="fx-bubble fx-bubble--user" x={46} y={26} width={62} height={22} />
          <rect className="fx-bubble__line fx-bubble__line--user" x={54} y={32} width={42} height={4} />
          <rect className="fx-bubble__line fx-bubble__line--user" x={54} y={40} width={28} height={4} />
          <g transform="translate(17 56) scale(0.25)">
            <polygon className="fx-mark" points={MARK_FRAME} />
            <polygon className="fx-mark-shard" points={MARK_SHARD} />
          </g>
          <rect className="fx-bubble fx-bubble--ai" x={36} y={54} width={72} height={46} />
          {[52, 62, 72].map((cx, i) => (
            <circle key={cx} className="fx-typing fx-a fx-a--typing" cx={cx} cy={77} r={2.6} style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
          {[52, 44, 50, 30].map((w, i) => (
            <rect key={i} className="fx-bubble__line fx-a fx-a--say" x={44} y={62 + i * 9} width={w} height={4} style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
          <rect className="fx-input" x={20} y={128} width={88} height={14} />
          <rect className="fx-term__cursor fx-a fx-a--blink" x={26} y={131} width={2} height={8} />
          <path className="fx-route fx-route--solid" d="M108 77H124V112" />
          <path className="fx-chain fx-a fx-a--chain" d="M124 112H290" pathLength={1} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              className="fx-case fx-a fx-a--gen"
              x={132 + i * 32}
              y={101}
              width={22}
              height={22}
              style={{ '--dx': `${100 - (132 + i * 32)}px`, '--dy': '-35px', animationDelay: `${i * 0.14}s` } as CSSProperties}
            />
          ))}
          <rect className="fx-case fx-case--shared" x={196} y={42} width={22} height={22} />
          <path className="fx-route" d="M207 64V101" />
        </>
      )}
      {k === 'qa' && (
        <>
          <rect className="fx-ui" x="30" y="122" width="80" height="7" />
          <rect className="fx-ui" x="128" y="92" width="70" height="7" />
          <rect className="fx-ui" x="214" y="62" width="56" height="7" />
          <path className="fx-route" d="M40 116V86H150V56H250" />
          <path className="fx-trail fx-a fx-a--draw" d="M40 116V86H150V56H250" pathLength={1} />
          <path className="fx-cursor fx-cursor--agent fx-a fx-a--walk" d={CURSOR} transform="translate(250 56)" />
          <line className="fx-lane" x1="20" y1="150" x2="280" y2="150" />
          {[50, 120, 190, 250].map((x) => (
            <circle key={x} className="fx-obs" cx={x} cy="150" r="4.5" />
          ))}
          {[84, 154, 222].map((x) => (
            <rect key={x} className="fx-act" x={x - 1.5} y="142" width="3" height="16" />
          ))}
          <line className="fx-playhead fx-a fx-a--scan" x1="270" y1="138" x2="270" y2="162" />
        </>
      )}
      {k === 'cases' && (
        <>
          {Array.from({ length: 21 }, (_, i) => {
            const c = i % 7
            const r = Math.floor(i / 7)
            const done = [1, 4, 8, 9, 15, 19].includes(i)
            return <rect key={i} className={done ? 'fx-case is-done' : 'fx-case'} x={24 + c * 38} y={26 + r * 40} width={26} height={26} />
          })}
          <rect className="fx-pick fx-a fx-a--pick" x={24 + 2 * 38 - 4} y={26 + 40 - 4} width={34} height={34} />
        </>
      )}
      {k === 'macro' && (
        <>
          <path className="fx-route" d="M30 130V70H120V110H210V44H270" />
          <path className="fx-trail fx-a fx-a--draw" d="M30 130V70H120V110H210V44H270" pathLength={1} />
          {(
            [
              [30, 130],
              [30, 70],
              [120, 70],
              [120, 110],
              [210, 110],
              [210, 44],
            ] as const
          ).map(([x, y]) => (
            <rect key={`${x}-${y}`} className="fx-step" x={x - 4} y={y - 4} width="8" height="8" />
          ))}
          <g transform="translate(270 44)">
            <circle className="fx-glyph-bg" r="13" />
            <path className="fx-loop" d="M6.5 -3.3A7.2 7.2 0 1 0 7 3" />
            <path className="fx-loop__head" d="M3.2 -7 8.2 -2.8 2.8 -1Z" />
          </g>
        </>
      )}
      {k === 'mcp' && (
        <>
          {/* 왼쪽은 코딩 에이전트의 콘솔. 명령이 입력되면 Macro 블록이 경로를 따라 ARTEL로 등록된다. */}
          <rect className="fx-term" x={10} y={24} width={132} height={120} />
          <rect className="fx-term__bar" x={10} y={24} width={132} height={14} />
          {[20, 28, 36].map((cx) => (
            <circle key={cx} className="fx-term__dot" cx={cx} cy={31} r={2.2} />
          ))}
          {[52, 68, 84, 100].map((y, i) => (
            <g key={y}>
              <path className="fx-term__prompt" d={`M18 ${y - 4}l5 4-5 4`} />
              <rect className="fx-term__line fx-a fx-a--say" x={30} y={y - 2.5} width={[86, 58, 96, 44][i]} height={5} style={{ animationDelay: `${i * 0.18}s` }} />
            </g>
          ))}
          <path className="fx-term__prompt" d="M18 112l5 4-5 4" />
          <rect className="fx-term__cursor fx-a fx-a--blink" x={30} y={111} width={7} height={10} />
          <path className="fx-route fx-route--solid" d="M142 84H186V60H220" />
          <rect className="fx-block fx-a fx-a--send" x="220" y="52" width="16" height="16" />
          <g transform="translate(228 30) scale(0.95)">
            <polygon className="fx-mark" points={MARK_FRAME} />
            <polygon className="fx-mark-shard" points={MARK_SHARD} />
          </g>
        </>
      )}
      {k === 'perf' && (
        <>
          <line className="fx-lane" x1="22" y1="136" x2="282" y2="136" />
          <line className="fx-budget" x1="22" y1="86" x2="282" y2="86" />
          <polyline className="fx-line" points="22,112 52,108 82,114 112,106 142,110" />
          <polyline className="fx-spike" points="142,110 160,40 178,110" />
          <polyline className="fx-line" points="178,110 208,112 238,104 268,110 282,108" />
          <path className="fx-tri" d="M160 22 167 34H153Z" />
          <line className="fx-playhead fx-a fx-a--scan" x1="282" y1="28" x2="282" y2="144" />
        </>
      )}
      {k === 'github' && (
        <>
          <path className="fx-route fx-route--solid fx-a fx-a--draw" d="M70 104H170V54H250" pathLength={1} />
          <path className="fx-arrow" d="M242 46 252 54 242 62" />
          <rect className="fx-issue" x="26" y="82" width="44" height="44" />
          <path className="fx-tri" d="M48 92 57 108H39Z" />
          <rect className="fx-issue fx-issue--copy fx-a fx-a--ship" x="216" y="43" width="22" height="22" />
          {/* 내보내는 곳은 실제 GitHub mark(Octicons mark-github, MIT). */}
          <path className="fx-gh" transform="translate(260 36) scale(2.25)" d={GITHUB_MARK} />
        </>
      )}
    </svg>
  )
}

/* ── 지도 위 배치 ─────────────────────────────────────── */

// 위 줄: 케이스 라이브러리, 시나리오 생성, QA 실행, GitHub 이슈 연동. 아래 줄: MCP 지원, Macro, 성능.
const POS: Record<FeatureKey, Pt> = {
  cases: { x: 380, y: 640 },
  scenario: { x: 1000, y: 640 },
  qa: { x: 1620, y: 640 },
  github: { x: 2240, y: 640 },
  mcp: { x: 690, y: 1130 },
  macro: { x: 1310, y: 1130 },
  perf: { x: 1930, y: 1130 },
}
const EDGES: [FeatureKey, FeatureKey][] = [
  ['cases', 'scenario'],
  ['scenario', 'qa'],
  ['qa', 'github'],
  ['macro', 'qa'],
  ['mcp', 'macro'],
  ['qa', 'perf'],
]
const FS = { w: 300, h: 190 }

/* ── 상세 대화상자 ─────────────────────────────────────── */

type Open = { i: number; via: 'hover' | 'press'; origin: { x: number; y: number } }

function FeatureDialog({
  feature,
  open,
  closeLabel,
  onClose,
  onEnter,
  onLeave,
}: {
  feature: Feature
  open: Open
  closeLabel: string
  onClose: (restoreFocus: boolean) => void
  onEnter: () => void
  onLeave: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const press = open.via === 'press'

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sheet = window.matchMedia('(max-width: 720px)').matches
    const r = el.getBoundingClientRect()
    if (reduce) {
      const t = gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.15 })
      return () => {
        t.kill()
      }
    }
    const t = sheet
      ? gsap.fromTo(el, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, ease: 'power2.out' })
      : gsap.fromTo(
          el,
          { scale: 0.9, opacity: 0, transformOrigin: `${open.origin.x - r.left}px ${open.origin.y - r.top}px` },
          { scale: 1, opacity: 1, duration: 0.18, ease: 'power2.out' },
        )
    return () => {
      t.kill()
    }
  }, [open.i, open.origin.x, open.origin.y])

  useEffect(() => {
    if (press) closeRef.current?.focus()
  }, [press, open.i])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose(true)
      }
      // 키보드로 연 대화상자 안에서는 포커스가 밖으로 나가지 않는다. 움직일 곳은 닫기 버튼 하나다.
      if (e.key === 'Tab' && press && ref.current?.contains(document.activeElement)) {
        e.preventDefault()
        closeRef.current?.focus()
      }
    }
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose(false)
    }
    // 대화상자가 열려 있는 동안 스냅이 페이지를 옮기지 않게 한다. 스냅은 window의 버블 단계에서
    // 듣고 있으므로 캡처 단계에서 전파를 끊는다. 대화상자 안의 스크롤과 버튼의 Space는 그대로 둔다.
    const navKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '])
    const onNavKey = (e: KeyboardEvent) => {
      if (!navKeys.has(e.key)) return
      e.stopPropagation()
      const onButton = e.key === ' ' && (e.target as HTMLElement | null)?.closest('button')
      if (!onButton) e.preventDefault()
    }
    const onWheel = (e: WheelEvent) => {
      e.stopPropagation()
      if (!ref.current?.contains(e.target as Node)) e.preventDefault()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onNavKey, true)
    window.addEventListener('wheel', onWheel, { capture: true, passive: false })
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onNavKey, true)
      window.removeEventListener('wheel', onWheel, { capture: true })
    }
  }, [press, onClose])

  return (
    <>
      <div className="fx-backdrop" data-via={open.via} aria-hidden="true" />
      <div className="fx-layer" data-via={open.via}>
        <div
          ref={ref}
          className="fx-dialog"
          role="dialog"
          aria-modal={press ? true : undefined}
          aria-labelledby={titleId}
          onPointerEnter={onEnter}
          onPointerLeave={onLeave}
        >
          <span className="fx-crop fx-crop--tl" aria-hidden="true" />
          <span className="fx-crop fx-crop--tr" aria-hidden="true" />
          <span className="fx-crop fx-crop--bl" aria-hidden="true" />
          <span className="fx-crop fx-crop--br" aria-hidden="true" />
          <button ref={closeRef} type="button" className="fx-close" aria-label={closeLabel} onClick={() => onClose(true)} />
          <div className="fx-dialog__art fx-live">
            <FeatureArt k={feature.key} />
          </div>
          <div className="fx-dialog__copy">
            <h2 id={titleId} className="fx-dialog__title">
              <span className="smc-strip">{feature.title}</span>
            </h2>
            <p className="fx-dialog__body">{feature.body}</p>
            {feature.details.length > 0 && (
              <ul className="fx-dialog__list">
                {feature.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/* ── § 03 묶음: 지도 위 화면 + 표지판 + 대화상자 ─────────── */

export function FeatureBlock({ features, locale, heading }: { features: Feature[]; locale: Locale; heading: ReactNode }) {
  const [open, setOpenState] = useState<Open | null>(null)
  // 타이머와 포인터 처리기는 렌더 사이에 열린 상태를 바로 읽어야 해서 ref에도 둔다.
  const openRef = useRef<Open | null>(null)
  const triggers = useRef<(HTMLButtonElement | null)[]>([])
  const hoverTimer = useRef(0)
  const closeTimer = useRef(0)

  const setOpen = useCallback((next: Open | null) => {
    openRef.current = next
    setOpenState(next)
  }, [])
  const centerOf = (el: Element | null) => {
    const r = el?.getBoundingClientRect()
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  }
  const openAt = (i: number, via: Open['via'], el: Element | null) => {
    window.clearTimeout(hoverTimer.current)
    window.clearTimeout(closeTimer.current)
    setOpen({ i, via, origin: centerOf(el) })
  }
  // 대화상자의 effect가 이 함수에 의존하므로 렌더마다 바뀌지 않게 둔다.
  const close = useCallback(
    (restoreFocus: boolean) => {
      const cur = openRef.current
      window.clearTimeout(hoverTimer.current)
      window.clearTimeout(closeTimer.current)
      setOpen(null)
      if (restoreFocus && cur?.via === 'press') triggers.current[cur.i]?.focus()
    },
    [setOpen],
  )

  // 마우스를 잠시 올려 두면 열리고, 기능과 대화상자 둘 다에서 벗어나면 잠시 뒤 닫힌다.
  const hoverIn = (i: number, el: Element) => {
    if (window.matchMedia('(hover: none)').matches) return
    window.clearTimeout(closeTimer.current)
    if (openRef.current?.via === 'press') return
    if (openRef.current?.i === i) return
    window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => openAt(i, 'hover', el), 200)
  }
  const hoverOut = () => {
    window.clearTimeout(hoverTimer.current)
    if (openRef.current?.via !== 'hover') return
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(null), 250)
  }
  const keepOpen = () => window.clearTimeout(closeTimer.current)

  useEffect(
    () => () => {
      window.clearTimeout(hoverTimer.current)
      window.clearTimeout(closeTimer.current)
    },
    [],
  )

  const current = open ? features[open.i] : null
  const hotKey = open ? features[open.i].key : null

  return (
    <>
      {heading}
      <ul className="smc-signs smc-signs--features">
        {features.map((f, i) => (
          <li
            key={f.key}
            className={open?.i === i ? 'smc-sign smc-sign--feature is-hot' : 'smc-sign smc-sign--feature'}
            data-sign={`f-${f.key}`}
            onPointerEnter={(e) => hoverIn(i, e.currentTarget)}
            onPointerLeave={hoverOut}
          >
            <h3 className="smc-sign__title">
              <button
                ref={(el) => {
                  triggers.current[i] = el
                }}
                type="button"
                className="smc-sign__trigger"
                aria-haspopup="dialog"
                aria-expanded={open?.i === i}
                onClick={(e) => openAt(i, 'press', e.currentTarget)}
              >
                <span className="smc-strip">{f.title}</span>
              </button>
            </h3>
            <p className="smc-sign__body">
              <span className="smc-strip">{f.body}</span>
            </p>
          </li>
        ))}
      </ul>
      <Region name="features">
        <svg className="m-flat f-edges" style={{ left: 0, top: 0 }} width={TILE_W} height={TILE_H} viewBox={`0 0 ${TILE_W} ${TILE_H}`}>
          {EDGES.map(([a, b]) => (
            <path
              key={`${a}-${b}`}
              className={hotKey && (a === hotKey || b === hotKey) ? 'f-edge is-hot' : 'f-edge'}
              d={toD([POS[a], ...elbow(POS[a], POS[b])])}
            />
          ))}
        </svg>
        <span className="smc-anchor" data-anchor="h" style={{ left: 120, top: 200 }} />
        {features.map((f, i) => {
          const p = POS[f.key]
          return (
            <div
              key={f.key}
              className={hotKey === f.key ? 'f-screen is-hot' : 'f-screen'}
              style={{ left: p.x - FS.w / 2, top: p.y - FS.h / 2, width: FS.w, height: FS.h }}
              onPointerEnter={(e) => hoverIn(i, e.currentTarget)}
              onPointerLeave={hoverOut}
              onClick={(e) => openAt(i, 'press', e.currentTarget)}
            >
              <span className="m-screen__base" />
              <div className="m-screen__face">
                <FeatureArt k={f.key} />
              </div>
              <span className="smc-anchor" data-anchor={`f-${f.key}`} style={{ left: FS.w / 2, top: FS.h + 18 }} />
            </div>
          )
        })}
      </Region>
      {current && open && (
        <FeatureDialog
          feature={current}
          open={open}
          closeLabel={authCopy[locale].close}
          onClose={close}
          onEnter={keepOpen}
          onLeave={() => {
            if (openRef.current?.via === 'hover') hoverOut()
          }}
        />
      )}
    </>
  )
}
