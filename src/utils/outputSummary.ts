import type { CircularCellType } from "../types/circularStyle";

export function countEdgeCells(line: CircularCellType[]): number;
export function countEdgeCells(grid: CircularCellType[][]): number;
export function countEdgeCells(space: CircularCellType[][][]): number;

// Implementation (must cover both cases)
export function countEdgeCells(
  input: CircularCellType[] | CircularCellType[][] | CircularCellType[][][]
): number {
  // Case 1: 1D array
  if (!Array.isArray(input[0])) {
    const line = input as CircularCellType[];
    return line.filter((c) => c === "edge").length;
  }

  // Case 2: 2D grid
  const maybeGrid = input as CircularCellType[][];
  if (Array.isArray(maybeGrid[0]) && typeof maybeGrid[0][0] === "string") {
    const grid = input as CircularCellType[][];
    return grid.flat().filter((c) => c === "edge").length;
  }

  // Case 3: 3D space (array of grids)
  const space = input as CircularCellType[][][];
  return space.reduce((sum, grid) => {
    return sum + grid.flat().filter((c) => c === "edge").length;
  }, 0);
}