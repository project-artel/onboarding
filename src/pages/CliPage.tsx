import { CodeBlock } from '../components/CodeBlock'
import { RailSection } from '../components/RailSection'
import { useCopy } from '../i18n/useCopy'

export function CliPage() {
  const { t } = useCopy()

  return (
    <>
      <section className="hero">
        <span className="crop crop--tl" aria-hidden="true" />
        <span className="crop crop--tr" aria-hidden="true" />
        <div className="shell hero__inner hero__inner--page">
          <div className="hero__copy hero__copy--narrow">
            <p className="page-hero__kicker">INSTALL</p>
            <h1 className="hero__title page-hero__title">{t.cli.title}</h1>
            <p className="hero__lead">{t.cli.lead}</p>
          </div>
        </div>
      </section>

      <RailSection num="AGENT" title={t.cli.agent.title}>
        <p className="step__body">{t.cli.agent.body}</p>
        <CodeBlock code={t.cli.agent.prompt} />
        <a className="btn btn--ghost" href="/cli.md">
          {t.cli.agent.instructionsCta}
        </a>
      </RailSection>

      <RailSection num="SKILLS" title={t.cli.skills.title}>
        <p className="step__body">{t.cli.skills.body}</p>
        <CodeBlock code={t.cli.skills.command} />
        <h3 className="install__title install__title--after-block">{t.cli.skills.listTitle}</h3>
        <ul className="marks marks--tight">
          {t.cli.skills.items.map((item) => (
            <li key={item.name}>
              <span>
                <code>{item.name}</code> {item.body}
              </span>
            </li>
          ))}
        </ul>
        <p className="step__body">{t.cli.skills.optionsNote}</p>
        <a
          className="btn btn--ghost"
          href="https://github.com/project-artel/artel-skills"
          target="_blank"
          rel="noreferrer"
        >
          {t.cli.skills.repositoryCta}
        </a>
      </RailSection>

      <section className="section section--alt">
        <div className="shell section__full">
          <ol className="install">
            {t.cli.steps.map((step, index) => (
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

      <RailSection num="NOTES" title={t.cli.notesTitle}>
        <ul className="marks marks--tight">
          {t.cli.notes.map((item) => (
            <li key={item}>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <a
          className="btn btn--ghost"
          href="https://github.com/project-artel/artel-cli#readme"
          target="_blank"
          rel="noreferrer"
        >
          {t.cli.referenceCta}
        </a>
      </RailSection>
    </>
  )
}
