import { useEffect, useId, useRef, useState } from 'react'
import type { Locale } from '../i18n/locale'
import { useCopy } from '../i18n/useCopy'
import '../styles/annotated-screenshot.css'

export type ScreenshotAnnotation = { box: [number, number, number, number]; text: Record<Locale, string> }
export type GuideScreenshot = { src: string; width: number; height: number; title: Record<Locale, string>; annotations: ScreenshotAnnotation[]; displayWidth?: number }

function ScreenshotBoard({ shot }: { shot: GuideScreenshot }) {
  const { locale } = useCopy()
  return <div className="annotated-shot__board">
    <img src={shot.src} alt={shot.title[locale]} width={shot.width} height={shot.height} loading="lazy" />
    <div className="annotated-shot__marks" aria-hidden="true">
      {shot.annotations.map(({ box }, index) => <span key={index} className="annotated-shot__box" style={{ left: `${box[0]}%`, top: `${box[1]}%`, width: `${box[2]}%`, height: `${box[3]}%` }}><b>{index + 1}</b></span>)}
    </div>
  </div>
}

function ScreenshotDialog({ shot, onClose }: { shot: GuideScreenshot; onClose: () => void }) {
  const { locale } = useCopy()
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => {
    const dialog = ref.current
    const previous = document.activeElement
    dialog?.showModal()
    return () => { dialog?.close(); if (previous instanceof HTMLElement) previous.focus({ preventScroll: true }) }
  }, [])
  return <dialog ref={ref} className="annotated-shot__dialog" aria-labelledby={titleId} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <header><h2 id={titleId}>{shot.title[locale]}</h2><button type="button" onClick={onClose}>{locale === 'ko' ? '닫기' : 'Close'}</button></header>
    <div className="annotated-shot__zoom" tabIndex={0} role="region" aria-label={shot.title[locale]}>
      <div style={{ width: Math.min(shot.width, 1600) }}><ScreenshotBoard shot={shot} /></div>
    </div>
  </dialog>
}

export function AnnotatedScreenshot({ shot }: { shot: GuideScreenshot }) {
  const { locale } = useCopy()
  const [open, setOpen] = useState(false)
  return <figure className="annotated-shot" style={{ maxWidth: shot.displayWidth }}>
    <ScreenshotBoard shot={shot} />
    <figcaption>
      <div className="annotated-shot__caption"><strong>{shot.title[locale]}</strong><button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)}>{locale === 'ko' ? '크게 보기' : 'Enlarge'}</button></div>
      <ol>{shot.annotations.map((annotation, index) => <li key={index}>{annotation.text[locale]}</li>)}</ol>
    </figcaption>
    {open && <ScreenshotDialog shot={shot} onClose={() => setOpen(false)} />}
  </figure>
}
