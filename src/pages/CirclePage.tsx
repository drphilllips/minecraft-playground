import FeaturePage from "../components/FeaturePage";
import CircleGenerator from "../features/circle-generator/CircleGridView";

export default function CirclePage() {
  return (
    <FeaturePage
      name="Circle Generator"
      description={`
        Enter a diameter to generate a 2D block circle.
      `}
    >
      <CircleGenerator />
    </FeaturePage>
  );
}