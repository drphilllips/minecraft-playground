import type { CircularCellStyling, CircularCellType } from "../types/circularStyle";


export default function applyCircularCellStyling(domeGrid: CircularCellType[][], cellStyling: CircularCellStyling): string[][] {
  const styledGrid: string[][] = domeGrid.map((row) =>
    row.map(cell => {
      let cellClasses = "border ";
      cellClasses += cellStyling[cell];
      return cellClasses;
    })
  );
  return styledGrid;
}