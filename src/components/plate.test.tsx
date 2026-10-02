import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import type { PlateAsset } from "../lib/plate-asset.ts"
import { Plate } from "./plate.tsx"

const asset: PlateAsset = {
  gifSrc: "/example.gif",
  staticSrc: "/example-static.png",
  width: 800,
  height: 640,
}

afterEach(() => {
  cleanup()
})

describe("Plate", () => {
  it("swaps to the still frame when motion is reduced", () => {
    const { container } = render(<Plate asset={asset} />)
    const images = [...container.querySelectorAll("img")]

    expect(images).toHaveLength(2)
    expect(images[0]).toHaveAttribute("src", asset.gifSrc)
    expect(images[0]?.className).toMatch(/motion-reduce:hidden/)
    expect(images[1]).toHaveAttribute("src", asset.staticSrc)
    expect(images[1]?.className).toMatch(/motion-reduce:block/)
  })

  it("carries the asset's native dimensions on both images", () => {
    const { container } = render(<Plate asset={asset} />)

    for (const img of container.querySelectorAll("img")) {
      expect(img.getAttribute("width")).toBe(String(asset.width))
      expect(img.getAttribute("height")).toBe(String(asset.height))
    }
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
