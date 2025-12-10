import type { BlockSummary } from "../types/gridOutput";


export function hasBlocks(obj: BlockSummary): boolean {
  return Object.values(obj).some(v => typeof v === "number" && v > 0);
}