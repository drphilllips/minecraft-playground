import FeaturePage from "../components/FeaturePage";
import ImageTranslator from "../features/image-translator/ImageTranslator";

export default function ImagePage() {
  return (
    <FeaturePage
      name="Image Translator"
      description={`
        Upload an image, choose your resolution, and watch it turn into block-art magic.
      `}
    >
      <ImageTranslator />
    </FeaturePage>
  );
}