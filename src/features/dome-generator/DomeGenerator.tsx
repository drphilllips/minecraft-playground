import { useMemo } from "react";
import GridView from "../../components/GridView";
import IntegerInput from "../../components/IntegerInput";
import useCircularGridView from "../../hooks/useCircularGridView";
import IntegerSlider from "../../components/IntegerSlider";
import InputField from "../../components/InputField";
import { FeatureContainer } from "../../components/FeaturePage";
import { useResponsiveDesign } from "../../contexts/useResponsiveDesign";
import generateDome from "./utils/generateDome";
import { generateDomeGrid } from "./utils/generateDomeGrid";
import generateDomeSideviewGrid from "./utils/generateDomeSideviewGrid";


export default function DomeGenerator() {
  const { effectiveMaxDiameter, effectiveGridMaxSize } = useResponsiveDesign()

  const {
    diameter,
    setDiameter,
    numericDiameter,
    level,
    setLevel,
    numericLevel,
    blockSize,
    magnifierEnabled,
    zoomBlockSize,
  } = useCircularGridView({
    maxDiameter: effectiveMaxDiameter,
    gridMaxSize: effectiveGridMaxSize,
  })

  const dome = useMemo(() => {
    if (numericDiameter == null) return [];
    return generateDome(numericDiameter, "centerLines");
  }, [numericDiameter])

  const domeGrid = useMemo(() => {
    if (!dome) return [];
    return generateDomeGrid(dome, numericLevel || 1);
  }, [dome, numericLevel]);

  const domeSideviewGrid = useMemo(() => {
    if (!dome) return [];
    return generateDomeSideviewGrid(dome, numericLevel || 1);
  }, [dome, numericLevel])

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
        />,

        // Dome-Level Slider
        <InputField key="dome-level-slider" label="Dome-Level Slider" closer>
          <div className="flex flex-row items-center">
            {/* Dome Sideview Grid */}
            <GridView
              grid={domeSideviewGrid}
              blockSize={blockSize}
              width={effectiveGridMaxSize}
              height={effectiveGridMaxSize/2}
              magnifierEnabled={magnifierEnabled}
              zoomBlockSize={zoomBlockSize}
            />

            {/* Level Slider with matched height */}
            <IntegerSlider
              label="Level"
              value={level}
              onChange={setLevel}
              maxValue={Math.ceil((numericDiameter || 0) / 2)}
              height={effectiveGridMaxSize/2}
              paddingTop={0}
            />
          </div>
        </InputField>
      ]}
      outputDisplay={(
        <GridView
          grid={domeGrid}
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