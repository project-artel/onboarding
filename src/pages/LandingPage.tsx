import { Link } from 'react-router-dom'
import { RailSection } from '../components/RailSection'
import { StateBadge } from '../components/StateBadge'
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
            <p className="hero__eyebrow">{t.hero.status}</p>
            <h1 className="hero__title">{t.hero.title}</h1>
            <p className="hero__lead">{t.hero.subtitle}</p>
            <div className="hero__actions">
              <Link className="btn btn--primary" to={href('/sdk')}>
                {t.hero.primaryCta}
              </Link>
              <Link className="btn btn--ghost" to={href('/sdk')}>
                {t.hero.secondaryCta}
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
              <span
                className={
                  step.state === 'shipped' ? 'step__num' : 'step__num step__num--planned'
                }
              >
                {step.index}
              </span>
              <div>
                <div className="step__head">
                  <h3 className="step__title">{step.title}</h3>
                  <StateBadge state={step.state} />
                </div>
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
                <StateBadge state={feature.state} />
                <h3 className="card__title">{feature.title}</h3>
                <p className="card__body">{feature.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <RailSection alt num="§ 04" title={t.requirements.title}>
        <ul className="marks marks--muted">
          {t.requirements.items.map((item) => (
            <li key={item}>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </RailSection>

      {/* 히어로와 같은 점 그리드. 크롭마크는 히어로 전용이라 여기엔 없다. */}
      <section className="section hero">
        <div className="shell hero__inner">
          <div className="hero__copy hero__copy--narrow">
            <h2 className="cta__title">{t.cta.title}</h2>
            <p className="cta__body">{t.cta.body}</p>
            <div className="hero__actions hero__actions--cta">
              <Link className="btn btn--primary" to={href('/sdk')}>
                {t.hero.primaryCta}
              </Link>
              <a className="btn btn--ghost" href="mailto:contact@artel.dev">
                {t.footer.contact}
              </a>
            </div>
          </div>
        </div>
      </section>

      <RailSection num="§ 05" title={t.faq.title}>
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
