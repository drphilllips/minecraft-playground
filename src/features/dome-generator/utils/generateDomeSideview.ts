import type { CircularCellType, CircularOutputType } from "../../../types/circularStyle";


export default function generateDomeSideview(
  dome: CircularCellType[][][],
  level: number,
  type: CircularOutputType
): CircularCellType[][] {
  const domeHeight = dome.length;
  if (domeHeight === 0) return [];

  const firstZ = dome[0];
  const depth = firstZ.length; // y dimension
  if (depth === 0) return [];

  const width = firstZ[0]?.length ?? 0; // x dimension
  if (width === 0) return [];

  // We want a cross-section through the *center* of the dome, like cutting it in half
  // and looking from the side. That means we take a single plane through the center in Y.
  // Use y = radius (middle-most slice). For even depths, this picks the upper of the two
  // central slices, which is fine for our side-view.
  const centerY = Math.floor(depth / 2);

  // Clamp level to valid z-range; this is the vertical layer currently selected.
  const currentLevel = Math.max(0, Math.min(level-1, domeHeight - 1));

  const sideview: CircularCellType[][] = [];

  // We want the *top* of the dome at the top of the sideview and the base at the bottom.
  // That means higher z-indices (near the top of the dome) should appear earlier (top rows)
  // in the returned 2D array.
  for (let outZ = 0; outZ < domeHeight; outZ++) {
    const z = domeHeight - 1 - outZ; // map output row index to actual dome z
    const row: CircularCellType[] = [];

    for (let x = 0; x < width; x++) {
      // Look only at the middle-most Y slice for this side-view
      const baseCell: CircularCellType =
        dome[z]?.[centerY]?.[x] ?? "none";

      let out: CircularCellType = "none";

      if (type === "filled") {
        // Only show solid body silhouette in sideview
        out = baseCell === "none" ? "none" : "body";
      } else if (type === "outline") {
        // Only show shell outline
        out = baseCell === "edge" ? "edge" : "none";
      } else {
        // Center-line style sideview:
        // - Shell outlined with "edge"
        // - Interior filled with "body"
        // - CenterLine / CenterOverlap visible only on the current vertical level
        if (baseCell === "edge") {
          out = "edge";
        } else if (z === currentLevel && (baseCell === "centerLine" || baseCell === "centerOverlap")) {
          out = baseCell;
        } else if (z !== currentLevel && (baseCell === "centerLine" || baseCell === "centerOverlap")) {
          out = "body";
        } else if (baseCell === "none") {
          // Any other non-empty cell is treated as solid body
          out = "none";
        } else {
          out = "none";
        }
      }

      row.push(out);
    }

    sideview.push(row);
  }

  return sideview;
}