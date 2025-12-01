import { useState, useMemo, useEffect } from "react";
import CircleGridView from "./features/circle-generator/CircleGridView";
import DomeGridView from "./features/dome-generator/DomeGridView";


const MOBILE_VIEWPORT_THRESHOLD = 640;
const WEB_MAX_DIAMETER = 100;
const MOBILE_MAX_DIAMETER = 50;
const WEB_GRID_MAX_SIZE = 420; // max pixel width/height for the circle grid and its container
const MOBILE_GRID_MAX_SIZE = 200;
const GRID_MIN_SIZE = 160;

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
    if (viewportWidth == null) return WEB_GRID_MAX_SIZE;

    // Treat narrow viewports as "mobile" and use a smaller max size
    if (viewportWidth < MOBILE_VIEWPORT_THRESHOLD) {
      // Leave some margin on the sides, and clamp to a reasonable range
      const candidate = viewportWidth - 40;
      return Math.max(GRID_MIN_SIZE, Math.min(MOBILE_GRID_MAX_SIZE, candidate));
    }

    return WEB_GRID_MAX_SIZE;
  }, [viewportWidth]);

  const effectiveMaxDiameter = useMemo(() => {
    if (viewportWidth == null) return WEB_MAX_DIAMETER;
    // On "mobile" (narrow viewports), cap diameter at 50
    return viewportWidth < MOBILE_VIEWPORT_THRESHOLD ? MOBILE_MAX_DIAMETER : WEB_MAX_DIAMETER;
  }, [viewportWidth]);

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

        <CircleGridView
          maxDiameter={effectiveMaxDiameter}
          maxSize={effectiveGridMaxSize}
        />
      </section>

      {/* Dome Generator Section */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-3">Dome Generator</h2>
        <p className="text-slate-300 mb-8 max-w-xl">
          Choose a diameter and slide through the levels to see each 2D slice
          of your dome. Use these cross-sections to build clean, precise domes in Minecraft.
        </p>

        <DomeGridView
          maxDiameter={effectiveMaxDiameter}
          maxSize={effectiveGridMaxSize}
        />
      </section>
    </div>
  );
}