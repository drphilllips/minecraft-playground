import { useState, useEffect, useMemo } from "react";
import IntegerInput from "../../components/IntegerInput";
import useCircularGridView from "../../hooks/useCircularGridView";
import GridView from "../../components/GridView";
import { FeatureContainer, FeatureOutputContainer, FeatureOutputSummaryContainer } from "../../components/FeaturePage";
import { useResponsiveDesign } from "../../contexts/useResponsiveDesign";
import loadImageFromFile from "./utils/loadImageFromFile";
import generateImageGrid from "./utils/generateImageGrid";
import type { BlockLab, MinecraftBlock } from "./types/minecraftBlock";
import ImageUploadDropzone from "./components/ImageUploadDropzone";
import BlockSummaryView from "./components/BlockSummary";
import calculateBlockSummary from "./utils/blockSummary";
import { hasBlocks } from "../../utils/objectHasValues";
import BlueprintContainer from "../../components/BlueprintContainer";
import { MINECRAFT_BLOCKS } from "./constants/minecraftBlocks";
import type { BlockFilter } from "./types/blockFilter";
import FeatureModal from "../../components/FeatureModal";
import BlockFilterView from "./components/BlockFilter";
import { applyBlockFilter } from "./utils/applyBlockFilter";
import BlankLabel from "../../components/Label";


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

  const [blockFilter, setBlockFilter] = useState<BlockFilter>({});
  const [blockFilterViewOpen, setBlockFilterViewOpen] = useState(false);

  const blockPool = useMemo(() => (
    applyBlockFilter(Object.values(MINECRAFT_BLOCKS), blockFilter)
  ), [blockFilter]);

  const blockLabPool: BlockLab[] = useMemo(() => (
    blockPool.map((block: MinecraftBlock) => ({ id: block.id, lab: block.color.lab }))
  ), [blockPool]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (numericResolution == null) {
        setImageGrid([]);
        return;
      }
      const result = await generateImageGrid(blockLabPool, sourceImageHTMLElement, numericResolution);
      if (!cancelled) setImageGrid(result);
    }

    run();
    return () => { cancelled = true; };
  }, [blockLabPool, sourceImageHTMLElement, numericResolution]);

  const blockSummary = useMemo(() => {
    if (imageGrid.length === 0) return {};
    return calculateBlockSummary(imageGrid);
  }, [imageGrid]);

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
            <BlueprintContainer
              blueprintTitle="Image Blueprint"
              blueprintSubTitle={`Resolution ${resolution}`}
              imageGrid={imageGrid}
            >
              <GridView
                grid={imageGrid}
                blockSize={blockSize}
                width={effectiveGridMaxSize}
                height={effectiveGridMaxSize}
                magnifierEnabled={magnifierEnabled}
                zoomBlockSize={zoomBlockSize}
              />
            </BlueprintContainer>
          ): (
            <FeatureOutputContainer>
              <BlankLabel
                text="Upload an image to see it translated to Minecraft blocks."
                style={{ width: effectiveGridMaxSize, maxWidth: effectiveGridMaxSize }}
              />
            </FeatureOutputContainer>
          )}
        </>
      )}
      outputSummary={
        <>
          {hasBlocks(blockSummary) && (
            <FeatureOutputSummaryContainer>
              <BlockSummaryView
                blockSummary={blockSummary}
                blockFilter={blockFilter}
                setBlockFilterViewOpen={setBlockFilterViewOpen}
              />
            </FeatureOutputSummaryContainer>
          )}
          <FeatureModal
            visible={blockFilterViewOpen}
            title="Filter Block Materials"
            onClose={() => setBlockFilterViewOpen(false)}
          >
            <BlockFilterView
              blockFilter={blockFilter}
              setBlockFilter={setBlockFilter}
            />
          </FeatureModal>
        </>
      }
    />
  )
}