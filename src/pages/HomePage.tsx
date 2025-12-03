import CirclePreview from "../features/circle-generator/CirclePreview";
import DomePreview from "../features/dome-generator/DomePreview";
import FeaturePreview from "../components/FeaturePreview";
import ImagePreview from "../features/image-translator/ImagePreview";
import { useResponsiveDesign } from "../contexts/useResponsiveDesign";
import { BreathingOscillationProvider } from "../contexts/BreathingOscillationContext";

export default function HomePage() {
  const { onMobile } = useResponsiveDesign()

  return (
    <div className={`min-h-screen bg-slate-900 text-slate-100 text-center ${onMobile ? "px-2 pt-24 overflow-hidden" : "px-10 pt-20"}`}>
      <h1 className={`${onMobile ? "text-4xl" : "text-5xl"} font-extrabold tracking-tight`}>Minecraft Playground</h1>
      <p className={`${onMobile ? "mt-2" : "mt-4"} text-lg text-slate-300 max-w-xl mx-auto`}>
        Procedural tools for Minecraft builders.
      </p>

      <div className={`${onMobile ? "mt-10" : "mt-12"} flex justify-center`}>
        <div className={`w-full max-w-5xl ${onMobile ? "grid grid-cols-1 gap-2" : "grid grid-cols-2 gap-6 [&>*:last-child]:col-span-2 [&>*:last-child]:justify-self-center"} items-stretch`}>
          <BreathingOscillationProvider>
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
                Transform any image into a clean Minecraft‑block blueprint.
              `}
            >
              <ImagePreview />
            </FeaturePreview>
          </BreathingOscillationProvider>
        </div>
      </div>
    </div>
  );
}