import type { ReactElement } from "react"

import { CopyButton, type CopyText } from "./copy-button.tsx"
import { ShellCommand } from "./shell-command.tsx"

export function CommandLine({
  command,
  copy,
  copyLabel = (text) => `Copy command: ${text}`,
}: {
  readonly command: string
  readonly copy?: CopyText
  readonly copyLabel?: (command: string) => string
}): ReactElement {
  return (
    <div className="flex items-center gap-3 border border-line bg-paper-inset px-4 py-2">
      <code className="flex min-w-0 flex-1 items-baseline gap-2 font-mono text-[0.68rem] leading-[1.65] [overflow-wrap:anywhere] whitespace-break-spaces">
        <span aria-hidden="true" className="text-muted select-none">
          $
        </span>
        <span className="min-w-0">
          <ShellCommand command={command} />
        </span>
      </code>
      <CopyButton {...copy} text={command} label={copyLabel(command)} />
    </div>
  )
}
