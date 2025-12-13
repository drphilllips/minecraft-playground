import type { BlockId } from "./blockId"
import type { BlockMaterial } from "./blockMaterial";
import type { BlockColor, LabColor } from "./color"

export type MinecraftBlock = { id: BlockId, name: string, color: BlockColor, material: BlockMaterial[] }

export type BlockLab = { id: BlockId, lab: LabColor };
