import { useState, useMemo, useEffect } from "react";
import IntegerInput from "./components/IntegerInput";
import GridView from "./components/GridView";
import { generateCircleGrid } from "./features/circle-generator/generateCircleGrid";
import useGridView from "./hooks/useGridView";
import { generateDomeGrid } from "./features/dome-generator/generateDomeGrid";

const MAX_DIAMETER = 100;
const GRID_MAX_SIZE = 420; // max pixel width/height for the circle grid and its container

export default function App() {
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (typeof window !== "undefined") {
        setViewportWidth(window.innerWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const effectiveGridMaxSize = useMemo(() => {
    if (viewportWidth == null) return GRID_MAX_SIZE;

    // Treat narrow viewports as "mobile" and use a smaller max size
    if (viewportWidth < 640) {
      // Leave some margin on the sides, and clamp to a reasonable range
      const candidate = viewportWidth - 40;
      return Math.max(160, Math.min(260, candidate));
    }

    return GRID_MAX_SIZE;
  }, [viewportWidth]);

  const effectiveMaxDiameter = useMemo(() => {
    if (viewportWidth == null) return MAX_DIAMETER;
    // On "mobile" (narrow viewports), cap diameter at 50
    return viewportWidth < 640 ? 50 : MAX_DIAMETER;
  }, [viewportWidth]);

  const {
    diameter: circleDiameter,
    setDiameter: setCircleDiameter,
    numericDiameter: circleNumericDiameter,
    blockSize: circleBlockSize,
    magnifierEnabled: circleMagnifierEnabled,
  } = useGridView({
    defaultDiameter: 7,
    maxDiameter: 100,
    gridMaxSize: effectiveGridMaxSize,
    enableMagnifierDiameter: 40,
  })

  const {
    diameter: domeDiameter,
    setDiameter: setDomeDiameter,
    numericDiameter: numericDomeDiameter,
    blockSize: domeBlockSize,
    magnifierEnabled: domeMagnifierEnabled,
  } = useGridView({
    defaultDiameter: 7,
    maxDiameter: 100,
    gridMaxSize: effectiveGridMaxSize,
    enableMagnifierDiameter: 40,
  })
  const [domeLevel, setDomeLevel] = useState("1");
  const numericDomeLevel = useMemo(() => {
    const n = parseInt(domeLevel, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.min(n, Math.ceil((numericDomeDiameter || 0) / 2));
  }, [domeLevel, numericDomeDiameter]);

  const domeLevelDisplay = useMemo(() => {
    if (numericDomeLevel == null) return domeLevel;
    return String(numericDomeLevel);
  }, [numericDomeLevel, domeLevel]);

  const circleGrid = useMemo(() => {
    if (circleNumericDiameter == null) return [];
    return generateCircleGrid(circleNumericDiameter);
  }, [circleNumericDiameter]);

  const domeGrid = useMemo(() => {
    if (numericDomeDiameter == null) return [];
    return generateDomeGrid(numericDomeDiameter, numericDomeLevel || 1);
  }, [numericDomeDiameter, numericDomeLevel]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Hero Section */}
      <header className="py-20 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Minecraft Playground
        </h1>
        <p className="mt-4 text-lg text-slate-300 max-w-xl mx-auto">
          Procedural tools and helpers for Minecraft builders.
        </p>
      </header>

      {/* Circle Generator Section */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-3">Circle Generator</h2>
        <p className="text-slate-300 mb-8 max-w-xl">
          Enter a diameter to generate a 2D block circle. This helps you build
          perfect circular structures in Minecraft.
        </p>

        <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700">
          {/* Diameter Input */}
          <IntegerInput
            label="Diameter (positive integer)"
            value={circleDiameter}
            onChange={setCircleDiameter}
            maxValue={effectiveMaxDiameter}
            maxReachedAlert={`${effectiveMaxDiameter} is the maximum value for this preview.`}
          />

          {/* Circle Grid Preview */}
          <div className="mt-6 flex">
            <div className="flex rounded-2xl border border-slate-700 bg-slate-950/80 p-3">
              {circleGrid.length === 0 ? (
                <p className="text-xs text-slate-400">
                  No diameter entered. Please type a positive number to generate a circle grid.
                </p>
              ) : (
                <GridView
                  grid={circleGrid}
                  blockSize={circleBlockSize}
                  width={effectiveGridMaxSize}
                  height={effectiveGridMaxSize}
                  magnifierEnabled={circleMagnifierEnabled}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Dome Generator Section */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-3">Dome Generator</h2>
        <p className="text-slate-300 mb-8 max-w-xl">
          Choose a diameter and slide through the levels to see each 2D slice
          of your dome. Use these cross-sections to build clean, precise domes in Minecraft.
        </p>

        <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700">
          {/* Diameter Input */}
          <IntegerInput
            label="Diameter (positive integer)"
            value={domeDiameter}
            onChange={setDomeDiameter}
            maxValue={effectiveMaxDiameter}
            maxReachedAlert={`${effectiveMaxDiameter} is the maximum value for this preview.`}
          />
          {/* Level Input */}
          <IntegerInput
            label="Level (positive integer)"
            value={domeLevelDisplay}
            onChange={setDomeLevel}
            maxValue={Math.ceil((numericDomeDiameter || 0) / 2)}
            maxReachedAlert={`Level ${domeLevelDisplay} is the top of this dome.`}
          />

          {/* Circle Grid Preview */}
          <div className="mt-6 flex">
            <div className="flex rounded-2xl border border-slate-700 bg-slate-950/80 p-3">
              {domeGrid.length === 0 ? (
                <p className="text-xs text-slate-400">
                  No diameter entered. Please type a positive number to generate a circle grid.
                </p>
              ) : (
                <GridView
                  grid={domeGrid}
                  blockSize={domeBlockSize}
                  width={effectiveGridMaxSize}
                  height={effectiveGridMaxSize}
                  magnifierEnabled={domeMagnifierEnabled}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}