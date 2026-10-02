import { describe, expect, it } from "vitest"

import { shellTokens } from "./shell-tokens.ts"

const kinds = (command: string): string =>
  shellTokens(command)
    .filter((token) => token.kind !== "space")
    .map((token) => `${token.kind}:${token.text}`)
    .join(" ")

describe("shellTokens", () => {
  it("marks the program, its flags and its operands", () => {
    expect(kinds("curl -fsSO https://example.com/key.asc")).toBe(
      "cmd:curl flag:-fsSO text:https://example.com/key.asc"
    )
  })

  it("keeps a quoted argument whole, spaces included", () => {
    expect(kinds(`curl -H 'content-type: application/json'`)).toBe(
      "cmd:curl flag:-H str:'content-type: application/json'"
    )
  })

  it("starts a new program after a pipe", () => {
    expect(kinds("tar --list | awk -v x=1")).toBe(
      "cmd:tar flag:--list text:| cmd:awk flag:-v text:x=1"
    )
  })

  it("reassembles to the original command, whitespace and line breaks included", () => {
    const command = "curl \\\n  -d '{\"a\":1}'"
    expect(
      shellTokens(command)
        .map((token) => token.text)
        .join("")
    ).toBe(command)
  })

  it("rejects an unbalanced quote rather than colouring it wrongly", () => {
    expect(() => shellTokens("echo 'open")).toThrow(
      "Unbalanced quotes in command: echo 'open"
    )
  })
})

describe("shellTokens separators", () => {
  it("starts a new program after || and &&", () => {
    expect(kinds("a || b && c")).toBe("cmd:a text:|| cmd:b text:&& cmd:c")
  })

  it("returns no tokens for an empty command", () => {
    expect(shellTokens("")).toEqual([])
  })
})
