import { useState, useMemo, useEffect } from "react";
import IntegerInput from "./components/IntegerInput";
import GridView from "./components/GridView";
import { generateCircleGrid } from "./features/circle-generator/generateCircleGrid";

const MAX_DIAMETER = 100;
const GRID_MAX_SIZE = 420; // max pixel width/height for the circle grid and its container
const ENABLE_MAGNIFIER_DIAMETER = 40;

export default function App() {
  const [diameter, setDiameter] = useState("7");

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

  const numericDiameter = useMemo(() => {
    const n = parseInt(diameter, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.min(n, effectiveMaxDiameter);
  }, [diameter, effectiveMaxDiameter]);

  const circleGrid = useMemo(() => {
    if (numericDiameter == null) return [];
    return generateCircleGrid(numericDiameter);
  }, [numericDiameter]);

  const blockSize = useMemo(() => {
    if (numericDiameter == null) return 16;

    const gap = 2; // matches gap-[2px] between cells
    const size = numericDiameter; // grid is size x size

    // Total pixels available for blocks after subtracting gaps
    const totalGaps = Math.max(0, size - 1);
    const maxPixelsForBlocks = effectiveGridMaxSize - totalGaps * gap;

    if (maxPixelsForBlocks <= 0) {
      // Fallback to a minimal size if something goes wrong
      return 2;
    }

    const rawBlockSize = maxPixelsForBlocks / size;

    // Clamp only the upper bound so we never exceed the effective max size,
    // but allow small blocks for large diameters so width == height.
    return Math.min(20, rawBlockSize);
  }, [numericDiameter, effectiveGridMaxSize]);

  const magnifierEnabled = useMemo(() => {
    if (numericDiameter == null) return false;
    return numericDiameter >= ENABLE_MAGNIFIER_DIAMETER;
  }, [numericDiameter]);

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
            value={diameter}
            onChange={setDiameter}
            maxValue={effectiveMaxDiameter}
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
                  blockSize={blockSize}
                  width={effectiveGridMaxSize}
                  height={effectiveGridMaxSize}
                  magnifierEnabled={magnifierEnabled}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}