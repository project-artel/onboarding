import type { SelfHostingBlock, SelfHostingCodeKey } from '../i18n/messages'
import * as commands from '../pages/selfHostingCommands'
import { CodeBlock } from './CodeBlock'
import { RemoteFile } from './RemoteFile'

const codeByKey: Record<SelfHostingCodeKey, string> = {
  install: commands.installCommand,
  installWithFlags: commands.installWithFlagsCommand,
  composeDownload: commands.composeDownloadCommand,
  generateSecret: commands.generateSecretCommand,
  composeUp: commands.composeUpCommands,
  composeLogs: commands.composeLogsCommand,
  composeUpgrade: commands.composeUpgradeCommands,
  backup: commands.backupCommand,
  restore: commands.restoreCommand,
  composeDown: commands.composeDownCommand,
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
    case 'composeFile':
      return (
        <RemoteFile
          copyLabel={block.copy}
          showLabel={block.show}
          url={commands.composeRawUrl}
          viewUrl={commands.composeViewUrl}
        />
      )
    case 'link':
      return (
        <p className="step__body">
          <a className="btn btn--primary" href={block.href} rel="noreferrer noopener" target="_blank">
            {block.label}
          </a>
        </p>
      )
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
