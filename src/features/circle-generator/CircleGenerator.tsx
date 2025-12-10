import { useMemo } from "react";
import IntegerInput from "../../components/IntegerInput";
import GridView from "../../components/GridView";
import useCircularGridView from "../../hooks/useCircularGridView";
import { FeatureContainer, FeatureOutputSummaryContainer } from "../../components/FeaturePage";
import { useResponsiveDesign } from "../../contexts/useResponsiveDesign";
import { generateCircleGrid } from "./utils/generateCircleGrid";
import { BLANK_CIRCLE_OUTPUT } from "../../constants/gridOutput";


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
    defaultDiameter: effectiveMaxDiameter/2,
  })

  const circleGrid = useMemo(() => {
    if (numericDiameter == null) return BLANK_CIRCLE_OUTPUT;
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
          grid={circleGrid.grid}
          blockSize={blockSize}
          width={effectiveGridMaxSize}
          height={effectiveGridMaxSize}
          magnifierEnabled={magnifierEnabled}
          zoomBlockSize={zoomBlockSize}
        />
      )}
      outputSummary={
        <FeatureOutputSummaryContainer>
          <p className="text-xl">Num Blocks: {circleGrid.num_edge_blocks}</p>
        </FeatureOutputSummaryContainer>
      }
    />
  )
}