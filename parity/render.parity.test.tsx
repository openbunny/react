import { readdirSync, readFileSync } from "node:fs"
import { createElement, type ComponentType } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { ChevronIcon } from "../src/components/chevron-icon.tsx"
import { CiteGroup } from "../src/components/cite-group.tsx"
import { Cite } from "../src/components/cite.tsx"
import { CommandBlock } from "../src/components/command-block.tsx"
import { CommandLine } from "../src/components/command-line.tsx"
import { CopyButton } from "../src/components/copy-button.tsx"
import { PageSection } from "../src/components/page-section.tsx"
import { PageShell } from "../src/components/page-shell.tsx"
import { PageTitle } from "../src/components/page-title.tsx"
import { PlateHeader } from "../src/components/plate-header.tsx"
import { References } from "../src/components/references.tsx"
import { Screenshot } from "../src/components/screenshot.tsx"
import { Plate } from "../src/components/plate.tsx"
import { SectionHeading } from "../src/components/section-heading.tsx"
import { ShellCommand } from "../src/components/shell-command.tsx"
import { SkipLink } from "../src/components/skip-link.tsx"
import { StatusPage } from "../src/components/status-page.tsx"
import { Button } from "../src/components/ui/button.tsx"
import { parityCases } from "./definitions.tsx"

type Fixture = {
  readonly cases: ReadonlyArray<{
    readonly name: string
    readonly html: string
  }>
}

const components: Record<string, unknown> = {
  button: Button,
  "chevron-icon": ChevronIcon,
  cite: Cite,
  "cite-group": CiteGroup,
  "command-block": CommandBlock,
  "command-line": CommandLine,
  "copy-button": CopyButton,
  "page-section": PageSection,
  "page-shell": PageShell,
  "page-title": PageTitle,
  plate: Plate,
  "plate-header": PlateHeader,
  references: References,
  screenshot: Screenshot,
  "section-heading": SectionHeading,
  "shell-command": ShellCommand,
  "skip-link": SkipLink,
  "status-page": StatusPage,
}

const fixtureDirectory = new URL("./fixtures/", import.meta.url)

function fixture(component: string): Fixture {
  return JSON.parse(
    readFileSync(new URL(`${component}.json`, fixtureDirectory), "utf8")
  ) as Fixture
}

function render(component: string, props: Record<string, unknown>): string {
  return renderToStaticMarkup(
    createElement(components[component] as ComponentType<object>, props)
  )
}

describe("parity with captured source markup", () => {
  it("has cases and a fixture for every component, and no stray fixtures", () => {
    const withCases = [
      ...new Set(parityCases.map((c) => c.component)),
    ].toSorted((a, b) => a.localeCompare(b))
    const fixtures = readdirSync(fixtureDirectory)
      .filter((name) => name.endsWith(".json"))
      .map((name) => name.replace(/\.json$/, ""))
      .toSorted((a, b) => a.localeCompare(b))

    expect(parityCases.length).toBeGreaterThan(0)
    expect(withCases).toEqual(
      Object.keys(components).toSorted((a, b) => a.localeCompare(b))
    )
    expect(fixtures).toEqual(withCases)
  })

  it.each(parityCases.map((c) => [c.component, c.name, c] as const))(
    "%s: %s",
    (component, name, parityCase) => {
      const captured = fixture(component)
      const expected = captured.cases.find((entry) => entry.name === name)

      expect(expected).toBeDefined()
      expect(
        render(component, { ...parityCase.props, ...parityCase.adoption })
      ).toBe(expected?.html)
    }
  )

  it.each(
    parityCases
      .filter((c) => c.adoption !== undefined)
      .map((c) => [c.component, c.name, c] as const)
  )(
    "%s: %s differs by default, so its adoption props matter",
    (component, name, parityCase) => {
      const expected = fixture(component).cases.find(
        (entry) => entry.name === name
      )

      expect(render(component, parityCase.props)).not.toBe(expected?.html)
    }
  )
})
