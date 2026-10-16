import { CodeBlock } from '../components/CodeBlock'
import { RailSection } from '../components/RailSection'
import { useCopy } from '../i18n/useCopy'

export function SkillsPage() {
  const { t } = useCopy()

  return (
    <>
      <section className="hero">
        <span className="crop crop--tl" aria-hidden="true" />
        <span className="crop crop--tr" aria-hidden="true" />
        <div className="shell hero__inner hero__inner--page">
          <div className="hero__copy hero__copy--narrow">
            <p className="page-hero__kicker">INSTALL</p>
            <h1 className="hero__title page-hero__title">{t.skills.title}</h1>
            <p className="hero__lead">{t.skills.lead}</p>
          </div>
        </div>
      </section>

      <RailSection num="AGENT" title={t.skills.agent.title}>
        <p className="step__body">{t.skills.agent.body}</p>
        <CodeBlock code={t.skills.agent.prompt} />
        <a className="btn btn--ghost" href="/skills.md">
          {t.skills.agent.instructionsCta}
        </a>
      </RailSection>

      <RailSection num="INSTALL" title={t.skills.install.title}>
        <p className="step__body">{t.skills.install.body}</p>
        <CodeBlock code={t.skills.install.command} />
        <p className="step__body">{t.skills.install.optionsNote}</p>
      </RailSection>

      <RailSection num="SKILLS" title={t.skills.listTitle}>
        <ul className="marks marks--tight">
          {t.skills.items.map((item) => (
            <li key={item.name}>
              <span>
                <code>{item.name}</code> {item.body}
              </span>
            </li>
          ))}
        </ul>
        <a
          className="btn btn--ghost"
          href="https://github.com/project-artel/artel-skills"
          target="_blank"
          rel="noreferrer"
        >
          {t.skills.repositoryCta}
        </a>
      </RailSection>
    </>
  )
}
