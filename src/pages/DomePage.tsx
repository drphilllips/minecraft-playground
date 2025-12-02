import FeaturePage from "../components/FeaturePage";
import DomeGenerator from "../features/dome-generator/DomeGenerator";

export default function DomePage() {
  return (
    <FeaturePage
      name="Dome Generator"
      description={`
        Choose a diameter and slide through levels to see each 2D slice of your dome.
      `}
    >
      <DomeGenerator />
    </FeaturePage>
  );
}