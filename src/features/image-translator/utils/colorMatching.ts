import { BLOCK_LABS } from "../constants/blockColors";
import { MINECRAFT_BLOCKS } from "../constants/minecraftBlocks";
import type { BlockId } from "../types/blockId";
import type { LabColor, RgbColor } from "../types/color";
import type { MinecraftBlock } from "../types/minecraftBlock";

export function findClosestBlock(r: number, g: number, b: number): MinecraftBlock {
  const lab = rgbToLab({ r, g, b });

  let bestId: BlockId = BLOCK_LABS[0].id;
  let bestDist = Infinity;

  for (const block of BLOCK_LABS) {
    const dist = deltaE(lab, block.lab);
    if (dist < bestDist) {
      bestDist = dist;
      bestId = block.id;
    }
  }

  return MINECRAFT_BLOCKS[bestId];
}

export function deltaE(a: LabColor, b: LabColor): number {
  const dl = a.L - b.L;
  const da = a.a - b.a;
  const db = a.b - b.b;
  return Math.sqrt(dl*dl + da*da + db*db);
}

export function rgbToLab(rgbColor: RgbColor): LabColor {
  const { r, g, b } = rgbColor;

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
