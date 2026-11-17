// 랜딩 § 04 영상. 판 위에 큰 화면 하나가 표지판처럼 똑바로 서고, 그 앞 판에 필름 띠가 눕는다. 지금 영상의
// 칸은 떠서 코랄 테두리가 되고 에이전트 점이 그 위에 앉는다. 영상을 바꾸면 점이 경로를 따라 다음 칸으로
// 가고, 띠가 밀려 지금 칸이 가운데에 오며, 큰 화면은 짧게 채널이 바뀐다. 재생은 대화상자에서 한다.
// 좁은 화면과 움직임 줄이기에서는 큰 화면 아래에 가로로 넘기는 카드 목록을 둔다.
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { gsap } from 'gsap'
import type { Locale } from '../../i18n/locale'
import type { messages } from '../../i18n/messages'
import { useModalDialog } from '../../lib/useModalDialog'
import { elbow, pointAt, poly, toD, type Pt } from './geom'
import { TILE_H, TILE_W, V4, thumbCenter } from './sceneGeometry'
import { Region } from './scenes'
import { VideoArt } from './videoArt'
import { isReady, posterOf, videoCategories, videos, youtubeEmbedUrl, type Video } from './videos'

type VideoCopy = (typeof messages)['ko']['videos']

const total = videos.length
const pad2 = (n: number) => String(n).padStart(2, '0')
const wrap = (i: number) => ((i % total) + total) % total
/** `{title} 재생`처럼 문구 안의 `{title}`을 영상 제목으로 바꾼다. */
const withTitle = (text: string, title: string) => text.replace('{title}', title)

// 필름 띠 안의 칸 가운데와 그 사이를 잇는 직각 경로. 띠의 원점은 첫 칸의 가운데다.
const CENTERS = videos.map((_, i) => thumbCenter(i))
const ROUTE_PTS: Pt[] = [CENTERS[0]]
const STOP_IDX = [0]
for (let i = 1; i < CENTERS.length; i++) {
  ROUTE_PTS.push(...elbow(CENTERS[i - 1], CENTERS[i]))
  STOP_IDX.push(ROUTE_PTS.length - 1)
}
const ROUTE = poly(ROUTE_PTS)
const STOPS = STOP_IDX.map((i) => ROUTE.cum[i])
const ROUTE_D = toD(ROUTE_PTS)
// 점은 뜬 칸 위에 앉는다.
const DOT_Z = V4.lift + 6
// 큰 화면 아래 변에서 필름 띠 위쪽까지 내려오는 코랄 선. 지금 칸은 늘 가운데 있다.
const WIRE_END = V4.stripY - V4.zig - V4.thumbH / 2 - 6

function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}

/** 포스터가 있으면 포스터, 없으면 영상마다 다른 장면 그림. */
function Cover({ video }: { video: Video }) {
  const poster = posterOf(video)
  return poster ? <img className="vr-poster" src={poster} alt="" loading="lazy" decoding="async" /> : <VideoArt kind={video.art} />
}

/* ── 재생 대화상자 ─────────────────────────────────────── */

function VideoDialog({ video, locale, copy, closeLabel, onClose }: { video: Video; locale: Locale; copy: VideoCopy; closeLabel: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const summaryId = useId()
  const soonId = useId()
  // 열고 닫을 때 스크롤 위치를 지키고, 휠과 이동 키가 랜딩 스냅에 닿지 않게 한다. 닫으면 대화상자가
  // 사라지면서 iframe과 video도 함께 없어지므로 재생이 멈춘다.
  useModalDialog(dialog, { initialFocus: closeRef, scroller: sheetRef })

  const { source } = video
  const title = video.title[locale]
  return (
    <dialog
      ref={dialog}
      className="vd"
      aria-labelledby={titleId}
      aria-describedby={source ? summaryId : `${soonId} ${summaryId}`}
      onCancel={onClose}
      onClick={(event) => {
        // 판 바깥(배경)을 누르면 닫는다.
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div ref={sheetRef} className="vd-sheet">
        <span aria-hidden="true" className="fx-crop fx-crop--tl" />
        <span aria-hidden="true" className="fx-crop fx-crop--tr" />
        <span aria-hidden="true" className="fx-crop fx-crop--bl" />
        <span aria-hidden="true" className="fx-crop fx-crop--br" />
        <button ref={closeRef} type="button" className="fx-close vd-close" aria-label={closeLabel} onClick={onClose} />
        <div className={source ? 'vd-player' : 'vd-player is-soon'}>
          {source?.kind === 'youtube' && (
            <iframe
              src={youtubeEmbedUrl(source.id)}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
          {source?.kind === 'file' && <video src={source.src} poster={source.poster} controls autoPlay playsInline />}
          {!source && (
            <>
              <VideoArt kind={video.art} />
              <p className="vd-soon" id={soonId}>
                {copy.preparingMessage}
              </p>
            </>
          )}
        </div>
        <div className="vd-meta">
          <p className="vd-meta__row">
            <span className="vr-tag">{videoCategories[video.category][locale]}</span>
            {video.duration && <span className="vr-count">{video.duration}</span>}
          </p>
          <h2 className="vd-title" id={titleId}>
            {title}
          </h2>
          <p className="vd-summary" id={summaryId}>
            {video.summary[locale]}
          </p>
        </div>
      </div>
    </dialog>
  )
}

/* ── § 04 묶음: 큰 화면 + 필름 띠 + 카드 + 대화상자 ─────────── */

type Props = { locale: Locale; copy: VideoCopy; closeLabel: string; heading: ReactNode; headingId: string }

export function VideoBlock({ locale, copy, closeLabel, heading, headingId }: Props) {
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [index, setIndex] = useState(0)
  // 바뀐 횟수. 큰 화면의 채널 바뀜 효과를 다시 그리는 key로 쓰고, 처음 그릴 때는 효과를 내지 않는다.
  const [switches, setSwitches] = useState(0)
  const [announce, setAnnounce] = useState('')
  const [hoverStage, setHoverStage] = useState(false)
  const [hoverStrip, setHoverStrip] = useState(false)
  const [focused, setFocused] = useState(false)
  const [focusStrip, setFocusStrip] = useState(false)
  const [inView, setInView] = useState(false)
  const [playing, setPlaying] = useState<Video | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLUListElement>(null)
  const dot = useRef({ L: STOPS[0] })
  const placed = useRef(false)
  const swipe = useRef<{ x: number; y: number; moved: boolean } | null>(null)
  const video = videos[index]
  const ready = isReady(video)
  // 섹션이 지금 섹션이고, 아무것도 올려 두거나 포커스하지 않았고, 대화상자가 닫혀 있을 때만 넘긴다.
  const canAuto = !reduce && total > 1
  const running = canAuto && inView && !hoverStage && !hoverStrip && !focused && !focusStrip && !playing

  const select = (raw: number, manual: boolean) => {
    const next = wrap(raw)
    if (next === index) return
    setIndex(next)
    setSwitches((n) => n + 1)
    // 직접 바꿀 때만 읽어 준다. 저절로 넘어갈 때마다 읽으면 다른 내용을 읽는 중에 끼어든다.
    if (manual) setAnnounce(`${next + 1} / ${total}, ${videos[next].title[locale]}`)
  }

  // 섹션이 화면을 대부분 덮고 있을 때를 지금 섹션으로 본다. 좁은 화면에서는 섹션이 화면보다 길 수 있어
  // 섹션 비율이 아니라 화면을 덮은 높이로 잰다.
  useEffect(() => {
    const section = rootRef.current?.closest('section')
    if (!section) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRect.height >= window.innerHeight * 0.6),
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    )
    io.observe(section)
    return () => io.disconnect()
  }, [])

  // 필름 띠를 밀어 지금 칸을 가운데에 두고, 점을 경로를 따라 지금 칸으로 옮긴다.
  useEffect(() => {
    const strip = stripRef.current
    const agent = dotRef.current
    if (!strip || !agent) return
    const state = dot.current
    const place = () => {
      const p = pointAt(ROUTE, state.L)
      agent.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, ${DOT_Z}px)`
    }
    const x = -CENTERS[index].x
    if (reduce || !placed.current) {
      placed.current = true
      gsap.set(strip, { x })
      state.L = STOPS[index]
      place()
      return
    }
    const tweens = [
      gsap.to(strip, { x, duration: 0.6, ease: 'expo.out', overwrite: 'auto' }),
      gsap.to(state, { L: STOPS[index], duration: 0.6, ease: 'expo.out', overwrite: 'auto', onUpdate: place }),
    ]
    return () => tweens.forEach((t) => t.kill())
  }, [index, reduce])

  // 좁은 화면의 카드 목록이 보이면 지금 카드를 목록 가운데로 옮긴다. 페이지는 스크롤하지 않는다.
  useEffect(() => {
    const list = cardsRef.current
    const card = list?.children[index] as HTMLElement | undefined
    if (!list || !card || !list.clientWidth || !switches) return
    list.scrollTo({ left: card.offsetLeft - (list.clientWidth - card.clientWidth) / 2, behavior: reduce ? 'auto' : 'smooth' })
  }, [index, switches, reduce])

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    if ((event.target as HTMLElement).closest('input, textarea')) return
    // 위아래 키와 PageUp·PageDown은 그대로 두어 섹션 스냅이 움직인다. 좌우 키만 여기서 끝낸다.
    event.preventDefault()
    event.stopPropagation()
    select(index + (event.key === 'ArrowRight' ? 1 : -1), true)
  }
  const leaves = (event: FocusEvent<HTMLElement>) => !event.currentTarget.contains(event.relatedTarget as Node | null)

  // 터치로 큰 화면을 옆으로 밀면 넘긴다. 세로로 미는 것은 페이지 스크롤로 둔다.
  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') return
    swipe.current = { x: event.clientX, y: event.clientY, moved: false }
  }
  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const start = swipe.current
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      start.moved = true
      select(index + (dx < 0 ? 1 : -1), true)
      // 같은 손짓으로 생긴 클릭만 막고, 다음 탭은 그대로 받는다.
      window.setTimeout(() => {
        if (swipe.current === start) swipe.current = null
      }, 300)
    } else {
      swipe.current = null
    }
  }
  const open = () => {
    // 밀어서 넘긴 직후의 탭은 재생으로 치지 않는다.
    if (swipe.current?.moved) {
      swipe.current = null
      return
    }
    setPlaying(video)
  }

  return (
    <>
      {heading}
      <div
        ref={rootRef}
        className="vr"
        role="region"
        aria-roledescription="carousel"
        aria-labelledby={headingId}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={(event) => leaves(event) && setFocused(false)}
        onPointerEnter={() => setHoverStage(true)}
        onPointerLeave={() => setHoverStage(false)}
      >
        <ul className="smc-signs smc-signs--videos">
          <li className="smc-sign smc-sign--video" data-sign="v-screen">
            <div className="vr-stage">
              <div className="vr-slide" role="group" aria-roledescription="slide" aria-label={`${index + 1} / ${total}`}>
                <div className="vr-screen">
                  <div className="vr-screen__bar" aria-hidden="true">
                    <span className="vr-screen__rec" />
                    <span className="vr-screen__track">
                      {videos.map((v, i) => (
                        <i key={v.key} className={i === index ? 'is-current' : undefined} />
                      ))}
                    </span>
                    {canAuto && (
                      <span
                        key={index}
                        className="vr-progress"
                        style={{ animationPlayState: running ? 'running' : 'paused' }}
                        onAnimationEnd={() => select(index + 1, false)}
                      />
                    )}
                  </div>
                  {/* 화면 전체가 재생 버튼이다. 준비 중인 영상도 눌러서 안내를 본다. 가운데 표시는 그림이다. */}
                  <button
                    type="button"
                    className="vr-screen__face"
                    aria-haspopup="dialog"
                    aria-label={withTitle(copy.play, video.title[locale])}
                    onClick={open}
                    onPointerDown={onPointerDown}
                    onPointerUp={onPointerUp}
                    onPointerCancel={() => {
                      swipe.current = null
                    }}
                  >
                    <Cover video={video} />
                    {switches > 0 && <span key={switches} className="vr-wipe" aria-hidden="true" />}
                    {ready ? (
                      <span className="vr-play" aria-hidden="true">
                        <svg viewBox="0 0 24 24" focusable="false">
                          <path d="M8 5.5 19 12 8 18.5Z" />
                        </svg>
                      </span>
                    ) : (
                      <span className="vr-soon">{copy.preparing}</span>
                    )}
                  </button>
                </div>
                <div className="vr-meta">
                  <p className="vr-meta__row">
                    <span className="vr-tag">{videoCategories[video.category][locale]}</span>
                    <span className="vr-count">
                      {pad2(index + 1)} / {pad2(total)}
                    </span>
                  </p>
                  <h3 className="vr-title">
                    <span className="smc-strip">{video.title[locale]}</span>
                  </h3>
                  <p className="vr-summary">
                    <span className="smc-strip">{video.summary[locale]}</span>
                  </p>
                  {video.duration && (
                    <p className="vr-duration">
                      <span className="smc-strip">{video.duration}</span>
                    </p>
                  )}
                </div>
              </div>
              {total > 1 && (
                <div className="vr-controls">
                  <button type="button" className="vr-nav" aria-label={copy.previous} onClick={() => select(index - 1, true)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M15 5 8 12 15 19" />
                    </svg>
                  </button>
                  <button type="button" className="vr-nav" aria-label={copy.next} onClick={() => select(index + 1, true)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M9 5 16 12 9 19" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </li>
        </ul>

        {/* 무대가 없을 때(좁은 화면, 움직임 줄이기)만 보이는 카드 목록. 가로로 넘기며 고른다. */}
        <ul ref={cardsRef} className="vr-cards">
          {videos.map((v, i) => (
            <li key={v.key}>
              <button type="button" className="vr-card" aria-current={i === index || undefined} onClick={() => select(i, true)}>
                <span className="vr-card__frame">
                  <Cover video={v} />
                  {!isReady(v) && <span className="vr-card__soon">{copy.preparing}</span>}
                </span>
                <span className="vr-card__tag">
                  {pad2(i + 1)} · {videoCategories[v.category][locale]}
                  {v.duration ? ` · ${v.duration}` : ''}
                </span>
                <span className="vr-card__title">{v.title[locale]}</span>
              </button>
            </li>
          ))}
        </ul>

        <p className="visually-hidden" aria-live="polite">
          {announce}
        </p>
      </div>

      {/* 필름 띠의 칸은 판 위의 진짜 버튼이라 영역을 보조 기술에 숨기지 않는다. 꾸밈 요소만 따로 숨긴다. */}
      <Region name="videos" interactive>
        <span className="smc-anchor" data-anchor="h" style={{ left: 120, top: 200 }} aria-hidden="true" />
        <span className="smc-anchor" data-anchor="v-screen" style={{ left: V4.centerX, top: V4.screenY }} aria-hidden="true" />
        <svg className="m-flat" style={{ left: 0, top: 0 }} width={TILE_W} height={TILE_H} viewBox={`0 0 ${TILE_W} ${TILE_H}`} aria-hidden="true">
          {/* 큰 화면이 서 있는 자리와, 그 자리에서 지금 칸으로 내려오는 코랄 선 */}
          <rect className="vr-foot" x={V4.centerX - 320} y={V4.screenY - 8} width={640} height={16} />
          <path className="vr-wire" d={`M${V4.centerX} ${V4.screenY + 8}V${WIRE_END}`} />
        </svg>
        <div
          ref={stripRef}
          className="vr-strip"
          style={{ left: V4.centerX, top: V4.stripY }}
          onPointerEnter={() => setHoverStrip(true)}
          onPointerLeave={() => setHoverStrip(false)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocusStrip(true)}
          onBlur={(event) => leaves(event) && setFocusStrip(false)}
        >
          <svg className="m-flat" style={{ left: 0, top: 0 }} width={1} height={1} aria-hidden="true">
            <path className="m-route" d={ROUTE_D} />
          </svg>
          {videos.map((v, i) => {
            const c = CENTERS[i]
            const current = i === index
            // 다른 칸을 누르면 그 영상으로 옮기고, 지금 칸을 누르면 재생한다. 이름도 그에 맞춘다.
            return (
              <button
                key={v.key}
                type="button"
                className={current ? 'vr-thumb is-current' : 'vr-thumb'}
                style={{ left: c.x - V4.thumbW / 2, top: c.y - V4.thumbH / 2, width: V4.thumbW, height: V4.thumbH }}
                aria-label={withTitle(current ? copy.play : copy.show, v.title[locale])}
                aria-current={current || undefined}
                aria-haspopup={current ? 'dialog' : undefined}
                onClick={() => (current ? setPlaying(v) : select(i, true))}
              >
                <span className="m-screen__base" />
                <span className="m-screen__face">
                  <Cover video={v} />
                </span>
              </button>
            )
          })}
          <div ref={dotRef} className="smc-agent vr-dot" aria-hidden="true">
            <span className="smc-agent__ring" />
            <span className="smc-agent__core" />
            <span className="smc-agent__stem" />
          </div>
        </div>
      </Region>

      {playing && <VideoDialog video={playing} locale={locale} copy={copy} closeLabel={closeLabel} onClose={() => setPlaying(null)} />}
    </>
  )
}
