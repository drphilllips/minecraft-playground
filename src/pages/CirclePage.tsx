import CircleGridView from "../features/circle-generator/CircleGridView";
import { useResponsiveDesign } from "../hooks/useResponsiveDesign";

export default function CirclePage() {
  const { effectiveMaxDiameter, effectiveGridMaxSize } = useResponsiveDesign();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-6 py-12">
      <h2 className="text-3xl font-bold mb-3">Circle Generator</h2>
      <p className="text-slate-300 mb-8 max-w-xl">
        Enter a diameter to generate a 2D block circle. This helps you build
        perfect circular structures in Minecraft.
      </p>

      <CircleGridView maxDiameter={effectiveMaxDiameter} maxSize={effectiveGridMaxSize} />
    </div>
  );
}