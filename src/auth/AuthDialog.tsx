import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useCopy } from '../i18n/useCopy'
import { authenticate, AuthError, githubLoginUrl, hasSession, type Providers } from './authApi'
import { authCopy } from './copy'

type Props = {
  initialMode: 'login' | 'signup'; providers: Providers | null; initialError: string; connectionError: boolean
  onClose: () => void; onAuthenticated: () => void
}

export function AuthDialog({ initialMode, providers, initialError, connectionError, onClose, onAuthenticated }: Props) {
  const { locale } = useCopy()
  const copy = authCopy[locale]
  const dialog = useRef<HTMLDialogElement>(null)
  const [mode, setMode] = useState(initialMode)
  const [error, setError] = useState(initialError)
  const [busy, setBusy] = useState(false)
  const [signupClosed, setSignupClosed] = useState(false)
  const signupOpen = providers?.signupOpen === true && !signupClosed
  const activeMode = signupOpen ? mode : 'login'
  const errorText = copy.errors[error as keyof typeof copy.errors] ?? copy.errors.unavailable

  useEffect(() => {
    const element = dialog.current!
    const previousFocus = document.activeElement
    element.showModal()
    return () => {
      element.close()
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const data = new FormData(event.currentTarget)
    const password = String(data.get('password') ?? '')
    if (activeMode === 'signup' && (password.length < 8 || new TextEncoder().encode(password).length > 72)) {
      setError('invalid_password')
      return
    }
    setBusy(true)
    setError('')
    try {
      await authenticate(activeMode, String(data.get('email')).trim(), password, String(data.get('name') ?? '').trim())
      if (!await hasSession()) throw new AuthError('unavailable')
      onAuthenticated()
    } catch (failure) {
      const code = failure instanceof AuthError ? failure.code : 'unavailable'
      setError(code)
      if (code === 'signup_closed') setSignupClosed(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <dialog ref={dialog} className="auth-dialog" aria-labelledby="auth-title" aria-describedby="auth-intro" onCancel={onClose}>
      <button type="button" className="auth-close" onClick={onClose} aria-label={copy.close}>×</button>
      <h2 id="auth-title">{copy[activeMode]}</h2>
      <p id="auth-intro">{copy.intro}</p>
      {signupOpen && <div className="auth-modes" role="group" aria-label={`${copy.login} / ${copy.signup}`}>
        {(['login', 'signup'] as const).map((next) => <button key={next} type="button" disabled={busy} aria-pressed={activeMode === next}
          onClick={() => { setMode(next); setError('') }}>{copy[next]}</button>)}
      </div>}
      {((providers && !providers.signupOpen) || signupClosed) && <p>{copy.closed}</p>}
      {(error || connectionError) && <p className="auth-error" role="alert">{error ? errorText : copy.errors.unavailable}</p>}
      {(providers?.password ?? true) && <form key={activeMode} onSubmit={submit} aria-busy={busy}>
        <fieldset disabled={busy}>
          {activeMode === 'signup' && <label>{copy.name}<input name="name" autoComplete="name" required maxLength={100} /></label>}
          <label>{copy.email}<input name="email" type="email" autoComplete="email" required /></label>
          <label>{copy.password}<input name="password" type="password" autoComplete={activeMode === 'signup' ? 'new-password' : 'current-password'} required
            minLength={activeMode === 'signup' ? 8 : undefined} aria-describedby={activeMode === 'signup' ? 'password-hint' : undefined} /></label>
          {activeMode === 'signup' && <small id="password-hint">{copy.passwordHint}</small>}
          <button className="btn btn--primary" type="submit">{busy ? copy.busy : copy[activeMode]}</button>
        </fieldset>
      </form>}
      {providers?.github && <a className="btn btn--ghost auth-github" href={githubLoginUrl()}>{copy.github}</a>}
      {providers && !providers.password && !providers.github && <p role="alert">{copy.errors.unavailable}</p>}
    </dialog>
  )
}
