import type { ReactElement } from "react"

import type { PlateAsset } from "../lib/plate-asset.ts"
import { cn } from "../lib/utils.ts"

export function Plate({
  asset,
  className,
}: {
  readonly asset: PlateAsset
  readonly className?: string
}): ReactElement {
  return (
    <span aria-hidden="true" className={cn("inline-block", className)}>
      <picture>
        <source
          media="(prefers-reduced-motion: reduce)"
          srcSet={asset.staticSrc}
        />
        <img
          src={asset.animatedSrc}
          alt=""
          width={asset.width}
          height={asset.height}
          className="plate h-auto w-full"
        />
      </picture>
    </span>
  )
}
