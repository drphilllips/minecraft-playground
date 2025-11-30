import type { CircleCellType } from "../circle-generator/generateCircle";


export function removeGridPadding(grid: CircleCellType[][]) {
  if (!grid.length || !grid[0]?.length) return grid;

  const numRows = grid.length;
  const numCols = grid[0].length;

  let top = 0;
  let bottom = numRows - 1;
  let left = 0;
  let right = numCols - 1;

  // Helper to check if a row is entirely "none"
  const isRowNone = (rowIndex: number) => {
    const row = grid[rowIndex];
    return row.every((cell) => cell === "none");
  };

  // Helper to check if a column is entirely "none"
  const isColNone = (colIndex: number) => {
    for (let r = 0; r < numRows; r++) {
      if (grid[r][colIndex] !== "none") return false;
    }
    return true;
  };

  // Shrink top bound
  while (top <= bottom && isRowNone(top)) {
    top++;
  }

  // Shrink bottom bound
  while (bottom >= top && isRowNone(bottom)) {
    bottom--;
  }

  // Shrink left bound
  while (left <= right && isColNone(left)) {
    left++;
  }

  // Shrink right bound
  while (right >= left && isColNone(right)) {
    right--;
  }

  // If everything was padding (all "none"), just return the original grid
  if (top > bottom || left > right) {
    return grid;
  }

  const trimmed: CircleCellType[][] = [];
  for (let r = top; r <= bottom; r++) {
    trimmed.push(grid[r].slice(left, right + 1));
  }

  return trimmed;
}