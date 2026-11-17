// § 04 영상의 장면 그림. 포스터가 없는 영상의 화면, 필름 띠, 카드, 대화상자에 같은 그림을 쓴다.
// 멈춘 게임 화면, 에이전트 커서의 경로, evidence 표시를 지도의 말투로 그린다. 영상마다 구도가 달라
// 썸네일만 보고도 구분된다. 꾸밈이라 보조 기술에는 숨긴다.
import type { JSX } from 'react'
import { MARK_FRAME, MARK_SHARD } from '../../components/ArtelMark'
import type { VideoArtKind } from './videos'

const CURSOR = 'M0 0V14L3.6 10.6 6.2 16.2 8.6 15.1 6 9.6H11Z'

function Cursor({ x, y, s = 1.3 }: { x: number; y: number; s?: number }) {
  return <path className="m-cursor m-cursor--agent" d={CURSOR} transform={`translate(${x} ${y}) scale(${s})`} />
}

function Check({ x, y, r = 7 }: { x: number; y: number; r?: number }) {
  return (
    <g className="m-check" transform={`translate(${x} ${y}) scale(${r / 8.5})`}>
      <circle r="8.5" />
      <path d="M-4 0.3-1 3.3 4.4-3.1" />
    </g>
  )
}

/** SDK 연결: 에디터 화면 가운데 게임 뷰에 로그인 창이 떠 있고, 커서가 연결 버튼을 누른다. */
function SdkArt() {
  return (
    <>
      <rect className="va-ui" x="0" y="0" width="320" height="16" />
      <path className="va-flare" d="M156 4.5 165 8 156 11.5Z" />
      <rect className="va-ui" x="8" y="24" width="62" height="148" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} className={i === 2 ? 'va-ui va-ui--2' : 'va-ui va-ui--line'} x={14 + (i % 3) * 4} y={32 + i * 18} width={40 - (i % 3) * 8} height="7" />
      ))}
      <rect className="va-frame" x="80" y="24" width="160" height="148" />
      <rect className="va-ui" x="80" y="24" width="160" height="12" />
      <rect className="va-panel" x="112" y="58" width="96" height="80" />
      <rect className="va-ui va-ui--2" x="112" y="58" width="96" height="14" />
      <rect className="va-ui" x="122" y="82" width="76" height="9" />
      <rect className="va-ui" x="122" y="97" width="76" height="9" />
      <rect className="va-flare" x="138" y="114" width="44" height="14" />
      <rect className="va-ui" x="248" y="24" width="64" height="148" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} className="va-ui va-ui--line" x="256" y={34 + i * 22} width={44 - i * 6} height="8" />
      ))}
      <path className="va-route" d="M38 68V156H160V128" />
      <Check x={198} y={121} r={7} />
      <Cursor x={158} y={120} />
    </>
  )
}

/** 첫 QA 실행: 위에서 본 레벨. 에이전트가 방을 지나며 세 곳을 누르고 지나간 길이 코랄로 남는다. */
function RunArt() {
  const rooms = [
    [16, 18, 92, 64],
    [122, 18, 82, 64],
    [218, 18, 86, 64],
    [16, 98, 120, 66],
    [150, 98, 154, 66],
  ]
  const clicks = [
    [62, 50],
    [176, 131],
    [262, 50],
  ]
  return (
    <>
      {rooms.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} className="va-room" x={x} y={y} width={w} height={h} />
      ))}
      <rect className="va-ui" x="40" y="128" width="30" height="18" />
      <rect className="va-ui va-ui--2" x="240" y="112" width="40" height="14" />
      <rect className="va-ui" x="140" y="32" width="24" height="24" />
      <path className="va-route" d="M262 50H290V140" />
      <path className="va-trail" d="M62 50V90H176V131H218V50H262" />
      {clicks.map(([x, y], i) => (
        <g key={i}>
          <circle className="va-ring" cx={x} cy={y} r="9" />
          <circle className="va-flare" cx={x} cy={y} r="3" />
          <rect className="va-step" x={x + 10} y={y - 20} width="13" height="13" />
          <text className="va-mono" x={x + 16.5} y={y - 10.5}>
            {i + 1}
          </text>
        </g>
      ))}
      <circle className="va-dot-ring" cx="262" cy="50" r="13" />
    </>
  )
}

/** 실패한 순간: 멈춘 화면 위에 실패 표시와 근거 표시가 붙고, 아래 기록 줄에 그 순간이 찍혀 있다. */
function EvidenceArt() {
  const ticks = Array.from({ length: 13 }, (_, i) => 22 + i * 22)
  return (
    <>
      <rect className="va-frame" x="12" y="10" width="296" height="118" />
      <rect className="va-ui" x="12" y="10" width="296" height="12" />
      <rect className="va-ink" x="20" y="30" width="3.5" height="11" />
      <rect className="va-ink" x="27" y="30" width="3.5" height="11" />
      <rect className="va-ui" x="30" y="92" width="44" height="24" />
      <rect className="va-ui" x="246" y="36" width="46" height="12" />
      <rect className="va-panel" x="92" y="34" width="136" height="76" />
      <rect className="va-ui va-ui--2" x="92" y="34" width="136" height="13" />
      <rect className="va-ui va-ui--line" x="104" y="56" width="88" height="7" />
      <rect className="va-ui va-ui--2" x="106" y="84" width="46" height="13" />
      <rect className="va-ui" x="166" y="84" width="46" height="13" />
      <rect className="va-fail-box" x="161" y="79" width="56" height="23" />
      <path className="m-fail" d="M189 60 197 74H181Z" />
      <circle className="m-reason" cx="58" cy="60" r="6" />
      <path className="va-route" d="M64 60H92" />
      <line className="m-lane" x1="12" y1="156" x2="308" y2="156" />
      {ticks.map((x, i) =>
        i % 3 === 1 ? (
          <circle key={x} className={x <= 196 ? 'm-act is-past' : 'm-act'} cx={x} cy="156" r="3.5" />
        ) : (
          <rect key={x} className={x <= 196 ? 'm-obs is-past' : 'm-obs'} x={x - 4} y="152" width="8" height="8" />
        ),
      )}
      <line className="m-playhead" x1="200" y1="136" x2="200" y2="172" />
      <path className="m-fail" d="M193 136H207L200 146Z" />
    </>
  )
}

/** Macro: 성공한 조작 네 개가 한 묶음으로 저장되고, 고리 화살표로 다음 실행에서 다시 돈다. */
function MacroArt() {
  const xs = [20, 94, 168, 242]
  return (
    <>
      <rect className="va-save" x="10" y="34" width="300" height="74" />
      {xs.map((x, i) => (
        <g key={x}>
          <rect className="va-panel" x={x} y="46" width="58" height="48" />
          <rect className={i === 1 ? 'va-flare' : 'va-ui va-ui--2'} x={x} y="46" width="58" height="10" />
          <rect className="va-ui va-ui--line" x={x + 8} y="64" width={40 - i * 4} height="6" />
          <rect className="va-ui va-ui--line" x={x + 8} y="76" width={28 + i * 3} height="6" />
          {i < xs.length - 1 && <path className="va-arrow" d={`M${x + 58} 70H${x + 74}M${x + 69} 66 ${x + 74} 70 ${x + 69} 74`} />}
        </g>
      ))}
      <path className="m-loop" d="M271 108V140H49V112" />
      <path className="m-loop__head" d="M43 118 49 106 55 118Z" />
      <text className="va-mono va-mono--lg" x="160" y="134">
        ×3
      </text>
      <Cursor x={128} y={82} />
    </>
  )
}

/** GitHub Actions: 커밋 줄에서 빌드, QA, 결과로 이어지는 파이프라인. 아래는 지난 빌드의 결과다. */
function CiArt() {
  return (
    <>
      <line className="va-line" x1="16" y1="30" x2="304" y2="30" />
      {[40, 96, 152].map((x, i) => (
        <circle key={x} className={i === 2 ? 'va-commit is-head' : 'va-commit'} cx={x} cy="30" r="6" />
      ))}
      <path className="va-route" d="M152 36V58H62V78" />
      <rect className="va-panel" x="24" y="78" width="76" height="52" />
      <rect className="va-ui" x="40" y="112" width="44" height="8" />
      <rect className="va-ui va-ui--2" x="36" y="100" width="44" height="8" />
      <rect className="va-ui" x="32" y="88" width="44" height="8" />
      <path className="va-arrow" d="M100 104H120M114 99 120 104 114 109" />
      <rect className="va-panel va-panel--hot" x="122" y="78" width="76" height="52" />
      <g transform="translate(144 88) scale(0.5)">
        <polygon className="m-mark" points={MARK_FRAME} />
        <polygon className="m-mark-shard" points={MARK_SHARD} />
      </g>
      <path className="va-arrow" d="M198 104H218M212 99 218 104 212 109" />
      <rect className="va-panel" x="220" y="78" width="76" height="52" />
      <Check x={258} y={104} r={13} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} className={i === 1 ? 'va-run is-fail' : 'va-run'} x={24 + i * 20} y="150" width="12" height="12" />
      ))}
    </>
  )
}

const ART: Record<VideoArtKind, () => JSX.Element> = {
  sdk: SdkArt,
  run: RunArt,
  evidence: EvidenceArt,
  macro: MacroArt,
  ci: CiArt,
}

export function VideoArt({ kind, className = '' }: { kind: VideoArtKind; className?: string }) {
  const Art = ART[kind]
  return (
    <svg className={`va ${className}`} viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect className="va-bg" width="320" height="180" />
      <Art />
    </svg>
  )
}
