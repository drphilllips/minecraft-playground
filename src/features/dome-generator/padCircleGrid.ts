import type { CircleCellType } from "../circle-generator/generateCircle";


export default function padCircleGrid(d: number, grid: CircleCellType[][]): CircleCellType[][] {
  // Determine current dimensions
  const currentHeight = grid.length;
  const currentWidth = grid[0]?.length ?? 0;

  // If already at or above target size in both dimensions, return unchanged
  if (currentWidth >= d && currentHeight >= d) {
    return grid;
  }

  // Compute horizontal padding
  const totalColPad = Math.max(0, d - currentWidth);
  const padLeft = Math.floor(totalColPad / 2);
  const padRight = Math.ceil(totalColPad / 2);

  // Compute vertical padding
  const totalRowPad = Math.max(0, d - currentHeight);
  const padTop = Math.floor(totalRowPad / 2);
  const padBottom = Math.ceil(totalRowPad / 2);

  // Create an empty row
  const emptyRow = Array(padLeft + currentWidth + padRight).fill("none" as CircleCellType);

  // Pad rows horizontally
  const paddedRows = grid.map((row) => {
    const left = Array(padLeft).fill("none" as CircleCellType);
    const right = Array(padRight).fill("none" as CircleCellType);
    return [...left, ...row, ...right];
  });

  // Add vertical padding
  const topRows = Array.from({ length: padTop }, () => [...emptyRow]);
  const bottomRows = Array.from({ length: padBottom }, () => [...emptyRow]);

  console.log("PADDED", d, grid, [...topRows, ...paddedRows, ...bottomRows]);

  return [...topRows, ...paddedRows, ...bottomRows];
}