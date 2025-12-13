import type { BlockId } from "../types/blockId";
import type { BlockMaterial } from "../types/blockMaterial";
import { BLOCK_MATERIALS } from "../constants/blockMaterials";
import type { BlockFilter } from "../types/blockFilter";

export function getAllBlocksOfMaterial(material: BlockMaterial): BlockId[] {
  return (Object.entries(BLOCK_MATERIALS) as [BlockId, BlockMaterial[]][])
    .filter(([, materials]) => materials.includes(material))
    .map(([blockId]) => blockId);
}

export function getAvailableBlocksOfMaterial(
  blockFilter: BlockFilter,
  blockMaterial: BlockMaterial
): BlockId[] {
  const blocksOfMaterial = getAllBlocksOfMaterial(blockMaterial);

  const availableBlocksOfMaterial = (
    blocksOfMaterial.filter(
      block => !blockFilter.removeBlocks?.includes(block)
    )
  );

  return availableBlocksOfMaterial;
}

export function getAvailableBlocks(
  blockFilter: BlockFilter,
  blocksOfMaterial: BlockId[],
): BlockId[] {
  const availableBlocksOfMaterial = (
    blocksOfMaterial.filter(
      block => !blockFilter.removeBlocks?.includes(block)
    )
  );

  return availableBlocksOfMaterial;
}