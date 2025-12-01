import { useMemo } from "react";
import { generateCircleGrid } from "./generateCircleGrid";
import IntegerInput from "../../components/IntegerInput";
import GridView from "../../components/GridView";
import useCircularGridView from "../../hooks/useCircularGridView";
import Separator from "../../components/Separator";
import { useResponsiveDesign } from "../../hooks/useResponsiveDesign";


export default function CircleGridView() {
  const { effectiveMaxDiameter, effectiveGridMaxSize } = useResponsiveDesign()

  const {
    diameter,
    setDiameter,
    numericDiameter,
    blockSize,
    magnifierEnabled,
    zoomBlockSize,
  } = useCircularGridView({
    maxDiameter: effectiveMaxDiameter,
    gridMaxSize: effectiveGridMaxSize,
  })

  const circleGrid = useMemo(() => {
    if (numericDiameter == null) return [];
    return generateCircleGrid(numericDiameter);
  }, [numericDiameter]);

  return (
    <div className="flex flex-col gap-3 bg-slate-800/40 rounded-2xl p-6 border border-slate-700">
      {/* Diameter Input */}
      <IntegerInput
        label="Diameter (positive integer)"
        value={diameter}
        onChange={setDiameter}
        maxValue={effectiveMaxDiameter}
        maxReachedAlert={`${effectiveMaxDiameter} is the maximum value for this preview.`}
      />

      <div className="flex flex-col gap-3 w-fit">
        <Separator className="w-full" />

        {/* Circle Grid */}
        <GridView
          grid={circleGrid}
          blockSize={blockSize}
          width={effectiveGridMaxSize}
          height={effectiveGridMaxSize}
          magnifierEnabled={magnifierEnabled}
          zoomBlockSize={zoomBlockSize}
        />
      </div>
    </div>
  )
}