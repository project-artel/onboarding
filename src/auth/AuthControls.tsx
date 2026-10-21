import { useEffect, useRef, useState } from 'react'
import { useCopy } from '../i18n/useCopy'
import { AuthDialog } from './AuthDialog'
import { consoleUrl, getProviders, hasSession, type Providers } from './authApi'
import { authCopy } from './copy'

export function AuthControls() {
  const { locale } = useCopy()
  const copy = authCopy[locale]
  const [status, setStatus] = useState<'loading' | 'anonymous' | 'authenticated' | 'error'>('loading')
  const [providers, setProviders] = useState<Providers | null>(null)
  const [mode, setMode] = useState<'login' | 'signup' | null>(null)
  const [attempt, setAttempt] = useState(0)
  const sessionRevision = useRef(0)
  const [oauthError, setOauthError] = useState(() => new URL(window.location.href).searchParams.get('auth_error') ?? '')

  useEffect(() => {
    let disposed = false
    let requestId = 0
    async function check() {
      const id = ++requestId
      const revision = sessionRevision.current
      try {
        const [authenticated, options] = await Promise.all([hasSession(), getProviders().catch(() => null)])
        if (disposed || id !== requestId || revision !== sessionRevision.current) return
        if (!authenticated && !options) throw new Error('Providers unavailable')
        setStatus(authenticated ? 'authenticated' : 'anonymous')
        setProviders(options)
      } catch {
        if (!disposed && id === requestId && revision === sessionRevision.current) setStatus('error')
      }
    }
    void check()
    const onVisible = () => { if (document.visibilityState === 'visible') void check() }
    window.addEventListener('focus', onVisible)
    document.addEventListener('visibilitychange', onVisible)
    const interval = window.setInterval(onVisible, 60_000)
    return () => {
      disposed = true
      window.clearInterval(interval)
      window.removeEventListener('focus', onVisible)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [attempt])

  function close() {
    setMode(null)
    setOauthError('')
    const url = new URL(window.location.href)
    url.searchParams.delete('auth_error')
    window.history.replaceState(window.history.state, '', url)
  }

  function openLogin() {
    setMode('login')
    if (status === 'error') setAttempt((value) => value + 1)
  }

  return <div className="auth-controls">
    {status === 'loading' && <span role="status">{copy.checking}</span>}
    {status === 'authenticated' && <a className="btn btn--sm btn--primary" href={consoleUrl}>{copy.console}</a>}
    {(status === 'anonymous' || status === 'error') && <>
      <button type="button" className="btn btn--sm btn--ghost" onClick={openLogin}>{copy.login}</button>
      {providers?.signupOpen && <button type="button" className="btn btn--sm btn--primary" onClick={() => setMode('signup')}>{copy.signup}</button>}
    </>}
    {status !== 'authenticated' && (mode || oauthError) && <AuthDialog initialMode={mode ?? 'login'} providers={providers} initialError={oauthError} connectionError={status === 'error'}
      onClose={close} onAuthenticated={() => { sessionRevision.current += 1; setStatus('authenticated'); close() }} />}
  </div>
}
