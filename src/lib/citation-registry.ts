export type CitationRegistry = {
  readonly numberOf: (id: string) => number
  readonly recordOccurrence: (id: string) => number
  readonly citedIds: () => readonly string[]
  readonly occurrenceCount: (id: string) => number
}

export function createCitationRegistry(): CitationRegistry {
  const order: string[] = []
  const occurrences = new Map<string, number>()

  return {
    numberOf(id) {
      let position = order.indexOf(id)
      if (position === -1) {
        order.push(id)
        position = order.length - 1
      }
      return position + 1
    },
    recordOccurrence(id) {
      const next = (occurrences.get(id) ?? 0) + 1
      occurrences.set(id, next)
      return next
    },
    citedIds() {
      return order
    },
    occurrenceCount(id) {
      return occurrences.get(id) ?? 0
    },
  }
}

export function registerCitation(
  id: string,
  registry: CitationRegistry
): { readonly number: number; readonly occurrence: number } {
  const number = registry.numberOf(id)
  const occurrence = registry.recordOccurrence(id)

  return { number, occurrence }
}
