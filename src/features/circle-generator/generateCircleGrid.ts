import { BLANK_CELL_STYLE, CIRCLE_CENTER_LINE_STYLE, CIRCLE_CENTER_OVERLAP_STYLE, CIRCLE_EDGE_STYLE } from "../../constants/gridCellStyles";

export function generateCircleGrid(d: number): string[][] {
  const size = Math.max(1, Math.floor(d));
  const r = size / 2;
  const inCircle: boolean[][] = [];

  // First pass: determine which cells are inside the circle
  for (let y = 0; y < size; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - r;
      const dy = y + 0.5 - r;
      const distSq = dx * dx + dy * dy;
      row.push(distSq <= r * r);
    }
    inCircle.push(row);
  }

  // Second pass: mark edge cells only (no filled interior)
  const grid: string[][] = [];
  for (let y = 0; y < size; y++) {
    const row: string[] = [];
    for (let x = 0; x < size; x++) {
      if (!inCircle[y][x]) {
        row.push("none");
        continue;
      }

      // Check 4-neighbors; if any neighbor is outside the circle, this is an edge.
      const neighbors: [number, number][] = [
        [y - 1, x],
        [y + 1, x],
        [y, x - 1],
        [y, x + 1],
      ];

      let isEdge = false;
      for (const [ny, nx] of neighbors) {
        if (ny < 0 || ny >= size || nx < 0 || nx >= size) {
          isEdge = true;
          break;
        }
        if (!inCircle[ny][nx]) {
          isEdge = true;
          break;
        }
      }

      row.push(isEdge ? "edge" : "none");
    }
    grid.push(row);
  }

  // Third pass: overlay center lines (north-south and east-west)
  if (size >= 5) {
    const isEven = size % 2 === 0;
    const centerCols: number[] = [];
    const centerRows: number[] = [];

    if (isEven) {
      centerCols.push(size / 2 - 1, size / 2);
      centerRows.push(size / 2 - 1, size / 2);
    } else {
      centerCols.push(Math.floor(size / 2));
      centerRows.push(Math.floor(size / 2));
    }

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!inCircle[y][x]) continue;

        const onVertical = centerCols.includes(x);
        const onHorizontal = centerRows.includes(y);

        if (!onVertical && !onHorizontal) continue;

        if (grid[y][x] === "edge") {
          continue;
        }

        if (onVertical && onHorizontal) {
          grid[y][x] = "centerOverlap";
        } else {
          grid[y][x] = "centerLine";
        }
      }
    }
  }

  // Final pass: convert semantic cell types into Tailwind class strings
  const styledGrid: string[][] = grid.map((row) =>
    row.map((cell) => {
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