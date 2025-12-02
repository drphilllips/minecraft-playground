import type { CircularCellType, CircularOutputType } from "../../types/circularStyle";


export default function generateCircle(d: number, type: CircularOutputType): CircularCellType[][] {
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

  if (type === "filled") {
    const filled: CircularCellType[][] = inCircle.map(row => (
      row.map(cell => (
        cell ? "body" : "none"
      ))
    ))
    return filled;
  }

  // Second pass: mark edge cells only (no filled interior)
  const outline: CircularCellType[][] = [];
  for (let y = 0; y < size; y++) {
    const row: CircularCellType[] = [];
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
    outline.push(row);
  }

  if (type === "outline") {
    return outline;
  }

  // Third pass: overlay center lines (north-south and east-west)
  const centerLines = outline;
  if (size >= 2) {
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

        if (centerLines[y][x] === "edge") {
          continue;
        }

        if (onVertical && onHorizontal) {
          centerLines[y][x] = "centerOverlap";
        } else {
          centerLines[y][x] = "centerLine";
        }
      }
    }
  }

  return centerLines
}