import type { CircularCellType, CircularOutputType } from "../../types/circularStyle";


export default function generateDome(d: number, type: CircularOutputType): CircularCellType[][][] {
  const r = d / 2;
  const inSphere: boolean[][][] = [];

  // First pass: determine which cells are inside the dome (upper hemisphere of a sphere)
  for (let z = 0; z < d; z++) {
    const levelSlice: boolean[][] = [];
    for (let y = 0; y < d; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < d; x++) {
        const dx = x + 0.5 - r;
        const dy = y + 0.5 - r;
        const dz = z + 0.5 - r;

        const distSq = dx * dx + dy * dy + dz * dz;
        const insideSphere = distSq <= r * r;

        // Dome: only keep the upper hemisphere (dz >= 0)
        row.push(insideSphere);
      }
      levelSlice.push(row);
    }
    inSphere.push(levelSlice);
  }

  const filled: CircularCellType[][][] = inSphere.map(levelSlice => (
    levelSlice.map(row => (
      row.map(cell => cell ? "body" : "none")
    ))
  ))

  if (type === "filled") {
    return filled.slice(r, d);
  }

  // Second pass: mark shell cells only (no filled interior), using 3D neighbors
  const shell: CircularCellType[][][] = [];
  for (let z = 0; z < d; z++) {
    const levelSlice: CircularCellType[][] = [];
    for (let y = 0; y < d; y++) {
      const row: CircularCellType[] = [];
      for (let x = 0; x < d; x++) {
        if (!inSphere[z][y][x]) {
          row.push("none");
          continue;
        }
        // Check 6-neighbors in 3D; if any neighbor is outside the dome, this is a shell cell.
        const neighbors: [number, number, number][] = [
          [z - 1, y, x],
          [z + 1, y, x],
          [z, y - 1, x],
          [z, y + 1, x],
          [z, y, x - 1],
          [z, y, x + 1],
        ];

        let isShell = false;
        for (const [nz, ny, nx] of neighbors) {
          if (nz < 0 || nz >= d || ny < 0 || ny >= d || nx < 0 || nx >= d) {
            isShell = true;
            break;
          }
          if (!inSphere[nz][ny][nx]) {
            isShell = true;
            break;
          }
        }
        row.push(isShell ? "edge" : "none");
      }
      levelSlice.push(row);
    }
    shell.push(levelSlice);
  }

  // After the outline case:
  if (type === "outline") {
    return shell.slice(r, d);
  }

  // Third pass: overlay center lines (north-south and east-west) for each level
  // Start from the shell as the base (like outline in generateCircle)
  const centerLines: CircularCellType[][][] = shell.map(levelSlice =>
    levelSlice.map(row => [...row])
  );

  if (d >= 5) {
    const isEven = d % 2 === 0;
    const centerCols: number[] = [];
    const centerRows: number[] = [];

    if (isEven) {
      centerCols.push(d / 2 - 1, d / 2);
      centerRows.push(d / 2 - 1, d / 2);
    } else {
      centerCols.push(Math.floor(d / 2));
      centerRows.push(Math.floor(d / 2));
    }

    for (let z = 0; z < d; z++) {
      for (let y = 0; y < d; y++) {
        for (let x = 0; x < d; x++) {
          // Only consider cells actually inside the sphere
          if (!inSphere[z][y][x]) continue;

          const onVertical = centerCols.includes(x);
          const onHorizontal = centerRows.includes(y);

          if (!onVertical && !onHorizontal) continue;

          // Don't overwrite shell edges
          if (centerLines[z][y][x] === "edge") {
            continue;
          }

          if (onVertical && onHorizontal) {
            centerLines[z][y][x] = "centerOverlap";
          } else {
            centerLines[z][y][x] = "centerLine";
          }
        }
      }
    }
  }

  // For center-line style, return only the upper hemisphere levels
  return centerLines.slice(r, d);
}