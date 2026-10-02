# @openbunny/react

Generic React components for OpenBunny sites. The package ships components and
helpers with no site content.

## Components

| Component                                     | Purpose                                               |
| --------------------------------------------- | ----------------------------------------------------- |
| `PageShell`, `PageSection`                    | Centred column and bordered section                   |
| `PageTitle`, `SectionHeading`                 | Page `h1` with optional date, numbered section `h2`   |
| `Plate`, `PlateHeader`, `StatusPage`          | Animated and static image pair, header, status layout |
| `CommandBlock`, `CommandLine`, `ShellCommand` | Numbered command steps, one command row, token spans  |
| `CopyButton`, `Button`                        | Clipboard button, base button                         |
| `SkipLink`, `ChevronIcon`                     | Skip-to-content link, chevron icon                    |

The package renders no site identity. Each component takes its text, artwork
and behaviour through props. Where a prop has a default, the default is neutral
English. No component imports `next`, an analytics client or a router, and none
renders a link. A caller that needs a link passes its own element as a child or
as a prop of type `ReactNode`.

## Install

The package is `private: true` and not on a registry. Depend on a checkout or a
packed tarball (`bun pm pack`).

```sh
bun add @openbunny/react @base-ui/react react react-dom
```

`react`, `react-dom` and `@base-ui/react` are peer dependencies. Each stays a
single copy in the consumer's tree.

## Usage

```tsx
import { CommandBlock, PageShell } from "@openbunny/react"
```

The consumer's Tailwind build must scan the package, or the utilities are not
generated, and the consumer imports the theme and the package stylesheet:

```css
@import "tailwindcss";
@import "@openbunny/theme/css/tokens.css";
@import "@openbunny/theme/css/tailwind.css";
@import "@openbunny/theme/css/extension-base.css";
@import "@openbunny/react/styles.css";
@source "../node_modules/@openbunny/react/dist";
```

## Styling contract

The components style against the OpenBunny theme (`@openbunny/theme`). The
theme defines the items below; a consumer that does not use the theme defines
them itself. A missing item raises no error; the component renders unstyled in
that respect.

### Theme custom properties and Tailwind tokens

`tailwind.css` from the theme maps each colour to a Tailwind utility. The
components use these utilities: `border-line`, `bg-paper`, `bg-paper-inset`,
`bg-foreground`, `text-background`, `text-foreground`, `text-ink`, `text-muted`,
`border-foreground`, `ring` and the `font-display`, `font-sc` and `font-mono`
families. `styles.css` reads `--ink-deep`, `--ink-mid`, `--sprout` and
`--font-weight-bold`. Components assume square corners (`--radius-*` is `0`).

### Component classes

| Class                               | Defined by                    | Used by        | Rule                                                                |
| ----------------------------------- | ----------------------------- | -------------- | ------------------------------------------------------------------- |
| `.tok-cmd`, `.tok-flag`, `.tok-str` | `@openbunny/react/styles.css` | `ShellCommand` | colours from `--ink-deep`, `--ink-mid`, `--sprout`; `.tok-cmd` bold |
| `.plate`                            | `@openbunny/react/styles.css` | `Plate`        | `image-rendering: pixelated`                                        |
| `.js-only`                          | `@openbunny/react/styles.css` | `CopyButton`   | hidden under `@media (scripting: none)`                             |

`src/styles.test.ts` fails when a component uses a custom class that neither
this table nor the theme defines. The theme defines `.link` and `.chip`; no
component uses them.

### Document contract

- The page has one element with `id="main"`. `SkipLink` and `StatusPage` target
  it.
- `:focus-visible` has a visible outline. The theme's `extension-base.css`
  provides one.

## Props reference

Every prop is required unless its row shows a default or `?`.

| Component        | Props                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| `Button`         | `variant` (`"outline"`), `size` (`"xs"`), and every prop of `@base-ui/react` `Button`                            |
| `ChevronIcon`    | `direction`: `"left"` or `"right"`                                                                               |
| `CommandBlock`   | `id`, `number`, `title`, `steps`: `CommandStep[]`, `note?`, `copyAll?` (`false`), `copy?`, `copyLabel?`, `lead?` |
| `CommandLine`    | `command`, `copy?`, `copyLabel?`                                                                                 |
| `CopyButton`     | `text`, `label`, `caption?`, `copiedCaption?`, `failureHint?`, `onCopy?`                                         |
| `PageSection`    | `id`, `className?`, `children`                                                                                   |
| `PageShell`      | `children`                                                                                                       |
| `PageTitle`      | `title`, `lastChangedAt?`, `changedLabel?`, `formatDate?`                                                        |
| `Plate`          | `asset`: `PlateAsset`, `className?`                                                                              |
| `PlateHeader`    | `asset`: `PlateAsset`, `plateClassName`                                                                          |
| `SectionHeading` | `number`, `children`                                                                                             |
| `ShellCommand`   | `command`                                                                                                        |
| `SkipLink`       | `label?`                                                                                                         |
| `StatusPage`     | `asset`: `PlateAsset`, `plateClassName`, `heading`, `children`, `actions`                                        |

Types and helpers:

- `PlateAsset`: `gifSrc`, `staticSrc` (strings), `width`, `height` (numbers).
- `CommandStep`: `command` and `comment` (strings).
- `CopyText`: `caption?`, `copiedCaption?`, `failureHint?`.
- `shellTokens(command)` returns `ShellToken[]`; it throws on unbalanced quotes.
- `formatLongDate(isoDate)` formats an ISO date for `PageTitle`.
- `cn(...classes)` merges class names.

`bun run build` also emits declarations in `dist/index.d.ts`.

## Props that carry text

Copy, captions and labels are props with neutral English defaults.

| Component      | Props                                                                    |
| -------------- | ------------------------------------------------------------------------ |
| `CopyButton`   | `label` (required), `caption`, `copiedCaption`, `failureHint`, `onCopy`  |
| `CommandLine`  | `copy` (`caption`, `copiedCaption`, `failureHint`), `copyLabel(command)` |
| `CommandBlock` | `copy`, `copyLabel`, `copyAllCaption`, `copyAllLabel`, `note`, `lead`    |
| `PageTitle`    | `changedLabel`, `formatDate(isoDate)`                                    |
| `SkipLink`     | `label`                                                                  |

`CopyButton` reports a successful copy through `onCopy`. The consumer attaches
analytics there; the package contains none.

## Parity

Each component is compared with markup captured once from the component it was
extracted from. The captured files are `parity/fixtures/<component>.json`. The
package imports nothing from the original and needs no checkout of it.
`parity/fixtures/README.md` states that the fixtures are frozen and when they
change.

Package defaults differ from the original defaults in capitalisation. A case with
an `adoption` entry in `parity/definitions.tsx` lists the props that reproduce
the original markup, and the parity run also asserts that the default render
differs from the fixture. `just parity` fails when `parity/fixtures` holds no
fixture, because a gate with no cases checks nothing.

## Development

Requires `bun` and `just`. `package.json` pins the `bun` version.

```sh
just install
just check
```

`just check` runs `format-check`, `lint`, `typecheck`, `test`, `build` and
`parity`, reports every failure, then exits non-zero if any failed.

The build is `tsc`, not a bundler. A bundler would collapse the module graph and
drop the `"use client"` directives that mark client components. `tsc` emits one
module per source file with those directives intact, plus declarations. The
consumer's bundler tree-shakes.

`next` is a development dependency, present only because the lint configuration extends `eslint-config-next`. The built package does not import it.

Source imports use explicit `.ts` and `.tsx` extensions. The compiler rewrites
them to `.js` in `dist`.

## Licence

MIT. See `LICENSE`. Copyright (c) 2026 OpenBunny.
