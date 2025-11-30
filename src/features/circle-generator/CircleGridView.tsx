import { useMemo } from "react";
import { generateCircleGrid } from "./generateCircleGrid";
import IntegerInput from "../../components/IntegerInput";
import GridView from "../../components/GridView";
import useCircularGridView from "../../hooks/useCircularGridView";


export default function CircleGridView({
  maxDiameter,
  maxSize,
}: {
  maxDiameter: number;
  maxSize: number;
}) {

  const {
    diameter,
    setDiameter,
    numericDiameter,
    blockSize,
    magnifierEnabled,
  } = useCircularGridView({
    defaultDiameter: 7,
    maxDiameter: 100,
    gridMaxSize: maxSize,
    enableMagnifierDiameter: 40,
  })

  const circleGrid = useMemo(() => {
    if (numericDiameter == null) return [];
    return generateCircleGrid(numericDiameter);
  }, [numericDiameter]);

  return (
    <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700">
      {/* Diameter Input */}
      <IntegerInput
        label="Diameter (positive integer)"
        value={diameter}
        onChange={setDiameter}
        maxValue={maxDiameter}
        maxReachedAlert={`${maxDiameter} is the maximum value for this preview.`}
      />

      {/* Circle Grid */}
      <div className="mt-6 flex">
        <div className="flex rounded-2xl border border-slate-700 bg-slate-950/80 p-3">
          {circleGrid.length === 0 ? (
            <p className="text-xs text-slate-400">
              No diameter entered. Please type a positive number to generate a circle grid.
            </p>
          ) : (
            <GridView
              grid={circleGrid}
              blockSize={blockSize}
              width={maxSize}
              height={maxSize}
              magnifierEnabled={magnifierEnabled}
            />
          )}
        </div>
      </div>
    </div>
  )
}