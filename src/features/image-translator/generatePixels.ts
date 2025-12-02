import type { Pixel } from "../../types/imageTranslator";


function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

export default async function generatePixels(image: File | null, resolution: number): Promise<Pixel[][]> {
  if (!image || !Number.isFinite(resolution) || resolution <= 0) {
    return [];
  }

  let img: HTMLImageElement;
  try {
    img = await loadImageFromFile(image);

    const longestEdge = Math.max(img.width, img.height);
    const scale = resolution / longestEdge;
    const targetWidth = Math.max(1, Math.round(img.width * scale));
    const targetHeight = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(img.src);
      return [];
    }

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const pixels: Pixel[][] = [];

    for (let y = 0; y < targetHeight; y++) {
      const row: Pixel[] = [];
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

    URL.revokeObjectURL(img.src);
    return pixels;
  } catch {
    return [];
  }
}