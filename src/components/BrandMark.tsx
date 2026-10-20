type BrandMarkProps = {
  size?: number;
  className?: string;
};

// 육각 프레임은 currentColor를, 우하단 조각은 --flare를 따른다. 라이트·다크에
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
      <polygon
        fill="currentColor"
        points="57.28,45.10 57.28,17.40 32.00,2.80 6.72,17.40 6.72,46.60 30.70,60.45 30.70,50.05 15.72,41.40 15.72,22.60 32.00,13.20 48.28,22.60 48.28,39.90"
      />
      <polygon
        fill="var(--flare)"
        points="33.30,50.05 33.30,60.45 55.99,47.35 46.99,42.15"
      />
    </svg>
  );
}
