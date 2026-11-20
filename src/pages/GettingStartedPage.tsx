import { Link, useLocation } from 'react-router-dom'
import { CodeBlock } from '../components/CodeBlock'
import { consoleUrl } from '../auth/authApi'
import { AnnotatedScreenshot, type GuideScreenshot } from '../components/AnnotatedScreenshot'
import { walkthroughScreenshots as shots } from '../docs/gettingStartedScreenshots'
import { gettingStartedCopy, type GettingStartedTrack } from '../i18n/gettingStarted'
import { useCopy } from '../i18n/useCopy'
import '../styles/getting-started.css'

export function GettingStartedPage() {
  const { locale, href } = useCopy()
  const { search } = useLocation()
  const requested = new URLSearchParams(search).get('track')
  const selected: GettingStartedTrack = requested === 'agent' ? 'agent' : 'manual'
  const copy = gettingStartedCopy[locale]
  const track = copy.tracks[selected]
  const tracks: GettingStartedTrack[] = ['manual', 'agent']
  const screenshots: Record<string, GuideScreenshot[]> = {
    'test-cases': selected === 'manual' ? [shots.caseEditor] : [shots.approval],
    scenarios: [shots.runCreate, shots.scenarioType, shots.scenarioCases],
    run: [shots.qa],
    review: [shots.review],
    issues: [shots.issues],
  }

  return (
    <section className="section getting-started">
      <div className="shell">
        <h1 className="hero__title page-hero__title">{copy.title}</h1>
        <nav className="getting-started__tracks" aria-label={copy.trackLabel}>
          {tracks.map(id => (
            <Link key={id} to={`?track=${id}`} aria-current={selected === id ? 'page' : undefined}>
              <span className="getting-started__track-title">{copy.tracks[id].title}</span>
              <span>{copy.tracks[id].description}</span>
            </Link>
          ))}
        </nav>
        <div className="getting-started__layout" key={selected}>
          <nav className="getting-started__steps" aria-label={copy.stepsLabel}>
            <ol>
              {track.steps.map((step, index) => (
                <li key={step.id}>
                  <a href={`#${step.id}`}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{step.title}</a>
                </li>
              ))}
            </ol>
          </nav>
          <ol className="getting-started__instructions">
            {track.steps.map((step, index) => (
              <li key={step.id} id={step.id}>
                <p className="getting-started__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</p>
                <h2>{step.title}</h2>
                <ol className="getting-started__entry">{step.items.map(item => <li key={item}>{item}</li>)}</ol>
                {step.prompt && <CodeBlock code={step.prompt} wrap />}
                {step.links && <div className="getting-started__links">
                  {step.links.map(link => link.to === 'console'
                    ? <a className="btn btn--ghost btn--sm" key={link.to} href={consoleUrl} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>
                    : link.to.startsWith('/')
                    ? <Link className="btn btn--ghost btn--sm" key={link.to} to={href(link.to)}>{link.label} →</Link>
                    : <a className="btn btn--ghost btn--sm" key={link.to} href={link.to} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}
                </div>}
                {screenshots[step.id]?.map(shot => <AnnotatedScreenshot key={shot.src} shot={shot} />)}
                {step.after && <p className="getting-started__after">{step.after}</p>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
