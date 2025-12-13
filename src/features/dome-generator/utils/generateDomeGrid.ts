import { DOME_CELL_STYLING } from "../../../constants/gridCellStyles";
import type { CircularCellType } from "../../../types/circularStyle";
import type { GenerateCircleOutput } from "../../../types/gridOutput";
import applyCircularCellStyling from "../../../utils/applyCircularCellStyling";
import { countEdgeCells } from "../../../utils/outputSummary";
import generateCircle from "../../circle-generator/utils/generateCircle";
import overlayDomeLevelSlice from "./overlayDomeLevelSlice";


export function generateDomeGrid(dome: CircularCellType[][][], level: number): GenerateCircleOutput {
  const d = dome[0].length;
  const base = generateCircle(d, "filled");
  const domeLevel = dome[level-1];
  const overlayLevel = overlayDomeLevelSlice(base.grid as CircularCellType[][], domeLevel);

  const styledGrid = applyCircularCellStyling(overlayLevel, DOME_CELL_STYLING);

  return {
    grid: styledGrid,
    num_edge_blocks: countEdgeCells(domeLevel),
    unstyled: overlayLevel,
  };
}