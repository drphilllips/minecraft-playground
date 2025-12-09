import { useState, useEffect } from "react";
import ImageUploadDropzone from "../../components/ImageUploadDropzone";
import IntegerInput from "../../components/IntegerInput";
import useCircularGridView from "../../hooks/useCircularGridView";
import GridView from "../../components/GridView";
import { FeatureContainer, FeatureOutputContainer } from "../../components/FeaturePage";
import { useResponsiveDesign } from "../../contexts/useResponsiveDesign";
import loadImageFromFile from "./utils/loadImageFromFile";
import generateImageGrid from "./utils/generateImageGrid";
import type { MinecraftBlock } from "./types/minecraftBlock";


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

  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [sourceImageHTMLElement, setSourceImageHTMLElement] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!sourceImageFile) {
        setSourceImageHTMLElement(null);
        return;
      }
      const el = await loadImageFromFile(sourceImageFile);
      if (!cancelled) setSourceImageHTMLElement(el);
    }
    load();
    return () => { cancelled = true; };
  }, [sourceImageFile]);

  const [imageGrid, setImageGrid] = useState<MinecraftBlock[][]>([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (numericResolution == null) {
        setImageGrid([]);
        return;
      }
      const result = await generateImageGrid(sourceImageHTMLElement, numericResolution);
      if (!cancelled) setImageGrid(result);
    }

    run();
    return () => { cancelled = true; };
  }, [sourceImageHTMLElement, numericResolution]);

  return (
    <FeatureContainer
      inputFields={[
        // Image Upload
        <ImageUploadDropzone
          key="image-upload"
          label="Source Image"
          description="Upload any reference image to convert into block art."
          onImageSelected={(file) => setSourceImageFile(file)}
        />,

        // Resolution Input
        <IntegerInput
          key="resolution-input"
          label="Resolution (positive integer)"
          value={resolution}
          onChange={setResolution}
          maxValue={maxResolution}
          maxReachedAlert={`${maxResolution} is the maximum resolution for this preview.`}
        />
      ]}
      outputDisplay={(
        <>
          {imageGrid.length > 0 ? (
            <GridView
              grid={imageGrid}
              blockSize={blockSize}
              width={effectiveGridMaxSize}
              height={effectiveGridMaxSize}
              magnifierEnabled={magnifierEnabled}
              zoomBlockSize={zoomBlockSize}
            />
          ): (
            <FeatureOutputContainer>
              <p
                className="text-sm md:text-base text-slate-500 italic leading-relaxed"
                style={{ width: effectiveGridMaxSize, maxWidth: effectiveGridMaxSize }}
              >
                Upload an image to see it translated to Minecraft blocks.
              </p>
            </FeatureOutputContainer>
          )}
        </>
      )}
    />
  )
}