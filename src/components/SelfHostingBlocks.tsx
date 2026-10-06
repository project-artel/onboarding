import type { SelfHostingBlock, SelfHostingCodeKey } from '../i18n/messages'
import * as commands from '../pages/selfHostingCommands'
import { composeFile } from '../pages/composeFile.generated'
import { CodeBlock } from './CodeBlock'

const codeByKey: Record<SelfHostingCodeKey, string> = {
  install: commands.installCommand,
  installWithFlags: commands.installWithFlagsCommand,
  installAfter: commands.installAfterCommand,
  composeFile: composeFile,
  envFile: commands.envFileLines,
  generateSecret: commands.generateSecretCommand,
  shellOverrideCheck: commands.shellOverrideCheckCommand,
  composeUp: commands.composeUpCommands,
  composeLogs: commands.composeLogsCommand,
  composeUpgrade: commands.composeUpgradeCommands,
  backup: commands.backupCommand,
  restore: commands.restoreCommand,
  composeDown: commands.composeDownCommand,
  signupOpen: commands.signupOpenLine,
  openRouterEnvironment: commands.openRouterEnvironmentLine,
  models: [...commands.requiredChatModels, commands.embeddingModel].join('\n'),
  githubEnvironment: commands.githubEnvironmentLines,
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

export function SelfHostingBlocks({ blocks }: { blocks: SelfHostingBlock[] }) {
  return (
    <div className="selfhost__blocks">
      {blocks.map((block, index) => (
        <Block block={block} key={index} />
      ))}
    </div>
  )
}
