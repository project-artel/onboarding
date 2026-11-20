import { CodeBlock } from '../components/CodeBlock'
import { RailSection } from '../components/RailSection'
import { useCopy } from '../i18n/useCopy'
import { AnnotatedScreenshot } from '../components/AnnotatedScreenshot'
import { sdkScreenshots } from '../docs/gettingStartedScreenshots'

export function SdkPage() {
  const { t } = useCopy()

  return (
    <>
      <section className="hero">
        <span className="crop crop--tl" aria-hidden="true" />
        <span className="crop crop--tr" aria-hidden="true" />
        <div className="shell hero__inner hero__inner--page">
          <div className="hero__copy hero__copy--narrow">
            <p className="page-hero__kicker">INSTALL</p>
            <h1 className="hero__title page-hero__title">{t.sdk.title}</h1>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="shell section__full">
          {/* 설치부터 로그인, 프로젝트 선택까지 네 단계를 스크린샷과 함께 보여 준다.
              직접 운영하는 서버에 연결하는 방법은 대부분의 사람에게 필요 없어 아래에서 접어 둔다. */}
          <ol className="install">
            {t.sdk.steps.map((step, index) => (
              <li key={step.title}>
                <div className="install__num" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="install__body">
                  <h2 className="install__title">{step.title}</h2>
                  <p className="step__body">{step.body}</p>
                  {step.code ? <CodeBlock code={step.code} /> : null}
                  {(sdkScreenshots[index] ?? []).map(shot => <AnnotatedScreenshot key={shot.src} shot={shot} />)}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <RailSection num="SUPPORT" title={t.sdk.supportTitle}>
        <div className="support">
          <table className="support__table">
            <thead>
              <tr>
                {t.sdk.supportColumns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.sdk.supportRows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>{row.supported}</td>
                  <td>{row.needsSetup}</td>
                  <td>{row.unsupported}</td>
                  <td>{row.unknown}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RailSection>

      <RailSection alt num="CI" title={t.sdk.buildTitle}>
        <ul className="marks marks--tight">
          {t.sdk.buildNotes.map((item) => (
            <li key={item}>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <h3 className="advanced__label">{t.sdk.buildScriptLabel}</h3>
        <CodeBlock code={t.sdk.buildScript} />
        <h3 className="advanced__label">{t.sdk.buildCommandLabel}</h3>
        <CodeBlock code={t.sdk.buildCommand} />
      </RailSection>

      <RailSection num="HELP" title={t.sdk.helpTitle}>
        <ul className="marks marks--tight">
          {t.sdk.help.map((item) => (
            <li key={item}>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <details className="advanced">
          <summary>{t.sdk.advancedTitle}</summary>
          <p className="advanced__note">{t.sdk.advancedNote}</p>
          {t.sdk.advanced.map((item) => (
            <div className="advanced__item" key={item.label}>
              <h3 className="advanced__label">{item.label}</h3>
              <CodeBlock code={item.code} />
            </div>
          ))}
        </details>
      </RailSection>
    </>
  )
}
