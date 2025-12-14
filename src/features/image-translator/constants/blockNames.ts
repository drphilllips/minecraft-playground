import { BLOCK_IDS, type BlockId } from "../types/blockId";
import formatIdToName from "../utils/formatIdToName";

export const BLOCK_NAMES: Record<BlockId, string> = Object.fromEntries(
  (BLOCK_IDS as readonly BlockId[]).map((id) => [id, formatIdToName(id)])
) as Record<BlockId, string>;