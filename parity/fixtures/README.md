Each `<component>.json` holds the markup that the original component rendered for the cases in `parity/definitions.tsx`. The file has one field, `cases`, a list of `name` and `html` pairs.

The markup was captured once with `renderToStaticMarkup`. The fixtures are frozen: no command in this package regenerates them, because the original components are not part of this package. A new case in `parity/definitions.tsx` needs a fixture entry captured from the original component outside this package. Without one, `just parity` fails for that case.

A case with an `adoption` entry renders the package component with those extra props. They are the props a consumer passes to reproduce the original markup, because the package defaults are neutral. `just parity` also asserts that the default render differs from the fixture for such a case, so an adoption entry that no longer matters fails.
