import type { RgbColor } from "../types/color";
import generatePixels from "./generatePixels";

export default async function generateImageGrid(
  image: HTMLImageElement | null,
  resolution: number
): Promise<RgbColor[][]> {
  const pixelColors: RgbColor[][] = await generatePixels(image, resolution);
  return pixelColors;
}