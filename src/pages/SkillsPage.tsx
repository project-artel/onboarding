import { Link, useLocation } from 'react-router-dom'
import { CodeBlock } from '../components/CodeBlock'
import { RailSection } from '../components/RailSection'
import { useCopy } from '../i18n/useCopy'

const pluginRepository = 'https://github.com/project-artel/artel-plugins'
const pluginZip = `${pluginRepository}/archive/refs/heads/main.zip`

export function SkillsPage() {
  const { t } = useCopy()
  const copy = t.skills
  const { search, hash } = useLocation()
  const agents = [
    { id: 'codex', name: 'Codex' },
    { id: 'claude-code', name: 'Claude Code' },
    { id: 'cursor', name: 'Cursor' },
    { id: 'vscode', name: 'VS Code' },
    { id: 'other', name: copy.otherAgent },
  ] as const
  const requestedAgent = new URLSearchParams(search).get('agent') ?? hash.slice(1)
  const selected = agents.find(({ id }) => id === requestedAgent) ?? agents[0]

  return (
    <>
      <section className="hero">
        <span className="crop crop--tl" aria-hidden="true" />
        <span className="crop crop--tr" aria-hidden="true" />
        <div className="shell hero__inner hero__inner--page">
          <div className="hero__copy hero__copy--narrow">
            <h1 className="hero__title page-hero__title">{copy.title}</h1>
            <p className="hero__lead">{copy.lead}</p>
          </div>
        </div>
      </section>

      <nav aria-label={copy.agentNav} className="install-tabs plugin-agent-nav">
        <div className="shell install-tabs__inner">
              {agents.map(({ id, name }) => (
                <Link aria-current={selected.id === id ? 'page' : undefined} key={id} to={`?agent=${id}`}>
                  {name}
                </Link>
              ))}
        </div>
      </nav>

      <RailSection className="plugin-guide-section" id={selected.id} key={selected.id} title={selected.name}>
        {selected.id === 'codex' && (
          <>
            <CodeBlock code="codex plugin marketplace add project-artel/artel-plugins" />
            <p className="step__body">{copy.codex}</p>
          </>
        )}
        {selected.id === 'claude-code' && (
          <>
            <CodeBlock code={'claude plugin marketplace add project-artel/artel-plugins\nclaude plugin install artel@artel-plugins'} />
            <p className="step__body">{copy.claudeCode}</p>
          </>
        )}
        {(selected.id === 'cursor' || selected.id === 'vscode') && (
          <>
            <a className="btn btn--ghost" href={pluginZip}>{copy.download}</a>
            <p className="step__body">{selected.id === 'cursor' ? copy.cursorCopy : copy.vscodeInstall}</p>
            <p className="step__body">{selected.id === 'cursor' ? copy.cursorConnect : copy.vscodeConnect}</p>
          </>
        )}
        {selected.id === 'other' && (
          <>
            <p className="step__body">{copy.otherIntro}</p>
            <CodeBlock code={copy.otherPrompt} wrap />
          </>
        )}
      </RailSection>

      <RailSection className="plugin-guide-section" title={copy.signInTitle}>
        <p className="step__body">{copy.signIn}</p>
        <p className="step__body">{copy.verify}</p>
      </RailSection>
    </>
  )
}
