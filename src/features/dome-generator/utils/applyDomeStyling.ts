import { BLANK_CELL_STYLE, DOME_LEVEL_CENTER_LINE_STYLE, DOME_LEVEL_CENTER_OVERLAP_STYLE, DOME_LEVEL_EDGE_STYLE, DOME_OTHER_LEVEL_STYLE } from "../../../constants/gridCellStyles";
import type { CircularCellType } from "../../../types/circularStyle";


export default function applyDomeStyling(domeGrid: CircularCellType[][]): string[][] {
  const styledGrid: string[][] = domeGrid.map((row) =>
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