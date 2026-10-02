import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

const sourceRoot = import.meta.dirname
const stylesheet = readFileSync(join(sourceRoot, "styles.css"), "utf8")
const themeClasses = ["link", "chip"]
const packageClasses = ["tok-cmd", "tok-flag", "tok-str", "plate", "js-only"]

function componentSources(): string[] {
  const directories = ["components", "components/ui"]
  return directories.flatMap((directory) =>
    readdirSync(join(sourceRoot, directory))
      .filter((name) => name.endsWith(".tsx") && !name.includes(".test."))
      .map((name) => readFileSync(join(sourceRoot, directory, name), "utf8"))
  )
}

describe("stylesheet", () => {
  it("defines every package-owned class", () => {
    for (const name of packageClasses) {
      expect(stylesheet).toContain(`.${name}`)
    }
  })

  it("uses no custom class that neither the theme nor the stylesheet defines", () => {
    const used = new Set<string>()
    for (const source of componentSources()) {
      for (const match of source.matchAll(
        /(?<![\w-])(tok-[a-z]+|plate|js-only|link|chip|no-print|state-cursor)(?![\w-])/g
      )) {
        used.add(match[1] ?? "")
      }
    }
    const known = new Set([...packageClasses, ...themeClasses])
    expect([...used].filter((name) => !known.has(name))).toEqual([])
    expect(used.size).toBeGreaterThan(0)
  })
})
