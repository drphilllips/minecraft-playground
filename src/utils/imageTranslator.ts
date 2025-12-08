import type { LabColor, RgbaColor } from "../types/color";
import type { BlockId, BlockMaterial, MinecraftBlock } from "../types/minecraftBlock";

export const mb = (id: BlockId, name: string, color: LabColor, material: BlockMaterial): MinecraftBlock => (
  { id, name, color, material }
)

export const rgba = (r: number, g: number, b: number, a: number): RgbaColor => (
  { r, g, b, a }
)

export const lab = (L: number, a: number, b: number): LabColor => (
  { L, a, b }
)

export function rgbaToLab(rgbaColor: RgbaColor): LabColor {
  const { r, g, b } = rgbaColor;

  // 1. Normalize RGB to [0, 1]
  let R = r / 255;
  let G = g / 255;
  let B = b / 255;

  // 2. Convert sRGB to linear RGB
  const srgbToLinear = (c: number): number =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  R = srgbToLinear(R);
  G = srgbToLinear(G);
  B = srgbToLinear(B);

  // 3. Linear RGB to XYZ (D65)
  const X = R * 0.4124 + G * 0.3576 + B * 0.1805;
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const Z = R * 0.0193 + G * 0.1192 + B * 0.9505;

  // 4. Normalize for D65 reference white
  const Xr = 0.95047;
  const Yr = 1.0;
  const Zr = 1.08883;

  const x = X / Xr;
  const y = Y / Yr;
  const z = Z / Zr;

  // 5. XYZ to Lab
  const epsilon = 216 / 24389; // ~0.008856
  const kappa = 24389 / 27;    // ~903.3

  const f = (t: number): number =>
    t > epsilon ? Math.cbrt(t) : (kappa * t + 16) / 116;

  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bLab = 200 * (fy - fz);

  return { L, a, b: bLab };
}

export function getDominantColor(image: HTMLImageElement | null): LabColor | null {
  if (!image) {
    return null;
  }

  const ctx = document.createElement('canvas').getContext('2d');

  if (!ctx) {
    URL.revokeObjectURL(image.src);
    return null;
  }

  //draw the image to one pixel and let the browser find the dominant color
  ctx.drawImage(image, 0, 0, 1, 1);

  //get pixel color
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;

  console.log(`rgba(${r},${g},${b},${a})`);

  console.log("#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1));

  return rgbaToLab(rgba(r, g, b, a));
}
