import FeaturePage from "../components/FeaturePage";
import DomeGridView from "../features/dome-generator/DomeGridView";

export default function DomePage() {
  return (
    <FeaturePage
      name="Dome Generator"
      description={`
        Choose a diameter and slide through the levels to see each 2D slice of your dome.
        Use these cross-sections to build clean, precise domes in Minecraft.
      `}
    >
      <DomeGridView />
    </FeaturePage>
  );
}