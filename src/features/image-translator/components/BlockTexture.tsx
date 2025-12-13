import type { BlockId } from "../types/blockId"


export default function BlockTexture({
  blockId,
  className,
}: {
  blockId: BlockId
  className?: string
}) {
  return (
    <img
      src={`/textures/blocks/${blockId}.png`}
      alt={blockId}
      className={className}
    />
  )
}