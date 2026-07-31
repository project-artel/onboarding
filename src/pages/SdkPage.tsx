import { useState } from 'react'
import { RailSection } from '../components/RailSection'
import { useCopy } from '../i18n/useCopy'

function CodeBlock({ code }: { code: string }) {
  const { t } = useCopy()
  const [copied, setCopied] = useState(false)

  async function copy() {
    // 클립보드가 막힌 환경에서도 페이지가 죽지는 않게 한다.
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      return
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="code">
      <pre>
        <code>{code}</code>
      </pre>
      <button className="code__copy" onClick={copy} type="button">
        {copied ? t.sdk.copied : t.sdk.copy}
      </button>
    </div>
  )
}

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
            <p className="hero__lead">{t.sdk.lead}</p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="shell section__full">
          {/* 첫 화면에는 붙여 넣을 주소 하나만 둔다. 발급 API와 코드 연결은
              대부분의 사람에게 필요 없는 단계라 아래에서 접어 둔다. */}
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
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <RailSection num="HELP" title={t.sdk.helpTitle}>
        <ul className="marks marks--tight">
          {t.sdk.help.map((item) => (
            <li key={item}>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <a className="btn btn--ghost" href="mailto:contact@artel.dev">
          {t.sdk.contactCta}
        </a>

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
