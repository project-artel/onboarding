import type { ReactNode } from 'react'

type RailSectionProps = {
  /** mono 섹션 넘버. `§ 01` 또는 `HELP` 같은 라벨. */
  num: string
  title: string
  /** `--paper-2` 교차 배경. */
  alt?: boolean
  /** 레일 타이틀 아래 링크. */
  aside?: ReactNode
  children: ReactNode
}

// 좌측 220px 라벨 레일 + 40px 들여쓴 본문. 세 페이지에서 여덟 번 나온다.
export function RailSection({ num, title, alt, aside, children }: RailSectionProps) {
  return (
    <section className={alt ? 'section section--alt' : 'section'}>
      <div className="shell section__split">
        <div className="section__label">
          <p className="section__num">{num}</p>
          <h2 className="section__title">{title}</h2>
          {aside}
        </div>
        <div className="section__body">{children}</div>
      </div>
    </section>
  )
}
