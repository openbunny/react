import { Fragment, type ReactElement } from "react"

import { CitationAnchor } from "../lib/citation-anchor.tsx"
import {
  registerCitation,
  type CitationRegistry,
} from "../lib/citation-registry.ts"

export function CiteGroup({
  ids,
  registry,
}: {
  readonly ids: readonly string[]
  readonly registry: CitationRegistry
}): ReactElement {
  const cited = ids.map((id) => ({ id, ...registerCitation(id, registry) }))

  return (
    <span className="whitespace-nowrap">
      {"["}
      {cited.map(({ id, number, occurrence }, index) => (
        <Fragment key={id}>
          {index > 0 ? ", " : null}
          <CitationAnchor id={id} occurrence={occurrence}>
            {String(number)}
          </CitationAnchor>
        </Fragment>
      ))}
      {"]"}
    </span>
  )
}
