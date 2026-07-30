import { useState } from 'react'
import { useCopy } from '../i18n/useCopy'

function CodeBlock({ code }: { code: string }) {
  const { t } = useCopy()
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(code)
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
      <section className="section">
        <div className="container prose">
          <h1>{t.sdk.title}</h1>
          <p className="lead">{t.sdk.lead}</p>
        </div>
      </section>

      <section className="section section--raised">
        <div className="container">
          {/* 첫 화면에는 붙여 넣을 주소 하나만 둔다. 발급 API와 코드 연결은
              대부분의 사람에게 필요 없는 단계라 아래에서 접어 둔다. */}
          <ol className="install">
            {t.sdk.steps.map((step, index) => (
              <li className="install__step" key={step.title}>
                <span className="install__index" aria-hidden="true">
                  {index + 1}
                </span>
                <div className="install__body">
                  <h2>{step.title}</h2>
                  <p>{step.body}</p>
                  {step.code ? <CodeBlock code={step.code} /> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <h2>{t.sdk.helpTitle}</h2>
          <ul className="check-list">
            {t.sdk.help.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a className="button" href="mailto:contact@artel.dev">
            {t.sdk.contactCta}
          </a>

          <details className="advanced">
            <summary>{t.sdk.advancedTitle}</summary>
            <p>{t.sdk.advancedNote}</p>
            {t.sdk.advanced.map((item) => (
              <div key={item.label}>
                <h3>{item.label}</h3>
                <CodeBlock code={item.code} />
              </div>
            ))}
          </details>
        </div>
      </section>
    </>
  )
}
