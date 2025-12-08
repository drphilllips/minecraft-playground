import type { RgbaColor } from "../../../types/color";
import generatePixels from "./generatePixels";

export default async function generateImageGrid(
  image: HTMLImageElement | null,
  resolution: number
): Promise<RgbaColor[][]> {
  const pixelColors: RgbaColor[][] = await generatePixels(image, resolution);
  return pixelColors;
}