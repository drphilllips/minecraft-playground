import generateCircle from "../circle-generator/generateCircle";
import calculateLevelDiameter from "./calculateLevelDiameter";
import fillNegativeSpace from "./fillNegativeSpace";


export default function generateDome(d: number, level: number) {
  const thisLevelDiameter = calculateLevelDiameter(d, level);
  const previousLevelDiameter = calculateLevelDiameter(d, level-1);

  // Generate overall circle and this level's circle
  const allLevels = generateCircle(d, "filled");
  const prevLevel = level > 1 ? generateCircle(previousLevelDiameter, "outline") : null;
  const thisLevel = generateCircle(thisLevelDiameter, "centerLines");
  const completeThisLevel = fillNegativeSpace(prevLevel, thisLevel);

  // Copy this level over the center of the allLevels backdrop
  const completeThisLevelDiameter = completeThisLevel.length
  const allCenter = Math.floor(d / 2);
  const levelCenter = Math.floor(completeThisLevelDiameter / 2);

  const rowOffset = allCenter - levelCenter;
  const colOffset = allCenter - levelCenter;

  // Overlay thisLevel onto the center of allLevels
  for (let r = 0; r < completeThisLevelDiameter; r++) {
    for (let c = 0; c < completeThisLevelDiameter; c++) {
      const cell = completeThisLevel[r][c];

      // Adjust this condition to whatever your "blank" sentinel is.
      if (cell === "none") continue;

      const targetRow = rowOffset + r;
      const targetCol = colOffset + c;

      // Safety: make sure we stay inside the main grid
      if (
        targetRow < 0 ||
        targetRow >= allLevels.length ||
        targetCol < 0 ||
        targetCol >= allLevels[0].length
      ) {
        continue;
      }

      allLevels[targetRow][targetCol] = cell;
    }
  }

  return allLevels;
}