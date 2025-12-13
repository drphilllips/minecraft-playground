import type { MinecraftBlock } from "../features/image-translator/types/minecraftBlock";
import type { CircularCellType } from "../types/circularStyle";


export default function calculateInstructionsNumSteps(grid: CircularCellType[][] | MinecraftBlock[][]): number {
  const width = grid[0].length;
  const height = grid.length;
  const diameter = Math.max(width, height);

  if (width === height) {
    return Math.ceil(diameter / 2)+1;
  } else {
    return diameter;
  }
}