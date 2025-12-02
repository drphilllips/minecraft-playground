import CirclePreview from "../features/previews/CirclePreview";
import DomePreview from "../features/previews/DomePreview";
import { useResponsiveDesign } from "../hooks/useResponsiveDesign";
import FeaturePreview from "../components/FeaturePreview";
import ImagePreview from "../features/previews/ImagePreview";

export default function HomePage() {
  const { onMobile } = useResponsiveDesign()

  return (
    <div className={`min-h-screen bg-slate-900 text-slate-100 text-center ${onMobile ? "px-2 py-6 overflow-hidden" : "px-10 py-20"}`}>
      <h1 className="text-5xl font-extrabold tracking-tight">Minecraft Playground</h1>
      <p className="mt-4 text-lg text-slate-300 max-w-xl mx-auto">
        Procedural tools and helpers for Minecraft builders.
      </p>

      <div className={`${onMobile ? "mt-5" : "mt-12"} flex justify-center`}>
        <div className={`w-full max-w-5xl ${onMobile ? "grid grid-cols-1 gap-2" : "grid grid-cols-2 gap-6 [&>*:last-child]:col-span-2 [&>*:last-child]:justify-self-center"} items-stretch`}>
          {/* Circle Generator Preview */}
          <FeaturePreview
            name="Circle Generator"
            linkToPage="/circle"
            description={`
              Build perfect circular structures with ease.
            `}
          >
            <CirclePreview />
          </FeaturePreview>

          {/* Dome Generator Preview */}
          <FeaturePreview
            name="Dome Generator"
            linkToPage="/dome"
            description={`
              Create smooth domes with precise layer‑by‑layer guides.
            `}
          >
            <DomePreview />
          </FeaturePreview>

          {/* Image Translator Preview */}
          <FeaturePreview
            name="Image Translator"
            linkToPage="/image"
            description={`
              Transform any image into a clean, Minecraft‑block blueprint.
            `}
          >
            <ImagePreview />
          </FeaturePreview>
        </div>
      </div>
    </div>
  );
}