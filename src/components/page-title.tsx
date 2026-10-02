import type { ReactElement } from "react"

import { formatLongDate } from "../lib/iso-date.ts"

export function PageTitle({
  title,
  lastChangedAt,
  changedLabel = "Last changed",
  formatDate = formatLongDate,
}: {
  readonly title: string
  readonly lastChangedAt?: string
  readonly changedLabel?: string
  readonly formatDate?: (isoDate: string) => string
}): ReactElement {
  return (
    <div>
      <h1 className="font-display text-[1.4rem] leading-none">{title}</h1>
      {lastChangedAt === undefined ? null : (
        <time
          dateTime={lastChangedAt}
          className="mt-3 block font-mono text-[0.75rem] text-muted"
        >
          {`${changedLabel} ${formatDate(lastChangedAt.slice(0, 10))}`}
        </time>
      )}
    </div>
  )
}
