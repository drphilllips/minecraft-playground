import { useMemo } from "react";
import GridView from "../../components/GridView";
import IntegerInput from "../../components/IntegerInput";
import useCircularGridView from "../../hooks/useCircularGridView";
import IntegerSlider from "../../components/IntegerSlider";
import InputField from "../../components/InputField";
import { FeatureContainer, FeatureOutputSummaryContainer } from "../../components/FeaturePage";
import { useResponsiveDesign } from "../../contexts/useResponsiveDesign";
import generateDome from "./utils/generateDome";
import { generateDomeGrid } from "./utils/generateDomeGrid";
import generateDomeSideviewGrid from "./utils/generateDomeSideviewGrid";
import { BLANK_CIRCLE_OUTPUT, BLANK_DOME_OUTPUT } from "../../constants/gridOutput";
import type { CircularCellType } from "../../types/circularStyle";
import BlueprintContainer from "../../components/BlueprintContainer";
import generateCircularInstructions from "../../utils/generateCircularInstructions";
import { DOME_CELL_STYLING } from "../../constants/gridCellStyles";


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
    defaultDiameter: effectiveMaxDiameter/2,
  })

  const dome = useMemo(() => {
    if (numericDiameter == null) return BLANK_DOME_OUTPUT;
    return generateDome(numericDiameter, "centerLines");
  }, [numericDiameter])

  const domeGrid = useMemo(() => {
    if (!dome) return BLANK_CIRCLE_OUTPUT;
    return generateDomeGrid(dome.space as CircularCellType[][][], numericLevel || 1);
  }, [dome, numericLevel]);

  const domeSideviewGrid = useMemo(() => {
    if (!dome) return BLANK_CIRCLE_OUTPUT;
    return generateDomeSideviewGrid(dome.space as CircularCellType[][][], numericLevel || 1);
  }, [dome, numericLevel])

  const domeInstructions = useMemo(() => {
    if (!domeGrid.unstyled) return null;
    return generateCircularInstructions(domeGrid.unstyled, DOME_CELL_STYLING, "dome-level");
  }, [domeGrid]);

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
              grid={domeSideviewGrid.grid}
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
              sliderLength={effectiveGridMaxSize/2}
              paddingTop={0}
            />
          </div>
        </InputField>
      ]}
      outputDisplay={(
        <BlueprintContainer
          blueprintTitle="Dome-Level Blueprint"
          blueprintSubTitle={`Diameter ${diameter}, Level ${level}`}
          instructions={domeInstructions}
        >
          <GridView
            grid={domeGrid.grid}
            blockSize={blockSize}
            width={effectiveGridMaxSize}
            height={effectiveGridMaxSize}
            magnifierEnabled={magnifierEnabled}
            zoomBlockSize={zoomBlockSize}
          />
        </BlueprintContainer>
      )}
      outputSummary={
        <FeatureOutputSummaryContainer>
          <div className="flex flex-col">
            <p className="text-xl">Total Blocks: {dome.num_edge_blocks}</p>
            <p className="text-xl">Level Blocks: {domeGrid.num_edge_blocks}</p>
          </div>
        </FeatureOutputSummaryContainer>
      }
    />
  )
}