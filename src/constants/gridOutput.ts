import type { GenerateCircleOutput, GenerateDomeOutput, GenerateImageOutput } from "../types/gridOutput";

export const BLANK_CIRCLE_OUTPUT: GenerateCircleOutput = {
  grid: [],
  num_edge_blocks: 0,
}

export const BLANK_DOME_OUTPUT: GenerateDomeOutput = {
  space: [],
  num_edge_blocks: 0,
}

export const BLANK_IMAGE_OUTPUT: GenerateImageOutput = {
  grid: [],
  block_summary: {},
}