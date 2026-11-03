// 랜딩 지도 위의 장면. § 01, § 02, § 03 영역이 히어로 지도와 같은 판의 다른 자리에 놓인다.
// 상자 카드 없이 지도의 말투(화면 프레임, 경로, 커서, 에이전트 점, 기호)와 깊이(쌓인 층, 솟는 칸,
// 세운 기둥)로 뜻을 보여 준다. 글자는 빌드 번호와 키 이름 같은 mono 데이터만 쓴다.
// JS가 돌지 않아도 장면은 뜻이 다 드러난 마지막 상태로 그려진다. 움직임은 그 위에 도는 반복이다.
import type { CSSProperties, ReactNode } from 'react'
import { MARK_FRAME, MARK_SHARD } from '../../components/ArtelMark'
import { toD } from './geom'
import {
  P1_POLY,
  P1_ROUTE,
  P3,
  P3_A,
  P3_B,
  S2_CLICKS,
  S2_PATH,
  S2_POLY,
  TILE_H,
  TILE_W,
  TILE_Y,
  tileXY,
  type RegionName,
} from './sceneGeometry'

/* ── 판 위 영역 ───────────────────────────────────────── */

const CURSOR = 'M0 0V14L3.6 10.6 6.2 16.2 8.6 15.1 6 9.6H11Z'

type Box = { left: number; top: number; width: number; height: number }
const box = (b: Box): CSSProperties => ({ left: b.left, top: b.top, width: b.width, height: b.height })

/** 판에 세운 요소. 아래 변이 판에 닿고 판에서 수직으로 선다. */
function Stand({ x, y, w, h, className = '', children }: { x: number; y: number; w: number; h: number; className?: string; children?: ReactNode }) {
  return (
    <div className={`m-stand ${className}`} style={{ left: x - w / 2, top: y - h, width: w, height: h }}>
      {children}
    </div>
  )
}

/** 판 위의 화면 프레임. 지도 화면과 같은 테두리, 상단 막대, 바닥 그림자. */
function Screen({ b, className = '', children }: { b: Box; className?: string; children?: ReactNode }) {
  return (
    <div className={`m-screen ${className}`} style={box(b)}>
      <span className="m-screen__base" />
      <div className="m-screen__face">{children}</div>
    </div>
  )
}

const Anchor = ({ id, x, y }: { id: string; x: number; y: number }) => (
  <span className="smc-anchor" data-anchor={id} style={{ left: x, top: y }} />
)

function LoopGlyph() {
  return (
    <svg className="m-glyph" viewBox="-10 -10 20 20">
      <path className="m-loop" d="M5.2 -2.6A5.8 5.8 0 1 0 5.6 2.4" />
      <path className="m-loop__head" d="M2.6 -5.6 6.6 -2.2 2.2 -0.8Z" />
    </svg>
  )
}
function CheckGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={`m-glyph m-check ${className}`} viewBox="-10 -10 20 20">
      <circle r="8.5" />
      <path d="M-4 0.3-1 3.3 4.4-3.1" />
    </svg>
  )
}
function TriGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={`m-glyph m-tri ${className}`} viewBox="-10 -10 20 20">
      <path d="M0 -8 8.6 7H-8.6Z" />
    </svg>
  )
}

/** 영역 하나. 데스크톱에서는 화면 전체를 덮는 고정 층으로 히어로 지도와 같은 카메라를 쓰고,
 *  좁은 화면과 움직임 줄이기에서는 섹션 안의 정적인 지도 띠가 된다. */
export function Region({ name, children }: { name: RegionName; children: ReactNode }) {
  return (
    <div className={`smc-region smc-region--${name}`} aria-hidden="true">
      <div className="smc-region__camera">
        <div className="smc-rig smc-rig--region">
          <div className="smc-tile" style={{ top: TILE_Y[name], width: TILE_W, height: TILE_H }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── § 01 ─────────────────────────────────────────────── */

const PROBLEM_X = [560, 1300, 2040]
const SCN_W = 560
const SCN_H = 460
const SCN_TOP = 600

// 1. 빌드마다 같은 경로를 사람이 다시 그린다. 같은 화면이 빌드마다 한 층씩 위로 쌓인다.
const P1_D = toD(P1_ROUTE)
const P1_LAYER = { w: 360, h: 230, gap: 74 }
const P1_AT = { x: 90, y: 150 }

function SceneRegression() {
  const corners = [
    [0, 0],
    [P1_LAYER.w, 0],
    [0, P1_LAYER.h],
    [P1_LAYER.w, P1_LAYER.h],
  ]
  return (
    <div className="m-scn p1" style={box({ left: PROBLEM_X[0] - SCN_W / 2, top: SCN_TOP, width: SCN_W, height: SCN_H })}>
      <div className="p1-stack" style={{ left: P1_AT.x, top: P1_AT.y, width: P1_LAYER.w, height: P1_LAYER.h }}>
        <span className="p1-shadow" />
        {corners.map(([x, y]) => (
          <span key={`${x}-${y}`} className="p1-post" style={{ left: x, top: y - P1_LAYER.gap * 2, height: P1_LAYER.gap * 2 }} />
        ))}
        {[0, 1, 2].map((k) => (
          <div key={k} className={k === 2 ? 'p1-layer is-on' : 'p1-layer'} style={{ transform: `translateZ(${k * P1_LAYER.gap}px)` }}>
            <svg viewBox={`0 0 ${P1_LAYER.w} ${P1_LAYER.h}`}>
              <rect className="p1-face" x="1" y="1" width={P1_LAYER.w - 2} height={P1_LAYER.h - 2} />
              <rect className="p1-bar" x="1" y="1" width={P1_LAYER.w - 2} height="26" />
              <text className="p1-tag" x="14" y="19">
                #{41 + k}
              </text>
              <path className="m-route" d={P1_D} />
              <path className="p1-trace" d={P1_D} style={{ strokeDasharray: P1_POLY.total }} />
              {P1_ROUTE.map((p, i) => (
                <rect key={i} className="m-step" x={p.x - 4} y={p.y - 4} width="8" height="8" />
              ))}
              <path className="m-cursor m-cursor--ink p1-cursor" d={CURSOR} transform={`translate(${P1_ROUTE[6].x} ${P1_ROUTE[6].y}) scale(1.6)`} />
            </svg>
          </div>
        ))}
      </div>
      <Stand x={500} y={300} w={56} h={56} className="m-sign-glyph">
        <LoopGlyph />
      </Stand>
      <Anchor id="p0" x={SCN_W / 2} y={SCN_H - 10} />
    </div>
  )
}

// 2. 글로만 남은 재현 절차와 다시 열리는 이슈. 닫힌 이슈로 경로가 되돌아오면 코랄 삼각형이 된다.
const P2_LOOP = 'M420 250H526V412H330V312H420V250'

function SceneRepro() {
  return (
    <div className="m-scn p2" style={box({ left: PROBLEM_X[1] - SCN_W / 2, top: SCN_TOP, width: SCN_W, height: SCN_H })}>
      <Screen b={{ left: 30, top: 80, width: 270, height: 310 }} className="p2-doc">
        {[86, 72, 92, 64, 80, 58].map((w, i) => (
          <i key={i} className="p2-line" style={{ width: `${w}%` }} />
        ))}
        <svg className="p2-slot" viewBox="0 0 230 92" preserveAspectRatio="none">
          <rect x="1" y="1" width="228" height="90" />
          <path d="M1 1 229 91M229 1 1 91" />
        </svg>
      </Screen>
      <svg className="m-flat" width={SCN_W} height={SCN_H} viewBox={`0 0 ${SCN_W} ${SCN_H}`}>
        <path className="m-link" d="M300 250H420" />
        <path className="p2-loop" d={P2_LOOP} pathLength={1} />
      </svg>
      <div className="p2-pin is-reopen" style={{ left: 420, top: 250 }}>
        <div className="p2-pin__post">
          <span className="p2-pin__stem" />
          <span className="p2-pin__head">
            <CheckGlyph className="p2-ok" />
            <TriGlyph className="p2-bad" />
          </span>
        </div>
      </div>
      <Anchor id="p1" x={SCN_W / 2} y={SCN_H - 10} />
    </div>
  )
}

// 3. 끝없이 늘어나는 케이스 칸과 두 사람. 사람이 지나간 몇 칸만 솟는다.
function SceneCases() {
  const up = new Set([...P3_A, ...P3_B].map(([c, r]) => `${c}-${r}`))
  const tiles: ReactNode[] = []
  for (let r = 0; r < P3.rows; r++)
    for (let c = 0; c < P3.cols; c++) {
      const { x, y } = tileXY([c, r])
      tiles.push(<span key={`${c}-${r}`} className={up.has(`${c}-${r}`) ? 'p3-tile is-up' : 'p3-tile'} style={{ left: x, top: y }} />)
    }
  const a = tileXY(P3_A[3])
  const b = tileXY(P3_B[3])
  return (
    <div className="m-scn p3" style={box({ left: PROBLEM_X[2] - SCN_W / 2, top: SCN_TOP, width: SCN_W, height: SCN_H })}>
      <div className="p3-field" style={{ left: P3.x, top: P3.y, width: P3.cols * P3.step, height: P3.rows * P3.step }}>
        {tiles}
        {Array.from({ length: P3.rows }, (_, r) => {
          const { x, y } = tileXY([P3.cols, r])
          return <span key={r} className="p3-tile p3-new" style={{ left: x, top: y }} />
        })}
        <svg className="p3-cur p3-cur-a" viewBox="0 0 12 17" style={{ transform: `translate3d(${a.x + 8}px, ${a.y + 8}px, 40px)` }}>
          <path className="m-cursor m-cursor--ink" d={CURSOR} />
        </svg>
        <svg className="p3-cur p3-cur-b" viewBox="0 0 12 17" style={{ transform: `translate3d(${b.x + 8}px, ${b.y + 8}px, 40px)` }}>
          <path className="m-cursor m-cursor--ink" d={CURSOR} />
        </svg>
      </div>
      <Anchor id="p2" x={SCN_W / 2} y={SCN_H - 10} />
    </div>
  )
}

export function ProblemScenes() {
  return (
    <>
      <Anchor id="h" x={200} y={170} />
      <SceneRegression />
      <SceneRepro />
      <SceneCases />
    </>
  )
}

/* ── § 02 ─────────────────────────────────────────────── */

const FLOW_X = [520, 1300, 2080]
const FLOW_ROUTE_Y = 1010

function UIBlocks({ blocks }: { blocks: [number, number, number, number, 1 | 2][] }) {
  return (
    <>
      {blocks.map(([x, y, w, h, t], i) => (
        <i key={i} className={`m-ui m-ui--${t}`} style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }} />
      ))}
    </>
  )
}

/** 판 위의 압출 상자. 윗면, 앞면, 옆면. */
function Cube({ b, h, className = '', top }: { b: Box; h: number; className?: string; top?: ReactNode }) {
  return (
    <div className={`m-cube ${className}`} style={box(b)}>
      <span className="m-cube__shadow" />
      <span className="m-cube__front" style={{ top: b.height - h, height: h }} />
      <span className="m-cube__side" style={{ left: b.width, width: h }} />
      <div className="m-cube__top" style={{ transform: `translateZ(${h}px)` }}>
        {top}
      </div>
    </div>
  )
}

// 01 SDK 연결: ARTEL 패키지 상자가 게임 화면의 소켓에 붙고 연결이 확인된다.
function StationConnect() {
  const cx = FLOW_X[0]
  return (
    <>
      <Screen b={{ left: cx - 300, top: 650, width: 380, height: 240 }} className="s1-game">
        <UIBlocks
          blocks={[
            [24, 22, 52, 22, 2],
            [34, 54, 32, 7, 1],
            [34, 66, 32, 7, 1],
            [34, 78, 32, 7, 1],
          ]}
        />
        <i className="s1-socket" />
      </Screen>
      <svg className="m-flat" style={{ left: cx + 80, top: 700 }} width="160" height="220" viewBox="0 0 160 220">
        <path className="s1-wire" d="M0 70H40M0 92H40" />
        <path className="s1-link" d="M96 152V196H150" />
      </svg>
      <Cube b={{ left: cx + 120, top: 718, width: 116, height: 116 }} h={56} className="s1-cube" top={
        <svg className="s1-mark" viewBox="0 0 64 64">
          <polygon className="m-mark" points={MARK_FRAME} />
          <polygon className="m-mark-shard" points={MARK_SHARD} />
        </svg>
      } />
      <Stand x={cx + 250} y={898} w={46} h={46} className="m-sign-glyph s1-check">
        <CheckGlyph />
      </Stand>
      <Anchor id="s0" x={cx - 110} y={FLOW_ROUTE_Y + 40} />
    </>
  )
}

// 02 에이전트 플레이: 코랄 에이전트 커서가 게임 화면을 지나며 누르고, 앞에 선 키가 눌린다.
function StationPlay() {
  const cx = FLOW_X[1]
  return (
    <>
      <Screen b={{ left: cx - 230, top: 620, width: 460, height: 290 }} className="s2-game">
        <svg className="s2-svg" viewBox="0 0 460 262" preserveAspectRatio="none">
          <rect className="m-ui-fill" x="30" y="222" width="110" height="9" />
          <rect className="m-ui-fill" x="140" y="176" width="90" height="9" />
          <rect className="m-ui-fill" x="262" y="130" width="90" height="9" />
          <rect className="m-ui-fill" x="360" y="86" width="64" height="9" />
          <rect className="m-ui-fill m-ui-fill--2" x="404" y="46" width="22" height="26" />
          <path className="m-route" d={toD(S2_PATH)} />
          <path className="s2-trail" d={toD(S2_PATH)} style={{ strokeDasharray: S2_POLY.total }} />
          {S2_CLICKS.map((i) => (
            <circle key={i} className="s2-ripple" cx={S2_PATH[i].x} cy={S2_PATH[i].y} r="14" />
          ))}
          <line className="m-lane" x1="20" y1="248" x2="440" y2="248" />
          {[60, 150, 240, 330].map((x) => (
            <circle key={x} className="m-obs s2-mark is-past" cx={x} cy="248" r="5" data-x={x} />
          ))}
          {[100, 190, 280, 370].map((x) => (
            <rect key={x} className="m-act s2-mark is-past" x={x - 1.5} y="240" width="3" height="16" data-x={x} />
          ))}
          <line className="m-playhead s2-head" x1="440" y1="236" x2="440" y2="260" />
          <path className="m-cursor m-cursor--agent s2-cursor" d={CURSOR} transform={`translate(${S2_PATH[6].x} ${S2_PATH[6].y}) scale(1.5)`} />
        </svg>
      </Screen>
      <Stand x={cx - 170} y={958} w={56} h={44} className="m-key s2-key-w">
        <span>W</span>
      </Stand>
      <Stand x={cx - 70} y={958} w={124} h={44} className="m-key s2-key-space">
        <span>Space</span>
      </Stand>
      <Anchor id="s1" x={cx} y={FLOW_ROUTE_Y + 40} />
    </>
  )
}

// 03 실행 기록: 멈춘 화면 위로 코랄 실패 상자가 뜨고, 앞에 증거 타임라인이 눕고, 이슈가 떠올라 밖으로 나간다.
function StationRecord() {
  const cx = FLOW_X[2]
  return (
    <>
      <Screen b={{ left: cx - 300, top: 640, width: 380, height: 236 }} className="s3-frozen">
        <UIBlocks
          blocks={[
            [8, 20, 34, 8, 1],
            [8, 34, 24, 8, 1],
            [8, 82, 82, 8, 1],
            [54, 34, 26, 28, 2],
          ]}
        />
        <i className="s3-bbox" />
      </Screen>
      <svg className="m-flat s3-timeline" style={{ left: cx - 300, top: 906 }} width="380" height="84" viewBox="0 0 380 84">
        {[14, 40, 66].map((y) => (
          <line key={y} className="m-lane" x1="0" y1={y} x2="380" y2={y} />
        ))}
        {[30, 92, 150].map((x) => (
          <circle key={x} className="m-obs is-past" cx={x} cy="14" r="6" />
        ))}
        {[56, 120, 196].map((x) => (
          <rect key={x} className="m-act is-past" x={x - 2} y="30" width="4" height="20" />
        ))}
        {[74, 172].map((x) => (
          <path key={x} className="m-reason" d={`M${x} 56 ${x + 10} 66 ${x} 76 ${x - 10} 66Z`} />
        ))}
        <path className="m-fail" d="M268 4 279 22H257Z" />
        <line className="m-playhead s3-head" x1="268" y1="0" x2="268" y2="84" />
      </svg>
      <svg className="m-flat" style={{ left: cx + 100, top: 600 }} width="200" height="200" viewBox="0 0 200 200">
        <path className="s3-export" d="M58 120V30H196" pathLength={1} />
        <path className="s3-export-head" d="M186 20 197 30 186 40" />
      </svg>
      <Cube b={{ left: cx + 112, top: 690, width: 92, height: 72 }} h={14} className="s3-issue" top={<TriGlyph />} />
      <Anchor id="s2" x={cx - 110} y={FLOW_ROUTE_Y + 40} />
    </>
  )
}

export function FlowScenes() {
  const route = [`M120 ${FLOW_ROUTE_Y}H2480`, `M${FLOW_X[0] - 110} 890V${FLOW_ROUTE_Y}`, `M${FLOW_X[1]} 910V${FLOW_ROUTE_Y}`, `M${FLOW_X[2] - 110} 876V${FLOW_ROUTE_Y}`]
  return (
    <>
      <Anchor id="h" x={200} y={220} />
      <svg className="m-flat flow-route" style={{ left: 0, top: 0 }} width={TILE_W} height={TILE_H} viewBox={`0 0 ${TILE_W} ${TILE_H}`}>
        <path className="flow-line" d={route.join(' ')} />
        {[FLOW_X[0] - 110, FLOW_X[1], FLOW_X[2] - 110].map((x) => (
          <rect key={x} className="flow-node" x={x - 9} y={FLOW_ROUTE_Y - 9} width="18" height="18" />
        ))}
      </svg>
      <StationConnect />
      <StationPlay />
      <StationRecord />
      <div className="smc-agent flow-agent" style={{ transform: `translate3d(${FLOW_X[1]}px, ${FLOW_ROUTE_Y}px, 20px)` }}>
        <span className="smc-agent__ring" />
        <span className="smc-agent__core" />
        <span className="smc-agent__stem" />
      </div>
    </>
  )
}
