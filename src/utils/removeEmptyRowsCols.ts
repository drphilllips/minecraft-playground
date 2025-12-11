import type { CircularCellType } from "../types/circularStyle";
import type { RemoveEmptyOutput } from "../types/gridOutput";


export default function removeEmptyRowsCols(grid: CircularCellType[][], emptyDef: CircularCellType[]=["none"]): RemoveEmptyOutput {
  let maxRemoved = 0;

  // If grid is empty, return as-is
  if (grid.length === 0) return { grid, maxRemoved };

  // 1. Remove empty rows (rows where every cell is "none")
  const filteredRows = grid.filter((row) =>
    row.some((cell) => !emptyDef.includes(cell))
  );

  if (filteredRows.length === 0) {
    const rowsRemoved = grid.length;
    maxRemoved = rowsRemoved;
    return { grid: [], maxRemoved };
  }

  const rowsRemoved = grid.length - filteredRows.length;

  // 2. Remove empty columns.
  // Determine which column indices contain at least one non-"none" cell.
  const numCols = filteredRows[0].length;

  const usedCols: boolean[] = Array.from({ length: numCols }, (_, colIdx) =>
    filteredRows.some((row) => !emptyDef.includes(row[colIdx]))
  );

  const colsRemoved = numCols - usedCols.filter((v) => v).length;

  // 3. Construct the new trimmed grid
  const trimmedGrid = filteredRows.map((row) =>
    row.filter((_, colIdx) => usedCols[colIdx])
  );

  maxRemoved = Math.max(rowsRemoved, colsRemoved);
  return { grid: trimmedGrid, maxRemoved };
}