import type { MinecraftBlock } from "../features/image-translator/types/minecraftBlock";

export type GridSquare = string | MinecraftBlock | null;

export type MagnifierStyle = {
  left: number;
  top: number;
};
export type HoverInfo = {
  row: number;
  col: number;
  clientX: number;
  clientY: number;
};