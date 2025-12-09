import type { BlockId } from "../features/image-translator/types/blockId";
import type { MinecraftBlock } from "../features/image-translator/types/minecraftBlock";
import type { CircularCellType } from "./circularStyle";


export type GenerateCircleOutput = { grid: string[][] | CircularCellType[][], num_edge_blocks: number }
export type GenerateDomeOutput = { space: string[][][] | CircularCellType[][][], num_edge_blocks: number }
export type GenerateImageOutput = { grid: string[][] | MinecraftBlock[][], block_summary: BlockSummary }

export type BlockSummary = Partial<Record<BlockId, number>>;