import { useState, useEffect } from "react";
import FeatureContainer from "../../components/FeatureContainer";
import ImageUploadDropzone from "../../components/ImageUploadDropzone";
import IntegerInput from "../../components/IntegerInput";
import useCircularGridView from "../../hooks/useCircularGridView";
import { useResponsiveDesign } from "../../hooks/useResponsiveDesign";
import generateImageGrid from "./generateImageGrid";
import GridView from "../../components/GridView";
import type { Pixel } from "../../types/imageTranslator";


export default function ImageTranslator() {
  const { effectiveMaxDiameter: maxResolution, effectiveGridMaxSize } = useResponsiveDesign()

  const {
    diameter: resolution,
    setDiameter: setResolution,
    numericDiameter: numericResolution,
    blockSize,
    magnifierEnabled,
    zoomBlockSize,
  } = useCircularGridView({
    maxDiameter: maxResolution,
    gridMaxSize: effectiveGridMaxSize,
    defaultDiameter: maxResolution/2,
  })

  const [sourceImage, setSourceImage] = useState<File | null>(null);

  const [imageGrid, setImageGrid] = useState<Pixel[][]>([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (numericResolution == null) {
        setImageGrid([]);
        return;
      }
      const result = await generateImageGrid(sourceImage, numericResolution);
      if (!cancelled) setImageGrid(result);
    }

    run();
    return () => { cancelled = true; };
  }, [sourceImage, numericResolution]);

  return (
    <FeatureContainer
      inputFields={[
        // Image Upload
        <ImageUploadDropzone
          key="image"
          label="Source Image"
          description="Upload any reference image to convert into pixel art."
          onImageSelected={(file) => setSourceImage(file)}
        />,

        // Resolution Input
        <IntegerInput
          label="Resolution (positive integer)"
          value={resolution}
          onChange={setResolution}
          maxValue={maxResolution}
          maxReachedAlert={`${maxResolution} is the maximum resolution for this preview.`}
        />
      ]}
      outputDisplay={(
        <GridView
          grid={imageGrid}
          blockSize={blockSize}
          width={effectiveGridMaxSize}
          height={effectiveGridMaxSize}
          magnifierEnabled={magnifierEnabled}
          zoomBlockSize={zoomBlockSize}
        />
      )}
    />
  )
}