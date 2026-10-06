import { Fragment, type ReactElement } from "react"

import type { CitationRegistry } from "../lib/citation-registry.ts"
import type { Reference } from "../lib/reference.ts"

export type BackLinkLabel = (
  number: number,
  occurrence: number,
  occurrences: number
) => string

const defaultBackLinkLabel: BackLinkLabel = (
  number,
  occurrence,
  occurrences
) =>
  occurrences > 1
    ? `Back to citation ${String(number)}, occurrence ${String(occurrence)} of ${String(occurrences)}`
    : `Back to citation ${String(number)}`

export function References({
  items,
  registry,
  sourceLabel = "Source",
  backLinkLabel = defaultBackLinkLabel,
}: {
  readonly items: readonly Reference[]
  readonly registry: CitationRegistry
  readonly sourceLabel?: string
  readonly backLinkLabel?: BackLinkLabel
}): ReactElement {
  return (
    <ol className="mt-4 flex flex-col gap-3 font-display text-[0.85rem] leading-[1.6]">
      {registry.citedIds().map((id) => {
        const reference = items.find((item) => item.id === id)
        if (reference === undefined) {
          throw new Error(
            `References has no entry for the cited id "${id}". Add a Reference with that id to items, or remove the citation.`
          )
        }

        const occurrences = registry.occurrenceCount(id)
        const number = registry.numberOf(id)
        const backLinks = Array.from(
          { length: Math.max(occurrences, 1) },
          (_value, index) => index + 1
        )

        return (
          <li id={`ref-${id}`} key={id}>
            {reference.authors} ({reference.year}). {reference.title}.{" "}
            {reference.venue}.
            {reference.url === undefined ? null : (
              <>
                {" "}
                <a href={reference.url} className="link">
                  {sourceLabel}
                </a>
              </>
            )}
            {backLinks.map((occurrence) => (
              <Fragment key={occurrence}>
                {" "}
                <a href={`#cite-${id}-${String(occurrence)}`} className="link">
                  <span className="sr-only">
                    {backLinkLabel(number, occurrence, occurrences)}
                  </span>
                  <span aria-hidden="true">
                    {occurrences > 1 ? `^${String(occurrence)}` : "^"}
                  </span>
                </a>
              </Fragment>
            ))}
          </li>
        )
      })}
    </ol>
  )
}
