import type { BlockId } from "./blockId"
import type { BlockColor } from "./color"

export type MinecraftBlock = { id: BlockId, name: string, color: BlockColor, material: BlockMaterial[] }

export type BlockMaterial =
  | "wood"            // woods
  | "bamboo"
  | "nether_wood"
  | "stone"           // stones
  | "natural_stone"
  | "masonry"
  | "deepslate"
  | "blackstone"
  | "quartz"
  | "nether_brick"
  | "tuff"
  | "prismarine"
  | "resin"
  | "metal_and_ore"   // other
  | "concrete"
  | "terracotta"
  | "wool_and_carpet"
  | "earth"
  | "organics"
  | "luminant_and_special"
  | "nether"
  | "end"
  | "other"

