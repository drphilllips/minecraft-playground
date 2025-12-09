import type { CircularCellType } from "../../../types/circularStyle";
import type { GenerateCircleOutput } from "../../../types/gridOutput";
import applyDomeStyling from "./applyDomeStyling";
import generateDomeSideview from "./generateDomeSideview";


export default function generateDomeSideviewGrid(dome: CircularCellType[][][], level: number): GenerateCircleOutput {
  const domeSideview = generateDomeSideview(dome, level, "centerLines");

  const styledGrid = applyDomeStyling(domeSideview);

  return { grid: styledGrid, num_edge_blocks: 0 };
}