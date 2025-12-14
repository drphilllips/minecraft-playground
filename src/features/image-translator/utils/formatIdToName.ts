import type { BlockId } from "../types/blockId";
import type { BlockMaterial } from "../types/blockMaterial";


export default function formatIdToName(id: BlockId | BlockMaterial): string {
  return id
    .split("_")
    .map(word =>
      word.length > 0
        ? word[0].toUpperCase() + word.slice(1)
        : word
    )
    .join(" ");
}