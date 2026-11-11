import { CodeBlock } from '../components/CodeBlock'
import { RailSection } from '../components/RailSection'
import { useCopy } from '../i18n/useCopy'

const agents = [
  { id: 'codex', name: 'Codex' },
  { id: 'claude-code', name: 'Claude Code' },
  { id: 'cursor', name: 'Cursor' },
] as const

const pluginRepository = 'https://github.com/project-artel/artel-plugins'

export function SkillsPage() {
  const { t } = useCopy()
  const copy = t.skills

  return (
    <>
      <section className="hero">
        <span className="crop crop--tl" aria-hidden="true" />
        <span className="crop crop--tr" aria-hidden="true" />
        <div className="shell hero__inner hero__inner--page">
          <div className="hero__copy hero__copy--narrow">
            <h1 className="hero__title page-hero__title">{copy.title}</h1>
            <p className="hero__lead">{copy.lead}</p>
            <nav aria-label={copy.agentNav} className="hero__actions">
              {agents.map(({ id, name }) => (
                <a className="btn btn--ghost" href={`#${id}`} key={id}>{name}</a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <RailSection className="plugin-guide-section" id="codex" title="Codex">
        <CodeBlock code="codex plugin marketplace add project-artel/artel-plugins" />
        <p className="step__body">{copy.codex}</p>
      </RailSection>

      <RailSection className="plugin-guide-section" id="claude-code" title="Claude Code">
        <CodeBlock code={'claude plugin marketplace add project-artel/artel-plugins\nclaude plugin install artel@artel-plugins'} />
        <p className="step__body">{copy.claudeCode}</p>
      </RailSection>

      <RailSection className="plugin-guide-section" id="cursor" title="Cursor">
        <a className="btn btn--ghost" href={`${pluginRepository}/archive/refs/heads/main.zip`}>
          {copy.download}
        </a>
        <p className="step__body">{copy.cursorCopy}</p>
        <p className="step__body">{copy.cursorConnect}</p>
      </RailSection>

      <RailSection className="plugin-guide-section" title={copy.signInTitle}>
        <p className="step__body">{copy.signIn}</p>
        <p className="step__body">{copy.verify}</p>
      </RailSection>
    </>
  )
}
