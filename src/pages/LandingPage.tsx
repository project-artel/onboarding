import { Link } from 'react-router-dom'
import { StateBadge } from '../components/StateBadge'
import { useCopy } from '../i18n/useCopy'

export function LandingPage() {
  const { t, href } = useCopy()

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <p className="hero__status">
            <span className="badge__dot badge__dot--live" aria-hidden="true" />
            {t.hero.status}
          </p>
          <h1 className="display">{t.hero.title}</h1>
          <p className="lead">{t.hero.subtitle}</p>
          <div className="cta-row">
            <Link className="button button--primary" to={href('/sdk')}>
              {t.hero.primaryCta}
            </Link>
            <Link className="button" to={href('/sdk')}>
              {t.hero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{t.problem.title}</h2>
          <ul className="problem-list">
            {t.problem.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--raised">
        <div className="container">
          <h2>{t.steps.title}</h2>
          <ol className="steps">
            {t.steps.items.map((step) => (
              <li className="step" key={step.index}>
                <span className="step__index">{step.index}</span>
                <div>
                  <h3>
                    {step.title} <StateBadge state={step.state} />
                  </h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link className="text-link" to={href('/how-it-works')}>
            {t.nav.how} →
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{t.features.title}</h2>
          <ul className="card-grid">
            {t.features.items.map((feature) => (
              <li className="card" key={feature.title}>
                <h3>{feature.title}</h3>
                <StateBadge state={feature.state} />
                <p>{feature.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--raised">
        <div className="container">
          <h2>{t.requirements.title}</h2>
          <ul className="check-list">
            {t.requirements.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container">
          <h2>{t.cta.title}</h2>
          <p className="lead">{t.cta.body}</p>
          <div className="cta-row">
            <Link className="button button--primary" to={href('/sdk')}>
              {t.hero.primaryCta}
            </Link>
            <a className="button" href="mailto:contact@artel.dev">
              {t.footer.contact}
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{t.faq.title}</h2>
          <div className="faq">
            {t.faq.items.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
