import CirclePreview from "../features/circle-generator/CirclePreview";
import DomePreview from "../features/dome-generator/DomePreview";
import FeaturePreview from "../components/FeaturePreview";
import ImagePreview from "../features/image-translator/ImagePreview";
import { useResponsiveDesign } from "../contexts/useResponsiveDesign";
import { BreathingOscillationProvider } from "../contexts/BreathingOscillationContext";

export default function HomePage() {
  const { onMobile, isStandalone } = useResponsiveDesign()

  return (
    <div className={`min-h-screen bg-slate-900 text-slate-100 text-center ${onMobile ? (isStandalone ? "px-2 pt-14 overflow-hidden" : "px-2 overflow-hidden") : "px-10 pt-4"}`}>
      <div className="flex flex-row w-full justify-center items-center mb-3">
        <img
          src="/mp-logo.svg"
          alt="Minecraft Playground Logo"
          className="block w-32 h-32 object-contain bg-slate-900"
        />
      </div>
      <h1 className={`${onMobile ? (isStandalone ? "text-4xl" : "text-4xl leading-6") : "text-5xl"} font-extrabold tracking-tight`}>Minecraft Playground</h1>
      <p className={`${onMobile ? (isStandalone ? "mt-2" : "mt-2") : "mt-4"} text-lg text-slate-300 max-w-xl mx-auto`}>
        Procedural tools for Minecraft builders.
      </p>

      <div className={`${onMobile ? (isStandalone ? "mt-6" : "mt-2") : "mt-8"} flex justify-center`}>
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
              <ImagePreview lite />
            </FeaturePreview>
          </BreathingOscillationProvider>
        </div>
      </div>
    </div>
  );
}