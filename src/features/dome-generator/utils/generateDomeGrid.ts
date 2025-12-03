import type { CircularCellType } from "../../../types/circularStyle";
import generateCircle from "../../circle-generator/utils/generateCircle";
import applyDomeStyling from "./applyDomeStyling";
import overlayDomeLevelSlice from "./overlayDomeLevelSlice";


export function generateDomeGrid(dome: CircularCellType[][][], level: number): string[][] {
  const d = dome[0].length;
  const base = generateCircle(d, "filled");
  const domeLevel = dome[level-1];
  const overlayLevel = overlayDomeLevelSlice(base, domeLevel);

  const styledGrid = applyDomeStyling(overlayLevel);

  return styledGrid;
}