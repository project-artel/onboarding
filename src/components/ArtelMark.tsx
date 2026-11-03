// ARTEL 심볼 좌표. `src/assets/brand/logo-light.png` 윤곽을 따서 64×64 viewBox로 옮겼다.
// 헤더·푸터는 PNG를 그대로 쓰고, 이 좌표는 애니메이션과 3D 압출처럼 벡터가 필요한 곳에 쓴다.
export const MARK_FRAME =
  '32.08,0.69 58.06,16.19 58.06,33.70 47.27,40.02 47.27,22.90 32.08,13.80 16.66,22.98 16.66,41.64 31.92,50.74 31.92,63.23 5.94,47.73 5.94,16.19'
export const MARK_SHARD = '36.09,50.97 57.99,38.01 57.99,48.73 36.09,62.07'

type MarkProps = { size?: number; className?: string }

/** 프레임은 currentColor, 조각은 --flare. 라이트·다크에 따라 저절로 반전된다. */
export function ArtelMark({ size = 24, className }: MarkProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" height={size} viewBox="0 0 64 64" width={size}>
      <polygon fill="currentColor" points={MARK_FRAME} />
      <polygon fill="var(--flare)" points={MARK_SHARD} />
    </svg>
  )
}
