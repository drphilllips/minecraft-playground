import type { CircularCellType } from "../types/circularStyle";

export function countEdgeCells(grid: CircularCellType[][]): number;
export function countEdgeCells(space: CircularCellType[][][]): number;

// Implementation (must cover both cases)
export function countEdgeCells(
  input: CircularCellType[][] | CircularCellType[][][]
): number {
  // Case 1: 2D grid
  if (Array.isArray(input[0]) && !Array.isArray(input[0][0])) {
    const grid = input as CircularCellType[][];
    return grid.flat().filter((c) => c === "edge").length;
  }

  // Case 2: 3D space (array of grids)
  const space = input as CircularCellType[][][];
  return space.reduce((sum, grid) => {
    return sum + grid.flat().filter((c) => c === "edge").length;
  }, 0);
}