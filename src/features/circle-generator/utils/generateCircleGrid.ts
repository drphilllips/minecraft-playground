import { BLANK_CELL_STYLE, CIRCLE_CENTER_LINE_STYLE, CIRCLE_CENTER_OVERLAP_STYLE, CIRCLE_EDGE_STYLE } from "../../../constants/gridCellStyles";
import generateCircle from "./generateCircle";


export function generateCircleGrid(d: number): string[][] {
  const circleWithCenterLines = generateCircle(d, "centerLines");

  // Final pass: convert semantic cell types into Tailwind class strings
  const styledGrid: string[][] = circleWithCenterLines.map((row) =>
    row.map(cell => {
      let cellClasses = "border ";
      if (cell === "edge") {
        cellClasses += CIRCLE_EDGE_STYLE;
      } else if (cell === "centerLine") {
        cellClasses += CIRCLE_CENTER_LINE_STYLE;
      } else if (cell === "centerOverlap") {
        cellClasses += CIRCLE_CENTER_OVERLAP_STYLE;
      } else {
        cellClasses += BLANK_CELL_STYLE;
      }
      return cellClasses;
    })
  );

  return styledGrid;
}