type BrandMarkProps = {
  className?: string
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 64 64"
    >
      <path
        d="M 52 40 L 52 18 L 32 6 L 12 18 L 12 46 L 30 56"
        stroke="var(--color-brand-mark)"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth="9"
      />
      <path
        d="M 36 56 L 52 46"
        stroke="var(--color-brand-accent)"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeWidth="9"
      />
    </svg>
  )
}
