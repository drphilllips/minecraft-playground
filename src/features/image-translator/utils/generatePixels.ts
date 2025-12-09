import type { RgbColor } from "../types/color";

export default async function generatePixels(image: HTMLImageElement | null, resolution: number): Promise<RgbColor[][]> {
  if (!image || !Number.isFinite(resolution) || resolution <= 0) {
    return [];
  }

  try {
    const longestEdge = Math.max(image.width, image.height);
    const scale = resolution / longestEdge;
    const targetWidth = Math.max(1, Math.round(image.width * scale));
    const targetHeight = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(image.src);
      return [];
    }

    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const pixels: RgbColor[][] = [];

    for (let y = 0; y < targetHeight; y++) {
      const row: RgbColor[] = [];
      for (let x = 0; x < targetWidth; x++) {
        const idx = (y * targetWidth + x) * 4;
        const r = imageData.data[idx];
        const g = imageData.data[idx + 1];
        const b = imageData.data[idx + 2];
        const a = imageData.data[idx + 3] / 255;
        row.push({ r, g, b, a });
      }
      pixels.push(row);
    }

    URL.revokeObjectURL(image.src);
    return pixels;
  } catch {
    return [];
  }
}