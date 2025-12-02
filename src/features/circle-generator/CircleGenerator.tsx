import { useMemo } from "react";
import { generateCircleGrid } from "./generateCircleGrid";
import IntegerInput from "../../components/IntegerInput";
import GridView from "../../components/GridView";
import useCircularGridView from "../../hooks/useCircularGridView";
import { useResponsiveDesign } from "../../hooks/useResponsiveDesign";
import FeatureContainer from "../../components/FeatureContainer";


export default function CircleGenerator() {
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
    <FeatureContainer
      inputFields={[
        // Diameter Input
        <IntegerInput
          label="Diameter (positive integer)"
          value={diameter}
          onChange={setDiameter}
          maxValue={effectiveMaxDiameter}
          maxReachedAlert={`${effectiveMaxDiameter} is the maximum diameter for this preview.`}
        />
      ]}
      outputDisplay={(
        <GridView
          grid={circleGrid}
          blockSize={blockSize}
          width={effectiveGridMaxSize}
          height={effectiveGridMaxSize}
          magnifierEnabled={magnifierEnabled}
          zoomBlockSize={zoomBlockSize}
        />
      )}
    />
  )
}