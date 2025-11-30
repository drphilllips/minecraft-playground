import { useMemo, useState } from "react";
import GridView from "../../components/GridView";
import IntegerInput from "../../components/IntegerInput";
import useCircularGridView from "../../hooks/useCircularGridView";
import { generateDomeGrid } from "./generateDomeGrid";
import generateDome from "./generateDome";
import generateDomeSideviewGrid from "./generateDomeSideviewGrid";
import IntegerSlider from "../../components/IntegerSlider";
import Separator from "../../components/Separator";
import InputLabel from "../../components/InputLabel";


export default function DomeGridView({
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
    <div className="flex flex-col gap-3 bg-slate-800/40 rounded-2xl p-6 border border-slate-700">
      {/* Diameter Input */}
      <IntegerInput
        label="Diameter (positive integer)"
        value={diameter}
        onChange={setDiameter}
        maxValue={maxDiameter}
        maxReachedAlert={`${maxDiameter} is the maximum value for this preview.`}
      />

      <div className="flex flex-col">
        <InputLabel label="Dome-Level Slider" closer />

        <div className="flex flex-row items-center">
          {/* Dome Sideview Grid */}
          <GridView
            grid={domeSideviewGrid}
            blockSize={blockSize}
            width={maxSize}
            height={maxSize/2}
            magnifierEnabled={magnifierEnabled}
          />

          {/* Level Slider with matched height */}
          <IntegerSlider
            label="Level"
            value={domeLevelDisplay}
            onChange={setLevel}
            maxValue={Math.ceil((numericDiameter || 0) / 2)}
            height={maxSize/2}
            paddingTop={0}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 w-fit">
        <Separator className="w-full" />

        {/* Dome Grid */}
        <GridView
          grid={domeGrid}
          blockSize={blockSize}
          width={maxSize}
          height={maxSize}
          magnifierEnabled={magnifierEnabled}
        />
        </div>
    </div>
  )
}