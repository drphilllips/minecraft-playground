import DomeGridView from "../features/dome-generator/DomeGridView";

export default function DomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 px-6 py-12">
      <h2 className="text-3xl font-bold mb-3">Dome Generator</h2>
      <p className="text-slate-300 mb-8 max-w-xl">
        Choose a diameter and slide through the levels to see each 2D slice
        of your dome. Use these cross-sections to build clean, precise domes in Minecraft.
      </p>

      <DomeGridView maxDiameter={100} maxSize={420} />
    </div>
  );
}