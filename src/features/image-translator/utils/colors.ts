import type { BlockId } from "../types/blockId";
import type { BlockColor, LabColor, RgbColor } from "../types/color";
import type { BlockMaterial, MinecraftBlock } from "../types/minecraftBlock";

export const mb = (id: BlockId, name: string, color: BlockColor, material: BlockMaterial[]): MinecraftBlock => (
  { id, name, color, material }
)

export const c = (rgba: RgbColor, lab: LabColor): BlockColor => (
  { rgb: rgba, lab }
)

export const rgb = (r: number, g: number, b: number): RgbColor => (
  { r, g, b }
)

export const lab = (L: number, a: number, b: number): LabColor => (
  { L, a, b }
)
