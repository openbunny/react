set shell := ["bash", "-uc"]

default:
    just --list

install:
    bun install --frozen-lockfile

format-check:
    bun run format:check

lint:
    bun run lint

typecheck:
    bun run typecheck

test:
    bun run test

build:
    bun run build

parity:
    #!/usr/bin/env bash
    set -euo pipefail
    fixtures=$(find parity/fixtures -name '*.json' | wc -l)
    if [ "$fixtures" -eq 0 ]; then
        echo "parity: no fixtures under parity/fixtures; a gate with no cases proves nothing" >&2
        exit 1
    fi
    bun run test:parity

check:
    #!/usr/bin/env bash
    set -uo pipefail
    failed=""
    for gate in format-check lint typecheck test build parity; do
        printf '\n=== just %s\n' "$gate"
        just "$gate" || failed="$failed $gate"
    done
    if [ -n "$failed" ]; then
        printf '\nFAILED:%s\n' "$failed" >&2
        exit 1
    fi
    printf '\nall gates passed\n'
