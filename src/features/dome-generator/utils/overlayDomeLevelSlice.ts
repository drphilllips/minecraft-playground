import type { CircularCellType } from "../../../types/circularStyle";


export default function overlayDomeLevelSlice(base: CircularCellType[][], levelSlice: CircularCellType[][]): CircularCellType[][] {
  const overlay: CircularCellType[][] = base.map(row => [...row]);

  for (let y = 0; y < base.length; y++) {
    for (let x = 0; x < base[0].length; x++) {
      const levelCell = levelSlice[y][x]
      if (levelCell === "edge" || levelCell === "centerLine" || levelCell === "centerOverlap") {
        overlay[y][x] = levelCell;
      }
    }
  }

  return overlay;
}