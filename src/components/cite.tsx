import type { ReactElement } from "react"

import { CitationAnchor } from "../lib/citation-anchor.tsx"
import {
  registerCitation,
  type CitationRegistry,
} from "../lib/citation-registry.ts"

export function Cite({
  id,
  registry,
}: {
  readonly id: string
  readonly registry: CitationRegistry
}): ReactElement {
  const { number, occurrence } = registerCitation(id, registry)

  return (
    <CitationAnchor id={id} occurrence={occurrence}>
      [{number}]
    </CitationAnchor>
  )
}
