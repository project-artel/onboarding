import { CodeBlock } from '../components/CodeBlock'
import { RailSection } from '../components/RailSection'
import { StateBadge } from '../components/StateBadge'
import { useCopy } from '../i18n/useCopy'
import type { SelfHostingBlock, SelfHostingCodeKey } from '../i18n/messages'
import {
  backupCommand,
  composeBuildCommand,
  composeCommands,
  composeUpgradeCommand,
  dockerRunCommands,
  embeddingModel,
  githubEnvironmentLines,
  installCommand,
  installWithFlagsCommand,
  openRouterEnvironmentLine,
  requiredChatModels,
  signupOpenLine,
} from './selfHostingCommands'

const repositoryUrl = 'https://github.com/project-artel/artel'

const codeByKey: Record<SelfHostingCodeKey, string> = {
  install: installCommand,
  installWithFlags: installWithFlagsCommand,
  signupOpen: signupOpenLine,
  openRouterEnvironment: openRouterEnvironmentLine,
  models: [...requiredChatModels, embeddingModel].join('\n'),
  compose: composeCommands,
  composeUpgrade: composeUpgradeCommand,
  composeBuild: composeBuildCommand,
  backup: backupCommand,
  dockerRun: dockerRunCommands,
  githubEnvironment: githubEnvironmentLines,
}

function Block({ block }: { block: SelfHostingBlock }) {
  switch (block.kind) {
    case 'paragraph':
      return <p className="step__body">{block.text}</p>
    case 'list':
      return (
        <ul className="marks marks--tight">
          {block.items.map((item) => (
            <li key={item}>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'code':
      return <CodeBlock code={codeByKey[block.code]} />
  }
}

export function SelfHostingPage() {
  const { t } = useCopy()
  const page = t.selfHosting

  return (
    <>
      <section className="hero">
        <span className="crop crop--tl" aria-hidden="true" />
        <span className="crop crop--tr" aria-hidden="true" />
        <div className="shell hero__inner hero__inner--page">
          <div className="hero__copy hero__copy--narrow">
            <p className="page-hero__kicker">SELF-HOST</p>
            <h1 className="hero__title page-hero__title">{page.title}</h1>
            <p className="hero__lead">{page.lead}</p>
            <p className="hero__lead">
              <StateBadge state="planned" /> {page.statusNote}
            </p>
          </div>
        </div>
      </section>

      {page.sections.map((section, index) => (
        <RailSection
          alt={index % 2 === 0}
          key={section.title}
          num={String(index + 1).padStart(2, '0')}
          title={section.title}
        >
          {section.state ? <StateBadge state={section.state} /> : null}
          <div className="selfhost__blocks">
            {section.blocks.map((block, blockIndex) => (
              <Block block={block} key={blockIndex} />
            ))}
          </div>
        </RailSection>
      ))}

      <section className="section">
        <div className="shell section__full selfhost__links">
          <a
            className="btn btn--ghost"
            href={`${repositoryUrl}/blob/main/deploy/README.md`}
            rel="noreferrer noopener"
            target="_blank"
          >
            {page.deployReadmeLabel}
          </a>
          <a
            className="btn btn--ghost"
            href={`${repositoryUrl}/blob/main/LICENSE`}
            rel="noreferrer noopener"
            target="_blank"
          >
            {page.licenseLabel}
          </a>
        </div>
      </section>
    </>
  )
}
