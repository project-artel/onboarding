import { Fragment, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useCopy } from '../i18n/useCopy'
import { contactEmail } from '../lib/contact'
import { wishlistCopy } from './copy'
import { WishlistMap } from './WishlistMap'
import { joinWishlist } from './wishlistApi'

type RequestState = 'idle' | 'busy' | 'joined' | 'rate_limited' | 'unavailable'

// 서버(`POST /wishlist`)와 같은 규칙. 도메인에 점이 있고 마지막 부분이 영문 2글자 이상이어야 한다.
const emailPattern = /^[^@\s]+@[^@\s.]+(\.[^@\s.]+)*\.[A-Za-z]{2,}$/
const navKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '])

/** 문구 안의 `{token}` 자리에 `node`를 끼운다. */
function fill(text: string, token: string, node: ReactNode) {
  return text.split(`{${token}}`).map((part, i) => (
    <Fragment key={i}>
      {i > 0 && node}
      {part}
    </Fragment>
  ))
}

const preventScroll = { preventScroll: true }

export function WishlistDialog({ onClose }: { onClose: () => void }) {
  const { locale, t } = useCopy()
  const copy = wishlistCopy[locale]
  const dialog = useRef<HTMLDialogElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)
  const doneRef = useRef<HTMLButtonElement>(null)
  const [request, setRequest] = useState<RequestState>('idle')
  const [emailError, setEmailError] = useState(false)
  const [consented, setConsented] = useState(false)
  const [consentError, setConsentError] = useState(false)
  const [joinedEmail, setJoinedEmail] = useState('')
  const titleId = useId()
  const introId = useId()
  const emailId = useId()
  const emailErrorId = useId()
  const consentErrorId = useId()
  const consentDetailsId = useId()

  useEffect(() => {
    const element = dialog.current!
    const sheet = sheetRef.current!
    const previousFocus = document.activeElement

    // 대화상자를 열고 닫을 때 브라우저가 포커스를 옮기며 뒤 페이지를 스크롤할 수 있다. 랜딩에서는 그
    // 스크롤이 카메라와 스냅 정지점을 함께 옮기므로, 열려 있는 동안 연 순간의 위치를 지킨다.
    // `html`의 overflow를 바꾸면 랜딩의 ScrollTrigger가 다시 계산되므로 쓰지 않는다.
    const x = window.scrollX
    const y = window.scrollY
    const hold = () => {
      if (window.scrollX !== x || window.scrollY !== y) window.scrollTo({ left: x, top: y, behavior: 'instant' })
    }

    element.showModal()
    emailRef.current?.focus(preventScroll)
    hold()
    window.addEventListener('scroll', hold)

    // 랜딩의 스냅은 window에서 휠과 이동 키를 듣는다. 대화상자 안의 입력이 뒤 페이지를 옮기지 않도록
    // 여기서 전파를 끊는다. 입력란 안의 커서 이동과 버튼·체크박스·접기의 Space는 그대로 둔다.
    const onKey = (event: KeyboardEvent) => {
      if (!navKeys.has(event.key)) return
      event.stopPropagation()
      const target = event.target as HTMLElement | null
      if (target?.closest('input')) return
      if (event.key === ' ' && target?.closest('button, a, summary')) return
      event.preventDefault()
    }
    const onWheel = (event: WheelEvent) => {
      event.stopPropagation()
      if (sheet.scrollHeight <= sheet.clientHeight) event.preventDefault()
    }
    element.addEventListener('keydown', onKey)
    element.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('scroll', hold)
      element.removeEventListener('keydown', onKey)
      element.removeEventListener('wheel', onWheel)
      element.close()
      if (previousFocus instanceof HTMLElement) previousFocus.focus(preventScroll)
      hold()
      // 닫은 뒤 브라우저가 다음 프레임에 포커스를 다시 맞추며 스크롤하는 경우도 되돌린다.
      window.requestAnimationFrame(hold)
    }
  }, [])

  // 신청하면 폼이 사라지므로 포커스를 닫기 버튼으로 옮긴다. 버튼은 다시 그린 뒤에 생긴다.
  useEffect(() => {
    if (request === 'joined') doneRef.current?.focus(preventScroll)
  }, [request])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (request === 'busy') return
    const email = (emailRef.current?.value ?? '').trim()
    const emailValid = emailPattern.test(email)
    setEmailError(!emailValid)
    setConsentError(!consented)
    if (!emailValid || !consented) {
      setRequest('idle')
      const firstInvalid = emailValid ? consentRef : emailRef
      firstInvalid.current?.focus(preventScroll)
      return
    }
    setRequest('busy')
    // 사람에게는 보이지 않는 칸이다. 채워져 있으면 서버가 저장하지 않고 성공처럼만 답한다.
    const website = String(new FormData(event.currentTarget).get('website') ?? '')
    const outcome = await joinWishlist({ email, locale, consent: true, website })
    if (outcome === 'joined') {
      setJoinedEmail(email)
      setRequest('joined')
    } else if (outcome === 'invalid_email') {
      setEmailError(true)
      setRequest('idle')
      emailRef.current?.focus(preventScroll)
    } else if (outcome === 'consent_required') {
      setConsented(false)
      setConsentError(true)
      setRequest('idle')
      consentRef.current?.focus(preventScroll)
    } else {
      setRequest(outcome)
    }
  }

  const busy = request === 'busy'
  const joined = request === 'joined'
  const fieldMessage = emailError ? copy.invalid_email : request === 'rate_limited' || request === 'unavailable' ? copy[request] : ''
  const address = <strong className="wishlist-address">{joinedEmail}</strong>

  return (
    <dialog ref={dialog} className="wishlist-dialog" aria-labelledby={titleId} aria-describedby={introId} onCancel={onClose}>
      <div ref={sheetRef} className="wishlist-sheet">
        <span aria-hidden="true" className="wl-crop wl-crop--tl" />
        <span aria-hidden="true" className="wl-crop wl-crop--tr" />
        <span aria-hidden="true" className="wl-crop wl-crop--bl" />
        <span aria-hidden="true" className="wl-crop wl-crop--br" />
        <div className="wishlist-art">
          <WishlistMap joined={joined} />
        </div>
        <div className="wishlist-body">
          <button type="button" className="wishlist-close" onClick={onClose} aria-label={t.dialog.close} />
          <h2 id={titleId}>{joined ? copy.joinedTitle : copy.title}</h2>
          {joined ? (
            <>
              <p className="wishlist-intro" id={introId}>{fill(copy.joinedBody, 'email', address)}</p>
              <button ref={doneRef} type="button" className="wishlist-submit wishlist-done" onClick={onClose}>
                {t.dialog.close}
              </button>
            </>
          ) : (
            <>
              <p className="wishlist-intro" id={introId}>
                {copy.intro}
              </p>
              <form onSubmit={submit} noValidate aria-busy={busy}>
                {/* 봇을 거르는 함정 칸. 화면과 보조기기에서 모두 숨기고, 탭 이동과 자동 완성에서도 뺀다. */}
                <input className="wishlist-trap" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" defaultValue="" />
                <label className="wishlist-label" htmlFor={emailId}>
                  {copy.email}
                </label>
                <div className="wishlist-row">
                  <input
                    ref={emailRef}
                    id={emailId}
                    className="wishlist-input"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={copy.placeholder}
                    required
                    maxLength={254}
                    readOnly={busy}
                    aria-invalid={emailError || undefined}
                    aria-describedby={fieldMessage ? emailErrorId : undefined}
                  />
                  {/* 동의 전에도 버튼에 포커스가 가고 눌리도록 `disabled` 대신 `aria-disabled`를 쓴다.
                      누르면 무엇이 빠졌는지 알려 준다. */}
                  <button className="wishlist-submit" type="submit" aria-disabled={!consented || busy || undefined}>
                    {busy ? copy.busy : copy.submit}
                  </button>
                </div>
                {fieldMessage && (
                  <p className="wishlist-error" id={emailErrorId} role="alert">
                    {fieldMessage}
                  </p>
                )}
                <div className="wishlist-consent">
                  <label className="wishlist-check">
                    <input
                      ref={consentRef}
                      type="checkbox"
                      name="consent"
                      required
                      checked={consented}
                      onChange={(event) => {
                        setConsented(event.currentTarget.checked)
                        if (event.currentTarget.checked) setConsentError(false)
                      }}
                      aria-invalid={consentError || undefined}
                      aria-describedby={consentError ? `${consentErrorId} ${consentDetailsId}` : consentDetailsId}
                    />
                    <span>{copy.consent}</span>
                  </label>
                  <details className="wishlist-details">
                    <summary>{copy.consentMore}</summary>
                    <p id={consentDetailsId}>{copy.consentDetails}</p>
                  </details>
                  {consentError && (
                    <p className="wishlist-error" id={consentErrorId} role="alert">
                      {copy.consent_required}
                    </p>
                  )}
                </div>
              </form>
              <p className="wishlist-note">{fill(copy.note, 'contact', <span className="wishlist-address">{contactEmail}</span>)}</p>
            </>
          )}
          <p className="visually-hidden" role="status">
            {joined ? `${copy.joinedTitle}. ${copy.joinedBody.replace('{email}', joinedEmail)}` : ''}
          </p>
        </div>
      </div>
    </dialog>
  )
}
