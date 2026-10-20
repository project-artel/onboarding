import { RailSection } from '../components/RailSection'
import { useCopy } from '../i18n/useCopy'

export function HowItWorksPage() {
  const { t } = useCopy()

  return (
    <>
      <section className="hero">
        <span className="crop crop--tl" aria-hidden="true" />
        <span className="crop crop--tr" aria-hidden="true" />
        <div className="shell hero__inner hero__inner--page">
          <div className="hero__copy hero__copy--narrow">
            <p className="page-hero__kicker">SYSTEM</p>
            <h1 className="hero__title page-hero__title">{t.how.title}</h1>
          </div>
        </div>
      </section>

      <RailSection num="§ 01" title={t.how.flowTitle}>
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

      <RailSection alt num="§ 02" title={t.how.lifecycleTitle}>
        <ol className="steps steps--sm">
          {t.how.lifecycle.map((phase, index) => (
            <li key={phase.title}>
              <span className="step__num">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="step__title">{phase.title}</h3>
                <p className="step__body">{phase.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </RailSection>
    </>
  )
}
