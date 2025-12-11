import type { FullInstructions, StepInstruction } from "../types/blueprintInstruction";
import type { CircularCellStyling, CircularCellType } from "../types/circularStyle";
import applyCircularCellStyling from "./applyCircularCellStyling";
import calculateInstructionsNumSteps from "./calculateInstructionsNumSteps";
import { countEdgeCells } from "./outputSummary";
import removeEmptyRowsCols from "./removeEmptyRowsCols";


export default function generateCircularInstructions(grid: CircularCellType[][], cellStyling: CircularCellStyling, entity: "circle" | "dome-level"): FullInstructions {
  const { grid: cleanedGrid, maxRemoved} = removeEmptyRowsCols(grid, ["body", "none"])
  const bodyOffset = maxRemoved/2;
  const totalSteps = calculateInstructionsNumSteps(cleanedGrid);
  const cumulativeGrid: CircularCellType[][] = [];
  const stepInstructions: StepInstruction[] = []

  for (let i = 0; i < totalSteps-1; i++) {
    const row = grid[i+bodyOffset];
    const secondHalfOfRow = row.slice(Math.floor(row.length / 2))
    cumulativeGrid.push(secondHalfOfRow);

    const step = i+1;
    const numBlocksToPlace = (
      i === 0 ? countEdgeCells(row) : countEdgeCells(secondHalfOfRow)
    )
    const instructionString = (
      i === 0
      ? (bodyOffset > 0
          ? `Place ${numBlocksToPlace} block${numBlocksToPlace === 1 ? "" : "s"} in a row, offset ${bodyOffset} from the top, as shown below.`
          : `Place ${numBlocksToPlace} block${numBlocksToPlace === 1 ? "" : "s"} in a row, as shown below.`
        )
      : `Place ${numBlocksToPlace} block${numBlocksToPlace === 1 ? "" : "s"} in row ${step}, as shown below.`
    )
    const row1Grid = [...grid].slice(0, bodyOffset)
    row1Grid.push(row)
    const unstyledStepGrid = (
      i === 0
      ? removeEmptyRowsCols(bodyOffset > 0 ? row1Grid : [row]).grid
      : removeEmptyRowsCols(cumulativeGrid, ["body", "none"]).grid
    )
    const stepGrid = (
      applyCircularCellStyling(unstyledStepGrid, cellStyling)
    )

    stepInstructions.push({
      step, stepGrid, instructionString
    });
  }
  stepInstructions.push({
    step: totalSteps,
    stepGrid: stepInstructions[stepInstructions.length-1].stepGrid,
    instructionString: `Excellent! Now copy the pattern three more times to complete the ${entity}.`
  });

  return { stepInstructions, totalSteps };
}