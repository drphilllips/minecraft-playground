import { BLOCK_MATERIAL_IDS, type BlockMaterial } from "../types/blockMaterial";
import formatIdToName from "../utils/formatIdToName";


export const MATERIAL_NAMES: Record<BlockMaterial, string> = Object.fromEntries(
  (Object.values(BLOCK_MATERIAL_IDS) as readonly BlockMaterial[]).map((id) => [id, formatIdToName(id)])
) as Record<BlockMaterial, string>;