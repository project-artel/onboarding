import type { ReactNode } from 'react'

type RailSectionProps = {
  /** mono 섹션 넘버. `§ 01` 또는 `HELP` 같은 라벨. */
  num: string
  title: string
  /** `--paper-2` 교차 배경. */
  alt?: boolean
  /** 레일 타이틀 아래 링크. */
  aside?: ReactNode
  /** 섹션별 스타일 훅. 예: 에이전트 프롬프트 섹션의 `section--agent`. */
  className?: string
  children: ReactNode
}

// 좌측 220px 라벨 레일 + 40px 들여쓴 본문. 세 페이지에서 여덟 번 나온다.
export function RailSection({ num, title, alt, aside, className, children }: RailSectionProps) {
  const classes = ['section', alt && 'section--alt', className].filter(Boolean).join(' ')
  return (
    <section className={classes}>
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
