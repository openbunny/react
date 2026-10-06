import type { ReactElement, ReactNode } from "react"

export function CitationAnchor({
  id,
  occurrence,
  children,
}: {
  readonly id: string
  readonly occurrence: number
  readonly children: ReactNode
}): ReactElement {
  return (
    <a
      id={`cite-${id}-${String(occurrence)}`}
      href={`#ref-${id}`}
      className="text-ink hover:text-sprout"
    >
      {children}
    </a>
  )
}
