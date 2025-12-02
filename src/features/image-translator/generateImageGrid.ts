import type { Pixel } from "../../types/imageTranslator";
import generatePixels from "./generatePixels";

export default async function generateImageGrid(
  image: File | null,
  resolution: number
): Promise<Pixel[][]> {
  const pixelColors: Pixel[][] = await generatePixels(image, resolution);
  return pixelColors;
}