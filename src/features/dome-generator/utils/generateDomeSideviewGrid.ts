import type { CircularCellType } from "../../../types/circularStyle";
import applyDomeStyling from "./applyDomeStyling";
import generateDomeSideview from "./generateDomeSideview";


export default function generateDomeSideviewGrid(dome: CircularCellType[][][], level: number): string[][] {
  const domeSideview = generateDomeSideview(dome, level, "centerLines");

  const styledGrid = applyDomeStyling(domeSideview);

  return styledGrid;
}