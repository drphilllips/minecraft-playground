import FeaturePage from "../components/FeaturePage";
import ImageTranslator from "../features/image-translator/ImageTranslator";

export default function ImagePage() {
  return (
    <FeaturePage
      name="Image Translator"
      description={`
        Upload an image and adjust resolution to your heart's desire!
      `}
    >
      <ImageTranslator />
    </FeaturePage>
  );
}