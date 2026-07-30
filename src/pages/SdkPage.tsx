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
    <section className="section">
      <div className="container prose">
        <h1>{t.sdk.title}</h1>
        <p className="lead">{t.sdk.lead}</p>
        <p className="notice">{t.sdk.placeholderNote}</p>

        <ol className="guide">
          {t.sdk.steps.map((step) => (
            <li key={step.title}>
              <h2>{step.title}</h2>
              <p>{step.body}</p>
              {step.code ? <CodeBlock code={step.code} /> : null}
            </li>
          ))}
        </ol>

        <h2>{t.sdk.troubleshootTitle}</h2>
        <ul className="check-list">
          {t.sdk.troubleshoot.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
