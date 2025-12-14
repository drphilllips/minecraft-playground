import type { BlockFilter } from "../types/blockFilter";
import type { MinecraftBlock } from "../types/minecraftBlock";


export function applyBlockFilter(blockPool: MinecraftBlock[], blockFilter: BlockFilter): MinecraftBlock[] {
  if (!blockFilter) return blockPool;

  const materialSet = new Set(blockFilter.materials ?? []);
  const removeSet = new Set(blockFilter.removeBlocks ?? []);

  return blockPool.filter(block => {
    if (removeSet.has(block.id)) return false;

    if (materialSet.size === 0) return true;

    return block.material.some(m => materialSet.has(m));
  });
}