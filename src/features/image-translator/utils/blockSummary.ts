import type { BlockSummary } from "../../../types/gridOutput";
import type { MinecraftBlock } from "../types/minecraftBlock";

export default function calculateBlockSummary(
  blockGrid: MinecraftBlock[][]
): BlockSummary {
  const blockSummary: BlockSummary = {};
  blockGrid.forEach(row => {
    row.forEach(cell => {
      const currentCount = blockSummary[cell.id];
      blockSummary[cell.id] = (currentCount || 0) + 1;
    })
  })
  return blockSummary;
}

// Util for BlockSummary component
export function formatBlockCount(count: number): string {
  if (count === 1) {
    return "1 block";
  }
  return `${count} blocks`;
}