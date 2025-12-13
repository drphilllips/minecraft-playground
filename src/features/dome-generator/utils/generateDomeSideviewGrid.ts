import { DOME_CELL_STYLING } from "../../../constants/gridCellStyles";
import type { CircularCellType } from "../../../types/circularStyle";
import type { GenerateCircleOutput } from "../../../types/gridOutput";
import applyCircularCellStyling from "../../../utils/applyCircularCellStyling";
import generateDomeSideview from "./generateDomeSideview";


export default function generateDomeSideviewGrid(dome: CircularCellType[][][], level: number): GenerateCircleOutput {
  const domeSideview = generateDomeSideview(dome, level, "centerLines");

  const styledGrid = applyCircularCellStyling(domeSideview, DOME_CELL_STYLING);

  return { grid: styledGrid, num_edge_blocks: 0 };
}