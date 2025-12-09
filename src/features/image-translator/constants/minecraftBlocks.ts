import { BLOCK_IDS, type BlockId } from "../types/blockId";
import type { MinecraftBlock } from "../types/minecraftBlock";
import { mb } from "../utils/colors";
import { BLOCK_COLORS } from "./blockColors";
import { BLOCK_MATERIALS } from "./blockMaterials";
import { BLOCK_NAMES } from "./blockNames";

export const ALL_BLOCKS: MinecraftBlock[] = BLOCK_IDS.map(
  (id: BlockId) => (
    mb(id, BLOCK_NAMES[id], BLOCK_COLORS[id], BLOCK_MATERIALS[id])
  )
)

