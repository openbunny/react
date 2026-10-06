import { cleanup, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"

import type { PlateAsset } from "../lib/plate-asset.ts"
import { Plate } from "./plate.tsx"

const asset: PlateAsset = {
  animatedSrc: "/example.gif",
  staticSrc: "/example-static.png",
  width: 800,
  height: 640,
}

afterEach(() => {
  cleanup()
})

describe("Plate", () => {
  it("renders one image, with the still frame as the reduced-motion source", () => {
    const { container } = render(<Plate asset={asset} />)
    const images = container.querySelectorAll("img")
    const sources = container.querySelectorAll("picture > source")

    expect(images).toHaveLength(1)
    expect(images[0]).toHaveAttribute("src", asset.animatedSrc)
    expect(images[0]?.parentElement?.tagName).toBe("PICTURE")
    expect(sources).toHaveLength(1)
    expect(sources[0]).toHaveAttribute(
      "media",
      "(prefers-reduced-motion: reduce)"
    )
    expect(sources[0]).toHaveAttribute("srcset", asset.staticSrc)
  })

  it("keeps the plate class on the image, so the pixel rules apply", () => {
    const { container } = render(<Plate asset={asset} />)

    expect(container.querySelector("img")?.className).toBe(
      "plate h-auto w-full"
    )
  })

  it("emits no image preload link when server-rendered", () => {
    const html = renderToString(<Plate asset={asset} />)

    expect(html).not.toMatch(/<link[^>]*rel="preload"/)
    expect(html).not.toMatch(/<link[^>]*as="image"/)
  })

  it("carries no name of its own, because a heading always names it", () => {
    const { container } = render(<Plate asset={asset} />)

    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
    for (const img of container.querySelectorAll("img")) {
      expect(img.getAttribute("alt")).toBe("")
    }
    expect(screen.queryByRole("img")).toBeNull()
  })

  it("merges a className onto the wrapper", () => {
    const { container } = render(<Plate asset={asset} className="w-24" />)

    expect(container.firstElementChild?.className).toBe("inline-block w-24")
  })
})
