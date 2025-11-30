import { useMemo, useState } from "react";
import GridView from "../../components/GridView";
import IntegerInput from "../../components/IntegerInput";
import useCircularGridView from "../../hooks/useCircularGridView";
import { generateDomeGrid } from "./generateDomeGrid";
import generateDome from "./generateDome";


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
      {/* Level Input */}
      <IntegerInput
        label="Level (positive integer)"
        value={domeLevelDisplay}
        onChange={setLevel}
        maxValue={Math.ceil((numericDiameter || 0) / 2)}
        maxReachedAlert={`Level ${domeLevelDisplay} is the top of this dome.`}
      />

      {/* Dome Grid */}
      <div className="mt-6 flex">
        <div className="flex rounded-2xl border border-slate-700 bg-slate-950/80 p-3">
          {domeGrid.length === 0 ? (
            <p className="text-xs text-slate-400">
              No diameter entered. Please type a positive number to generate a circle grid.
            </p>
          ) : (
            <GridView
              grid={domeGrid}
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