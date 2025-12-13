import defaultImageSrc from "../../assets/earth.jpg";
import { useEffect, useMemo, useState } from "react";
import GridView from "../../components/GridView";
import { useResponsiveDesign } from "../../contexts/useResponsiveDesign";
import { useBreathingPhase } from "../../contexts/useBreathingOscillation";
import { useStaticImageElement } from "./utils/useStaticImageElement";
import generateImageGrid from "./utils/generateImageGrid";
import calculateBlockSize from "../../utils/calculateBlockSize";
import type { MinecraftBlock } from "./types/minecraftBlock";
import { ALL_BLOCK_LABS } from "./constants/blockColors";

export default function ImagePreview({
  lite=false,
}: {
  lite?: boolean
}) {
  const sourceImageHTMLElement = useStaticImageElement(defaultImageSrc);
  const { effectiveMaxDiameter: maxResolution, effectiveGridMaxSize } =
    useResponsiveDesign();
  const breathingPhase = useBreathingPhase();

  // Derive animated resolution directly from phase + maxResolution
  const numericResolution = useMemo(() => {
    if (!maxResolution) return null;

    const [min, max] = [1, maxResolution / 2 - 1];
    const value = min + (max - min) * breathingPhase;
    let rounded = Math.round(value);
    if (rounded % 2 === 0) rounded += 1; // keep it odd

    return Math.max(1, rounded);
  }, [maxResolution, breathingPhase]);

  const blockSize = useMemo(
    () => calculateBlockSize(numericResolution, effectiveGridMaxSize / 2),
    [numericResolution, effectiveGridMaxSize]
  );

  const [imageGrid, setImageGrid] = useState<MinecraftBlock[][]>([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!numericResolution || !sourceImageHTMLElement) {
        setImageGrid([]);
        return;
      }
      const result = await generateImageGrid(
        ALL_BLOCK_LABS,
        sourceImageHTMLElement,
        numericResolution
      );
      if (!cancelled) setImageGrid(result);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [sourceImageHTMLElement, numericResolution]);

  return (
    <GridView
      grid={imageGrid}
      blockSize={blockSize}
      width={effectiveGridMaxSize / 2}
      height={effectiveGridMaxSize / 2}
      magnifierEnabled={false}
      lite={lite}
    />
  );
}