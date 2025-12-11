import { useEffect, useMemo, useState } from "react";
import type { FullInstructions } from "../types/blueprintInstruction";
import GridView from "./GridView";
import useCircularGridView from "../hooks/useCircularGridView";
import { useResponsiveDesign } from "../contexts/useResponsiveDesign";
import IntegerSlider from "./IntegerSlider";
import Separator from "./Separator";


export default function BlueprintInstructions({
  title,
  subTitle,
  instructions,
}: {
  title: string,
  subTitle: string,
  instructions: FullInstructions
}) {
  const { effectiveMaxDiameter, effectiveGridMaxSize } = useResponsiveDesign()

  const {
    blockSize,
    magnifierEnabled,
    zoomBlockSize,
    setDiameter,
  } = useCircularGridView({
    maxDiameter: effectiveMaxDiameter,
    gridMaxSize: effectiveGridMaxSize,
  })

  const [step, setStep] = useState("1");

  const numericStep = useMemo(() => {
    const n = parseInt(step, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.min(n, instructions.totalSteps);
  }, [step, instructions.totalSteps]);

  useEffect(() => {
    const stepGrid = instructions.stepInstructions[(numericStep || 1)-1].stepGrid;
    const width = stepGrid[0].length
    const height = stepGrid.length
    setDiameter(Math.max(width, height).toLocaleString());
  }, [instructions, setDiameter, numericStep])

  return (
    <div className="flex flex-col w-full h-full justify-start items-center gap-5 overflow-y-auto">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight text-center">
          {title}
        </h2>
        <Separator />
        <p className="max-w-2xl font-bold leading-tight text-slate-400 text-lg text-center">
          {subTitle.toUpperCase()}
        </p>
      </div>
      <IntegerSlider
        horizontal
        label="Step"
        value={step}
        onChange={setStep}
        maxValue={instructions.totalSteps}
        sliderLength={effectiveGridMaxSize}
        showButtons
        showOutOfTotal
      />
      <p className="max-w-xl text-slate-300 sm:text-base">
        {instructions.stepInstructions[(numericStep || 1)-1].instructionString}
      </p>
      <GridView
        grid={instructions.stepInstructions[(numericStep || 1)-1].stepGrid}
        blockSize={blockSize}
        magnifierEnabled={magnifierEnabled}
        zoomBlockSize={zoomBlockSize}
      />
    </div>
  )
}