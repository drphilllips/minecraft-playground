import type { LabColor } from "./color"

export type MinecraftBlock = { id: BlockId, name: string, color: LabColor, material: BlockMaterial }

export type BlockId =
  | "grass"
  | "dirt"

export type BlockMaterial =
  | "wood"
  | "stone"
  | "other"

