type BrandMarkProps = {
  size?: number
  className?: string
}

// 육각 프레임은 currentColor를, 우하단 슬래시는 --flare를 따른다. 라이트·다크에
// 따라 파일을 갈아 끼울 필요가 없다.
export function BrandMark({ size = 24, className }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 64 64"
      width={size}
    >
      <path
        d="M 52 40 L 52 18 L 32 6 L 12 18 L 12 46 L 30 56"
        stroke="currentColor"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth="9"
      />
      <path
        d="M 36 56 L 52 46"
        stroke="var(--flare)"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth="9"
      />
    </svg>
  )
}
