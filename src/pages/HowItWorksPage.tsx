import { Link } from 'react-router-dom'
import { RailSection } from '../components/RailSection'
import { StateBadge } from '../components/StateBadge'
import { useCopy } from '../i18n/useCopy'

export function HowItWorksPage() {
  const { t, href } = useCopy()

  return (
    <>
      <section className="hero">
        <span className="crop crop--tl" aria-hidden="true" />
        <span className="crop crop--tr" aria-hidden="true" />
        <div className="shell hero__inner hero__inner--page">
          <div className="hero__copy hero__copy--narrow">
            <p className="page-hero__kicker">ARCHITECTURE</p>
            <h1 className="hero__title page-hero__title">{t.how.title}</h1>
            <p className="hero__lead">{t.how.lead}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell section__full">
          <div className="section__head">
            <p className="section__num">§ 01</p>
            <h2 className="section__title">{t.how.componentsTitle}</h2>
          </div>
          <ul className="cards">
            {t.how.components.map((component, index) => (
              <li key={component.name}>
                <span className="card__num" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="card__title">{component.name}</h3>
                <p className="card__body">{component.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <RailSection alt num="§ 02" title={t.how.flowTitle}>
        {/* 다이어그램을 이미지로 만들면 문구를 로케일마다 다시 그려야 하고
            대체 텍스트도 따로 관리해야 한다. 실제 텍스트로 그린다. */}
        <ol className="flow" aria-label={t.how.flowAlt}>
          {t.how.flow.map((line) => (
            <li key={line}>
              <span className="flow__marker" aria-hidden="true">
                <span className="flow__dot" />
              </span>
              <span className="flow__text">{line}</span>
            </li>
          ))}
        </ol>
      </RailSection>

      <RailSection num="§ 03" title={t.how.lifecycleTitle}>
        <ol className="steps steps--sm">
          {t.how.lifecycle.map((phase, index) => (
            <li key={phase.title}>
              <span
                className={
                  phase.state === 'shipped' ? 'step__num' : 'step__num step__num--planned'
                }
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <div className="step__head">
                  <h3 className="step__title">{phase.title}</h3>
                  <StateBadge state={phase.state} />
                </div>
                <p className="step__body">{phase.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </RailSection>

      <RailSection num="§ 04" title={t.how.contextTitle}>
        <p className="how-context">{t.how.contextBody}</p>
        <Link className="btn btn--ghost how-context__cta" to={href('/sdk')}>
          {t.hero.secondaryCta}
        </Link>
      </RailSection>
    </>
  )
}
