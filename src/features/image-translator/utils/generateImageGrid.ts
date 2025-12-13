import type { BlockLab, MinecraftBlock } from "../types/minecraftBlock";
import generatePixels from "./generatePixels";

export default async function generateImageGrid(
  blockLabPool: BlockLab[],
  image: HTMLImageElement | null,
  resolution: number
): Promise<MinecraftBlock[][]> {
  const pixelColors: MinecraftBlock[][] = await generatePixels(blockLabPool, image, resolution);
  return pixelColors;
}