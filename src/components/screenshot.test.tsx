import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { Screenshot } from "./screenshot.tsx"

afterEach(() => {
  cleanup()
})

function renderShot(): HTMLElement {
  render(
    <Screenshot
      src="/post-art/example/shot.jpg"
      alt="a results screen"
      width={1920}
      height={1080}
      caption="after the first round"
    />
  )
  return screen.getByRole("figure")
}

describe("Screenshot", () => {
  it("renders the image with its alt text and intrinsic size", () => {
    renderShot()

    const image = screen.getByRole("img", { name: "a results screen" })
    expect(image).toHaveAttribute("src", "/post-art/example/shot.jpg")
    expect(image).toHaveAttribute("width", "1920")
    expect(image).toHaveAttribute("height", "1080")
  })

  it("captions the figure with a figcaption below the image", () => {
    const figure = renderShot()

    const caption = figure.querySelector("figcaption")
    expect(caption).toHaveTextContent("after the first round")
    expect(figure.lastElementChild).toBe(caption)
  })

  it("spans the container with no margin or padding of its own", () => {
    const classes = renderShot().className.split(" ")

    const spacing = ["m", "p"].flatMap((kind) =>
      ["", "x", "y", "t", "b", "l", "r"].map((side) => `${kind}${side}-`)
    )
    expect(
      classes.filter((name) =>
        spacing.some((prefix) => name.startsWith(prefix))
      )
    ).toEqual([])
  })

  it("outlines the image alone in the one 1px rule on the code-box ground, inset slightly, with no rounded corner", () => {
    renderShot()

    const box = screen.getByRole("img").parentElement
    const classes = box?.className.split(" ") ?? []
    expect(classes).toEqual(
      expect.arrayContaining([
        "border",
        "border-line",
        "bg-paper-inset",
        "p-1.5",
      ])
    )
    expect(classes.some((name) => name.startsWith("rounded"))).toBe(false)
    expect(box?.querySelector("figcaption")).toBeNull()
  })

  it("right-aligns the caption below the box", () => {
    const caption = renderShot().querySelector("figcaption")

    expect(caption?.className.split(" ")).toContain("text-right")
  })

  it("scales the image to the box and keeps the aspect ratio", () => {
    renderShot()

    expect(screen.getByRole("img").className.split(" ")).toEqual(
      expect.arrayContaining(["w-full", "h-auto"])
    )
  })

  it("sets no inline style attribute, which the csp blocks", () => {
    renderShot()

    expect(document.querySelector("[style]")).toBeNull()
  })
})
