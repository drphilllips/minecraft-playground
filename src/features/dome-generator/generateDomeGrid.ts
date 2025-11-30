import { BLANK_CELL_STYLE, DOME_LEVEL_EDGE_STYLE, DOME_LEVEL_CENTER_LINE_STYLE, DOME_LEVEL_CENTER_OVERLAP_STYLE, DOME_OTHER_LEVEL_STYLE } from "../../constants/gridCellStyles";
import generateCircle from "../circle-generator/generateCircle";
import generateDome from "./generateDome";
import overlayDomeLevelSlice from "./overlayDomeLevelSlice";


export function generateDomeGrid(d: number, level: number): string[][] {
  const dome = generateDome(d, "centerLines");
  const base = generateCircle(d, "filled");
  const domeLevel = overlayDomeLevelSlice(base, dome[level-1])

  const styledGrid: string[][] = domeLevel.map((row) =>
    row.map(cell => {
      let cellClasses = "border ";
      if (cell === "body") {
        cellClasses += DOME_OTHER_LEVEL_STYLE;
      } else if (cell === "edge") {
        cellClasses += DOME_LEVEL_EDGE_STYLE;
      } else if (cell === "centerLine") {
        cellClasses += DOME_LEVEL_CENTER_LINE_STYLE;
      } else if (cell === "centerOverlap") {
        cellClasses += DOME_LEVEL_CENTER_OVERLAP_STYLE;
      } else {
        cellClasses += BLANK_CELL_STYLE;
      }
      return cellClasses;
    })
  );

  return styledGrid;
}