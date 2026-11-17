// Wishlist 대화상자 위쪽의 작은 지도. 화면 프레임 두 개를 지나는 직각 경로 끝에 ARTEL 심볼이 든
// 출시 프레임이 있고, 코랄 에이전트 점이 그 문 앞까지 천천히 오간다. 신청하면 점이 문 앞에 멈추고
// 출시 프레임에 체크가 붙는다. 움직임 줄이기에서는 점이 문 앞에 멈춘 채로 그린다. 꾸밈이라 읽지 않는다.
import { MARK_FRAME, MARK_SHARD } from '../components/ArtelMark'

const screens = [
  { x: 24, y: 36, w: 72, h: 48 },
  { x: 196, y: 16, w: 72, h: 48 },
]
const launch = { x: 372, y: 28, w: 84, h: 72 }
// 점이 지나는 길. 가운데 프레임 안은 점만 지나가고 선은 프레임 밖에만 긋는다.
// 꺾이는 점은 `wishlist.css`의 `wl-travel` 키프레임과 같은 좌표다.
const route = 'M96 60H146V40H196M268 40H320V64H372'

export function WishlistMap({ joined }: { joined: boolean }) {
  return (
    <svg className={joined ? 'wl-map is-joined' : 'wl-map'} viewBox="0 0 480 120" aria-hidden="true" focusable="false">
      <path className="wl-map__route" d={route} />
      {screens.map((s) => (
        <g key={s.x} className="wl-map__screen">
          <rect x={s.x} y={s.y} width={s.w} height={s.h} />
          <line x1={s.x} y1={s.y + 11} x2={s.x + s.w} y2={s.y + 11} />
          <rect className="wl-map__line" x={s.x + 10} y={s.y + 21} width={s.w - 30} height={5} />
          <rect className="wl-map__line" x={s.x + 10} y={s.y + 31} width={s.w - 44} height={5} />
        </g>
      ))}
      <g className="wl-map__launch">
        <rect x={launch.x} y={launch.y} width={launch.w} height={launch.h} />
        {/* 심볼의 64 단위 좌표를 40으로 줄여 프레임 가운데에 둔다. */}
        <g transform={`translate(${launch.x + launch.w / 2 - 20} ${launch.y + launch.h / 2 - 20}) scale(0.625)`}>
          <polygon className="wl-map__mark" points={MARK_FRAME} />
          <polygon className="wl-map__shard" points={MARK_SHARD} />
        </g>
      </g>
      <g className="wl-map__agent">
        <circle className="wl-map__ring" r={11} />
        <circle className="wl-map__dot" r={5.5} />
      </g>
      {joined && (
        <g className="wl-map__check">
          <circle cx={launch.x + launch.w} cy={launch.y} r={12} />
          <path d={`M${launch.x + launch.w - 6} ${launch.y}l4 4l8-8`} />
        </g>
      )}
    </svg>
  )
}
