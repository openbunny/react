import type { ReactElement, ReactNode } from "react"

export function Screenshot({
  src,
  alt,
  width,
  height,
  caption,
}: {
  readonly src: string
  readonly alt: string
  readonly width: number
  readonly height: number
  readonly caption: ReactNode
}): ReactElement {
  return (
    <figure className="flex flex-col gap-2">
      <div className="border border-line bg-paper-inset p-1.5">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </div>
      <figcaption className="text-right font-mono text-[0.75rem] leading-normal text-muted">
        {caption}
      </figcaption>
    </figure>
  )
}
