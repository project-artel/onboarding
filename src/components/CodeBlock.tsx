import { useState } from 'react'
import { useCopy } from '../i18n/useCopy'

export function CodeBlock({ code }: { code: string }) {
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
