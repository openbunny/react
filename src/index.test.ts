import { readdirSync, readFileSync } from "node:fs"
import { basename, join } from "node:path"

import { describe, expect, it } from "vitest"

import * as entry from "./index.ts"

const sourceRoot = import.meta.dirname

const components = [
  "Button",
  "ChevronIcon",
  "CommandBlock",
  "CommandLine",
  "CopyButton",
  "PageSection",
  "PageShell",
  "PageTitle",
  "Plate",
  "PlateHeader",
  "SectionHeading",
  "ShellCommand",
  "SkipLink",
  "StatusPage",
]

const helpers = ["cn", "formatLongDate", "shellTokens"]

describe("entry point", () => {
  it("exports exactly the generic components and helpers", () => {
    expect(Object.keys(entry).toSorted((a, b) => a.localeCompare(b))).toEqual(
      [...components, ...helpers].toSorted((a, b) => a.localeCompare(b))
    )
  })

  it("exports every component module under src/components", () => {
    const modules = [
      ...readdirSync(join(sourceRoot, "components")),
      ...readdirSync(join(sourceRoot, "components/ui")).map(
        (name) => `ui/${name}`
      ),
    ]
      .filter((name) => /\.tsx$/.test(name) && !/\.test\.tsx$/.test(name))
      .map((name) => basename(name, ".tsx").replaceAll("-", ""))
      .toSorted((a, b) => a.localeCompare(b))

    expect(modules).toEqual(
      components
        .map((name) => name.toLowerCase())
        .toSorted((a, b) => a.localeCompare(b))
    )
  })

  it("documents every exported name in the README props reference", () => {
    const readme = readFileSync(join(sourceRoot, "../README.md"), "utf8")
    const reference = readme.slice(readme.indexOf("## Props reference"))

    expect(reference.length).toBeGreaterThan(0)
    for (const name of [
      ...components,
      ...helpers,
      "PlateAsset",
      "CommandStep",
    ]) {
      expect(reference).toContain(`\`${name}`)
    }
  })
})
