import type { CircleCellType } from "../circle-generator/generateCircle";
import padCircleGrid from "./padCircleGrid";
import { removeGridPadding } from "./removeGridPadding";


export default function fillNegativeSpace(prevLevel: CircleCellType[][] | null, thisLevel: CircleCellType[][]): CircleCellType[][] {
  if (prevLevel == null) {
    return thisLevel;
  }

  const paddedThisLevel = padCircleGrid(prevLevel.length, thisLevel);

  console.log("PREV", prevLevel);
  console.log("THIS", thisLevel);
  console.log("PADDED", paddedThisLevel);

  const size = prevLevel.length;
  for (let y = 0; y < size; y++) {
    const prevLevelRow: CircleCellType[] = prevLevel[y];
    const thisLevelRow: CircleCellType[] = paddedThisLevel[y];

    // Find the outer (previous) circle's left and right edge indices
    const prevLeft = prevLevelRow.findIndex((cell) => cell === "edge");
    const prevRight = prevLevelRow.lastIndexOf("edge");

    // If this row of the previous level has no span, skip it
    if (prevLeft === -1 || prevRight === -1 || prevLeft === prevRight) {
      continue;
    }

    // Find the inner (this) level's left and right edge indices, if any
    const thisLeft = thisLevelRow.findIndex((cell) => cell === "edge");
    const thisRight = thisLevelRow.lastIndexOf("edge");

    for (let x = 0; x < size; x++) {
      const insidePrev = x > prevLeft && x < prevRight;
      const outsideThis =
        thisLeft === -1 || thisRight === -1
          ? true
          : x < thisLeft || x > thisRight;

      if (insidePrev && outsideThis && prevLevelRow[x] === "none" && thisLevelRow[x] === "none") {
        paddedThisLevel[y][x] = "edge";
      }
    }
  }

  const newThisLevel = removeGridPadding(paddedThisLevel);

  console.log("DONE", newThisLevel);

  return newThisLevel;
}