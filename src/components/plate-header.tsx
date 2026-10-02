import type { ReactElement } from "react"

import type { PlateAsset } from "../lib/plate-asset.ts"
import { Plate } from "./plate.tsx"

export function PlateHeader({
  asset,
  plateClassName,
}: {
  readonly asset: PlateAsset
  readonly plateClassName: string
}): ReactElement {
  return (
    <header className="mt-6 border-b border-line">
      <Plate asset={asset} className={plateClassName} />
    </header>
  )
}
