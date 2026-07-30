import { StateBadge } from '../components/StateBadge'
import { useCopy } from '../i18n/useCopy'

export function HowItWorksPage() {
  const { t } = useCopy()

  return (
    <>
      <section className="section">
        <div className="container prose">
          <h1>{t.how.title}</h1>
          <p className="lead">{t.how.lead}</p>
        </div>
      </section>

      <section className="section section--raised">
        <div className="container">
          <h2>{t.how.componentsTitle}</h2>
          <ul className="card-grid">
            {t.how.components.map((component) => (
              <li className="card" key={component.name}>
                <h3>{component.name}</h3>
                <p>{component.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{t.how.flowTitle}</h2>
          {/* 다이어그램을 이미지로 만들면 문구를 로케일마다 다시 그려야 하고
              대체 텍스트도 따로 관리해야 한다. 실제 텍스트로 그린다. */}
          <figure className="flow" aria-label={t.how.flowAlt}>
            <ol>
              {t.how.flow.map((line, index) => (
                <li key={line}>
                  <span className="flow__index" aria-hidden="true">
                    {index + 1}
                  </span>
                  {line}
                </li>
              ))}
            </ol>
          </figure>
        </div>
      </section>

      <section className="section section--raised">
        <div className="container">
          <h2>{t.how.lifecycleTitle}</h2>
          <ol className="timeline">
            {t.how.lifecycle.map((phase) => (
              <li key={phase.title}>
                <h3>
                  {phase.title} <StateBadge state={phase.state} />
                </h3>
                <p>{phase.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <h2>{t.how.contextTitle}</h2>
          <p>{t.how.contextBody}</p>
        </div>
      </section>
    </>
  )
}
