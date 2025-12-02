import { useMemo, useState } from "react";
import GridView from "../../components/GridView";
import IntegerInput from "../../components/IntegerInput";
import useCircularGridView from "../../hooks/useCircularGridView";
import { generateDomeGrid } from "./generateDomeGrid";
import generateDome from "./generateDome";
import generateDomeSideviewGrid from "./generateDomeSideviewGrid";
import IntegerSlider from "../../components/IntegerSlider";
import InputField from "../../components/InputField";
import { useResponsiveDesign } from "../../hooks/useResponsiveDesign";
import FeatureContainer from "../../components/FeatureContainer";


export default function DomeGenerator() {
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
  const [level, setLevel] = useState("1");

  const numericLevel = useMemo(() => {
    const n = parseInt(level, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.min(n, Math.ceil((numericDiameter || 0) / 2));
  }, [level, numericDiameter]);

  const domeLevelDisplay = useMemo(() => {
    if (numericLevel == null) return level;
    return String(numericLevel);
  }, [numericLevel, level]);

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
          label="Diameter (positive integer)"
          value={diameter}
          onChange={setDiameter}
          maxValue={effectiveMaxDiameter}
          maxReachedAlert={`${effectiveMaxDiameter} is the maximum diameter for this preview.`}
        />,

        // Dome-Level Slider
        <InputField label="Dome-Level Slider" closer>
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
              value={domeLevelDisplay}
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