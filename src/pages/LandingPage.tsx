import { Link } from 'react-router-dom'
import { RailSection } from '../components/RailSection'
import { useCopy } from '../i18n/useCopy'

export function LandingPage() {
  const { t, href } = useCopy()

  return (
    <>
      <section className="hero">
        <span className="crop crop--tl" aria-hidden="true" />
        <span className="crop crop--tr" aria-hidden="true" />
        <span className="crop crop--bl" aria-hidden="true" />
        <span className="crop crop--br" aria-hidden="true" />
        <div className="shell hero__inner">
          <div className="hero__copy">
            <h1 className="hero__title">{t.hero.title}</h1>
            <div className="hero__actions">
              <Link className="btn btn--primary" to={href('/self-hosting/desktop-app')}>
                {t.hero.appCta}
              </Link>
              <Link className="btn btn--ghost" to={href('/sdk')}>
                {t.hero.sdkCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RailSection num="§ 01" title={t.problem.title}>
        <ul className="marks">
          {t.problem.items.map((item) => (
            <li key={item}>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </RailSection>

      <RailSection
        alt
        num="§ 02"
        title={t.steps.title}
        aside={
          <Link className="section__link" to={href('/how-it-works')}>
            {t.nav.how} →
          </Link>
        }
      >
        <ol className="steps">
          {t.steps.items.map((step) => (
            <li key={step.index}>
              <span className="step__num">
                {step.index}
              </span>
              <div>
                <h3 className="step__title">{step.title}</h3>
                <p className="step__body">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </RailSection>

      {/* 카드 그리드는 폭이 필요해 레일 없이 전폭을 쓴다. */}
      <section className="section">
        <div className="shell section__full">
          <div className="section__head">
            <p className="section__num">§ 03</p>
            <h2 className="section__title">{t.features.title}</h2>
          </div>
          <ul className="cards">
            {t.features.items.map((feature) => (
              <li key={feature.title}>
                <h3 className="card__title">{feature.title}</h3>
                <p className="card__body">{feature.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <RailSection alt num="§ 04" title={t.faq.title}>
        <div className="faq">
          {t.faq.items.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </RailSection>
    </>
  )
}
