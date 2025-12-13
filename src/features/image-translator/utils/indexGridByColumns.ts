

export default function indexGridByColumns<T>(grid: T[][]): T[][] {
  if (!grid || grid.length === 0) return [];

  const maxCols = Math.max(...grid.map(row => row.length));
  const columns: T[][] = [];

  for (let c = 0; c < maxCols; c++) {
    const column: T[] = [];
    for (let r = 0; r < grid.length; r++) {
      // Only push if defined so ragged grids don't introduce undefined values
      if (c < grid[r].length) {
        column.push(grid[r][c]);
      }
    }
    columns.push(column);
  }

  return columns;
}