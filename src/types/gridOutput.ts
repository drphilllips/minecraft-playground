import type { BlockId } from "../features/image-translator/types/blockId";
import type { MinecraftBlock } from "../features/image-translator/types/minecraftBlock";
import type { CircularCellType } from "./circularStyle";


export type GenerateCircleOutput = { grid: string[][] | CircularCellType[][], num_edge_blocks: number, unstyled?: CircularCellType[][] }
export type GenerateDomeOutput = { space: string[][][] | CircularCellType[][][], num_edge_blocks: number, unstyled?: CircularCellType[][][] }
export type GenerateImageOutput = { grid: string[][] | MinecraftBlock[][], block_summary: BlockSummary }

export type RemoveEmptyOutput = { grid: CircularCellType[][], maxRemoved: number }

export type BlockSummary = Partial<Record<BlockId, number>>;