import type { MinecraftBlock } from "../types/minecraftBlock";
import generatePixels from "./generatePixels";

export default async function generateImageGrid(
  image: HTMLImageElement | null,
  resolution: number
): Promise<MinecraftBlock[][]> {
  const pixelColors: MinecraftBlock[][] = await generatePixels(image, resolution);
  return pixelColors;
}