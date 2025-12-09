import { useMemo } from "react";
import GridView from "../../components/GridView";
import { useResponsiveDesign } from "../../contexts/useResponsiveDesign";
import { useBreathingPhase } from "../../contexts/useBreathingOscillation";
import { generateCircleGrid } from "./utils/generateCircleGrid";
import calculateBlockSize from "../../utils/calculateBlockSize";
import { BLANK_CIRCLE_OUTPUT } from "../../constants/gridOutput";


export default function CirclePreview() {
  const { effectiveMaxDiameter, effectiveGridMaxSize } = useResponsiveDesign();
  const breathingPhase = useBreathingPhase();

  const numericDiameter = useMemo(() => {
    if (!effectiveMaxDiameter) return null;

    const minDiam = 1;
    const maxDiam = effectiveMaxDiameter / 2 - 1;
    const value = minDiam + (maxDiam - minDiam) * breathingPhase;

    let rounded = Math.round(value);
    if (rounded % 2 === 0) rounded += 1;

    return Math.max(1, rounded);
  }, [effectiveMaxDiameter, breathingPhase]);
  const blockSize = useMemo(
    () => calculateBlockSize(numericDiameter, effectiveGridMaxSize / 2),
    [numericDiameter, effectiveGridMaxSize]
  );

  const circleGrid = useMemo(() => {
    if (numericDiameter == null) return BLANK_CIRCLE_OUTPUT;
    return generateCircleGrid(numericDiameter);
  }, [numericDiameter]);

  return (
    <GridView
      grid={circleGrid.grid}
      blockSize={blockSize}
      width={effectiveGridMaxSize/2}
      height={effectiveGridMaxSize/2}
      magnifierEnabled={false}
    />
  )
}