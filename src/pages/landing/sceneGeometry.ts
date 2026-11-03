// 랜딩 판의 영역 배치와 장면 좌표. 장면을 그리는 `scenes.tsx`와 반복을 돌리는 `sceneLoops.ts`가
// 같은 좌표를 써야 해서 따로 둔다.
import { poly, type Pt } from './geom'

export const TILE_W = 2600
export const TILE_H = 2040
// 히어로 지도는 판의 y 0..1900에 있다. 다음 영역은 보는 사람 쪽(y가 커지는 쪽)으로 이어져서,
// 스크롤을 내리면 지도가 위로 밀리고 다음 영역이 화면 아래에서 들어온다. 영역 사이는 정지점마다
// 그 영역만 화면에 들어올 만큼 띄운다. 40px 격자에 맞춘다.
export const TILE_Y = { problem: 2040, flow: 4080, features: 6120 } as const
export type RegionName = keyof typeof TILE_Y

// § 01 첫 장면에서 사람이 빌드마다 다시 그리는 경로.
export const P1_ROUTE: Pt[] = [
  { x: 40, y: 192 },
  { x: 40, y: 146 },
  { x: 136, y: 146 },
  { x: 136, y: 96 },
  { x: 246, y: 96 },
  { x: 246, y: 62 },
  { x: 318, y: 62 },
]
export const P1_POLY = poly(P1_ROUTE)

// § 01 셋째 장면의 케이스 칸 격자와 두 사람이 지나가는 칸.
export const P3 = { cols: 14, rows: 9, step: 32, tile: 24, x: 46, y: 70 }
export const P3_A: [number, number][] = [
  [2, 2],
  [3, 2],
  [3, 3],
  [4, 3],
]
export const P3_B: [number, number][] = [
  [9, 6],
  [10, 6],
  [10, 7],
  [11, 7],
]
export const tileXY = ([c, r]: [number, number]) => ({ x: c * P3.step, y: r * P3.step })

// § 02 에이전트 플레이 장면의 커서 경로와 누르는 지점.
export const S2_PATH: Pt[] = [
  { x: 50, y: 214 },
  { x: 50, y: 168 },
  { x: 168, y: 168 },
  { x: 168, y: 122 },
  { x: 296, y: 122 },
  { x: 296, y: 78 },
  { x: 392, y: 78 },
]
export const S2_POLY = poly(S2_PATH)
export const S2_CLICKS = [2, 4, 6]
