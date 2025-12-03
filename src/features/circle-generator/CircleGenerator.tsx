import { useMemo } from "react";
import IntegerInput from "../../components/IntegerInput";
import GridView from "../../components/GridView";
import useCircularGridView from "../../hooks/useCircularGridView";
import { FeatureContainer } from "../../components/FeaturePage";
import { useResponsiveDesign } from "../../contexts/useResponsiveDesign";
import { generateCircleGrid } from "./utils/generateCircleGrid";


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
          key="diameter-input"
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