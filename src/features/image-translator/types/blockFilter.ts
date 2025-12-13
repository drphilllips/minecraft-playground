import type { BlockId } from "./blockId"
import type { BlockMaterial } from "./blockMaterial";


export type BlockFilter = { materials?: BlockMaterial[], removeBlocks?: BlockId[] };