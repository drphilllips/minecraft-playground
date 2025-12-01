import FeaturePage from "../components/FeaturePage";
import CircleGridView from "../features/circle-generator/CircleGridView";

export default function CirclePage() {
  return (
    <FeaturePage
      name="Circle Generator"
      description={`
        Enter a diameter to generate a 2D block circle.
      `}
    >
      <CircleGridView />
    </FeaturePage>
  );
}