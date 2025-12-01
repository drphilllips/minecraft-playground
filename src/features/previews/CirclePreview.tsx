import { useEffect, useMemo } from "react";
import GridView from "../../components/GridView";
import { generateCircleGrid } from "../circle-generator/generateCircleGrid";
import useCircularGridView from "../../hooks/useCircularGridView";
import { useResponsiveDesign } from "../../hooks/useResponsiveDesign";
import { useSharedBreathingPhase } from "../../hooks/useSharedBreathingPhase";


export default function CirclePreview() {
  const { effectiveMaxDiameter, effectiveGridMaxSize } = useResponsiveDesign()

  const {
    setDiameter,
    numericDiameter,
    blockSize,
  } = useCircularGridView({
    maxDiameter: effectiveMaxDiameter/2,
    gridMaxSize: effectiveGridMaxSize/2,
    defaultDiameter: 1,
  })

  const phase = useSharedBreathingPhase();

  useEffect(() => {
    const [min, max] = [1, effectiveMaxDiameter/2-1];
    const value = min + (max - min) * phase; // 0->1->0 mapped to min->max->min
    let rounded = Math.round(value);
    if (rounded % 2 === 0) rounded += 1;
    setDiameter(String(rounded));
  }, [effectiveMaxDiameter, phase, setDiameter]);

  const circleGrid = useMemo(() => {
    if (numericDiameter == null) return [];
    return generateCircleGrid(numericDiameter);
  }, [numericDiameter]);

  return (
    <GridView
      grid={circleGrid}
      blockSize={blockSize}
      width={effectiveGridMaxSize/2}
      height={effectiveGridMaxSize/2}
      magnifierEnabled={false}
    />
  )
}