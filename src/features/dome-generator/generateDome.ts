import type { CircularCellType, CircularOutputType } from "../../types/circularStyle";

export default function generateDome(d: number, type: CircularOutputType): CircularCellType[][][] {
  const r = d / 2;

  // We only need the upper hemisphere of the sphere to form the dome.
  // `hemisphereStart` is the first z-index where dz >= 0 in the original
  // full-sphere coordinate system.
  const hemisphereStart = Math.floor(r);

  // We keep one extra slice *below* the base of the dome so that neighbor
  // checks for the lowest dome level still "see" the sphere interior that
  // sits underneath the base. This preserves the original shell behavior
  // without needing the entire lower half of the sphere.
  const regionHeight = d - hemisphereStart + 1; // includes one slice below base
  const domeHeight = regionHeight - 1; // number of visible dome levels

  // inRegion[z][y][x]
  // z = 0         -> globalZ = hemisphereStart - 1 (one slice below dome base)
  // z = 1..end    -> globalZ = hemisphereStart .. d - 1 (actual dome levels)
  const inRegion: boolean[][][] = [];

  for (let z = 0; z < regionHeight; z++) {
    const globalZ = hemisphereStart - 1 + z;
    const levelSlice: boolean[][] = [];

    for (let y = 0; y < d; y++) {
      const row: boolean[] = [];

      for (let x = 0; x < d; x++) {
        const dx = x + 0.5 - r;
        const dy = y + 0.5 - r;
        const dz = globalZ + 0.5 - r;

        const distSq = dx * dx + dy * dy + dz * dz;
        const insideSphere = distSq <= r * r;
        row.push(insideSphere);
      }

      levelSlice.push(row);
    }

    inRegion.push(levelSlice);
  }

  // Helper to check if a (dome-space) coordinate is inside the sphere.
  // Dome-space z runs 0..domeHeight-1 and maps to inRegion[z+1].
  const isInside = (z: number, y: number, x: number): boolean => {
    if (y < 0 || y >= d || x < 0 || x >= d) return false;

    const regionZ = z + 1; // shift up by 1 to skip the below-base slice
    if (regionZ < 0 || regionZ >= regionHeight) return false;

    return inRegion[regionZ][y][x];
  };

  // First visible pass: filled body of the dome
  const filled: CircularCellType[][][] = [];

  for (let z = 0; z < domeHeight; z++) {
    const levelSlice: CircularCellType[][] = [];

    for (let y = 0; y < d; y++) {
      const row: CircularCellType[] = [];

      for (let x = 0; x < d; x++) {
        row.push(isInside(z, y, x) ? "body" : "none");
      }

      levelSlice.push(row);
    }

    filled.push(levelSlice);
  }

  if (type === "filled") {
    return filled;
  }

  // Second pass: shell (outline) using 3D neighbors, but only over
  // the dome-sized volume (z = 0..domeHeight-1).
  const shell = filled.map(levelSlice =>
    levelSlice.map(row => [...row])
  );

  for (let z = 0; z < domeHeight; z++) {
    for (let y = 0; y < d; y++) {
      for (let x = 0; x < d; x++) {
        if (!isInside(z, y, x)) continue;

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
          if (!isInside(nz, ny, nx)) {
            isShell = true;
            break;
          }
        }

        if (isShell) {
          shell[z][y][x] = "edge";
        }
      }
    }
  }

  if (type === "outline") {
    return shell;
  }

  // Third pass: center lines over the shell, sized to the dome volume.
  const centerLines: CircularCellType[][][] = shell.map(levelSlice =>
    levelSlice.map(row => [...row])
  );

  if (d >= 2) {
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

    for (let z = 0; z < domeHeight; z++) {
      for (let y = 0; y < d; y++) {
        for (let x = 0; x < d; x++) {
          if (!isInside(z, y, x)) continue;

          const onVertical = centerCols.includes(x);
          const onHorizontal = centerRows.includes(y);

          if (!onVertical && !onHorizontal) continue;

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

  return centerLines;
}