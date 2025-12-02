import defaultImageSrc from "../../assets/earth.jpg";
import { useStaticImageElement } from "../image-translator/useStaticImageElement";
import { useEffect, useState } from "react";
import GridView from "../../components/GridView";
import useCircularGridView from "../../hooks/useCircularGridView";
import { useResponsiveDesign } from "../../hooks/useResponsiveDesign";
import { useSharedBreathingPhase } from "../../hooks/useSharedBreathingPhase";
import generateImageGrid from "../image-translator/generateImageGrid";
import type { Pixel } from "../../types/imageTranslator";


export default function ImagePreview() {
  const sourceImageHTMLElement = useStaticImageElement(defaultImageSrc);

  const { effectiveMaxDiameter: maxResolution, effectiveGridMaxSize } = useResponsiveDesign()

  const {
    setDiameter: setResolution,
    numericDiameter: numericResolution,
    blockSize,
  } = useCircularGridView({
    maxDiameter: maxResolution/2,
    gridMaxSize: effectiveGridMaxSize/2,
    defaultDiameter: 1,
  })

  const phase = useSharedBreathingPhase();

  useEffect(() => {
    const [min, max] = [1, maxResolution/2-1];
    const value = min + (max - min) * phase; // 0->1->0 mapped to min->max->min
    let rounded = Math.round(value);
    if (rounded % 2 === 0) rounded += 1;
    setResolution(String(rounded));
  }, [maxResolution, phase, setResolution]);

  const [imageGrid, setImageGrid] = useState<Pixel[][]>([]);

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
    <GridView
      grid={imageGrid}
      blockSize={blockSize}
      width={effectiveGridMaxSize/2}
      height={effectiveGridMaxSize/2}
      magnifierEnabled={false}
    />
  )
}