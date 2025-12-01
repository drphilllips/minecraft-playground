import { Link } from "react-router-dom";
import CirclePreview from "../features/previews/CirclePreview";
import DomePreview from "../features/previews/DomePreview";
import { useResponsiveDesign } from "../hooks/useResponsiveDesign";

export default function HomePage() {
  const { onMobile } = useResponsiveDesign()

  return (
    <div className={`min-h-screen bg-slate-900 text-slate-100 text-center ${onMobile ? "px-1 py-6 overflow-hidden" : "px-10 py-20"}`}>
      <h1 className="text-5xl font-extrabold tracking-tight">Minecraft Playground</h1>
      <p className="mt-4 text-lg text-slate-300 max-w-xl mx-auto">
        Procedural tools and helpers for Minecraft builders.
      </p>

      <div className={`${onMobile ? "mt-5" : "mt-12"} flex justify-center`}>
        <div className={`w-full max-w-5xl flex flex-row ${onMobile ? "gap-1" : "gap-6"} items-stretch`}>
          {/* Circle Generator Preview */}
          <div className="flex-1">
            <Link
              to="/circle"
              className="block h-full"
            >
              <div className="flex flex-col gap-3 h-full bg-slate-800/40 rounded-2xl p-6 border border-slate-700 transition-transform hover:opacity-80 hover:-translate-y-1 active:opacity-70 active:translate-y-0.5 cursor-pointer">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-2xl font-semibold text-left">Circle Generator</h2>
                </div>
                <p className="text-sm text-slate-300 text-left">
                  Build perfect circular structures with ease.
                </p>
                {/* Circle preview placeholder */}
                <div className="mt-auto">
                  <CirclePreview />
                </div>
              </div>
            </Link>
          </div>

          {/* Dome Generator Preview */}
          <div className="flex-1">
            <Link
              to="/dome"
              className="block h-full"
            >
              <div className="flex flex-col gap-3 h-full bg-slate-800/40 rounded-2xl p-6 border border-slate-700 transition-transform hover:opacity-80 hover:-translate-y-1 active:opacity-70 active:translate-y-0.5 cursor-pointer">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-2xl font-semibold text-left">Dome Generator</h2>
                </div>
                <p className="text-sm text-slate-300 text-left">
                  Create smooth domes with precise layer‑by‑layer guides.
                </p>
                {/* Dome preview placeholder */}
                <div className="mt-auto">
                  <DomePreview />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}