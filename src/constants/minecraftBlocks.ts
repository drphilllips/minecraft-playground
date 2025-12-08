import type { MinecraftBlock } from "../types/minecraftBlock";
import { lab, mb } from "../utils/minecraftBlock";

export const ALL_BLOCKS: MinecraftBlock[] = [
  mb("dirt", "Dirt", lab(0, 0, 0), "other"),
  mb("grass", "Grass", lab(0, 0, 0), "other"),
]
