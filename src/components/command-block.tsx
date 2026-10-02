import type { ReactElement, ReactNode } from "react"

import type { CommandStep } from "../lib/command-step.ts"
import { CommandLine } from "./command-line.tsx"
import { CopyButton, type CopyText } from "./copy-button.tsx"
import { PageSection } from "./page-section.tsx"
import { SectionHeading } from "./section-heading.tsx"

type CommandBlockProps = {
  readonly id: string
  readonly number: string
  readonly title: string
  readonly steps: ReadonlyArray<CommandStep>
  readonly note?: string
  readonly copyAll?: boolean
  readonly copyAllCaption?: string
  readonly copyAllLabel?: string
  readonly copy?: CopyText
  readonly copyLabel?: (command: string) => string
  readonly lead?: ReactNode
}

export function CommandBlock({
  id,
  number,
  title,
  steps,
  note,
  copyAll = false,
  copyAllCaption = "Copy all",
  copyAllLabel = `Copy all ${title} commands`,
  copy,
  copyLabel,
  lead,
}: CommandBlockProps): ReactElement {
  return (
    <PageSection id={id}>
      <div className="flex items-baseline justify-between gap-4">
        <SectionHeading number={number}>{title}</SectionHeading>
        {copyAll ? (
          <CopyButton
            {...copy}
            text={steps.map((step) => step.command).join(" &&\n")}
            label={copyAllLabel}
            caption={copyAllCaption}
          />
        ) : null}
      </div>
      {lead}
      <ol className="flex flex-col gap-4">
        {steps.map((step, index) => (
          <li key={step.command} className="flex flex-col gap-1">
            <p className="flex items-baseline gap-3 font-display text-[0.92rem] leading-[1.6]">
              <span
                aria-hidden="true"
                className="font-mono text-[0.62rem] text-muted"
              >
                {number}.{index + 1}
              </span>
              {step.comment}
            </p>
            <CommandLine
              command={step.command}
              {...(copy === undefined ? {} : { copy })}
              {...(copyLabel === undefined ? {} : { copyLabel })}
            />
          </li>
        ))}
      </ol>
      {note === undefined ? null : (
        <p className="mt-1 font-display text-[0.92rem] leading-[1.7] text-pretty text-muted">
          {note}
        </p>
      )}
    </PageSection>
  )
}
