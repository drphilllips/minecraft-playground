import { CIRCLE_CELL_STYLING } from "../../../constants/gridCellStyles";
import type { CircularCellType } from "../../../types/circularStyle";
import type { GenerateCircleOutput } from "../../../types/gridOutput";
import applyCircularCellStyling from "../../../utils/applyCircularCellStyling";
import generateCircle from "./generateCircle";


export function generateCircleGrid(d: number): GenerateCircleOutput {
  const circleWithCenterLines = generateCircle(d, "centerLines");

  // Final pass: convert semantic cell types into Tailwind class strings
  const styledGrid = applyCircularCellStyling(
    circleWithCenterLines.grid as CircularCellType[][],
    CIRCLE_CELL_STYLING
  );

  return {
    grid: styledGrid,
    num_edge_blocks: circleWithCenterLines.num_edge_blocks,
    unstyled: circleWithCenterLines.grid as CircularCellType[][]
  };
}