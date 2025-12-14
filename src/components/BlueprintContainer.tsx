import React, { useEffect, useMemo, useState } from "react"
import { ChevronRight } from "lucide-react"
import type { BlueprintCircularInstructions } from "../types/blueprintInstruction"
import IntegerSlider from "./IntegerSlider"
import GridView from "./GridView"
import useCircularGridView from "../hooks/useCircularGridView"
import { useResponsiveDesign } from "../contexts/useResponsiveDesign"
import ImageBlueprintGridView from "../features/image-translator/components/ImageBlueprintGridView"
import type { MinecraftBlock } from "../features/image-translator/types/minecraftBlock"
import FeatureModal from "./FeatureModal"


export default function BlueprintContainer({
  blueprintTitle,
  blueprintSubTitle,
  instructions,
  imageGrid,
  children
}: {
  blueprintTitle: string
  blueprintSubTitle: string
  instructions?: BlueprintCircularInstructions | null
  imageGrid?: MinecraftBlock[][]
  children: React.ReactNode
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const baseWidth = "1.75rem"
  const expandedWidth = "2.75rem"

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setIsOpen(true)
    }
  }

  return (
    <>
      <div className="relative inline-flex flex-row items-stretch">
        {/* Main content */}
        <div className="relative z-10">{children}</div>

        {/* Blueprint sliver */}
        <button
          type="button"
          className={`
            group
            relative
            h-full shrink-0
            flex items-center
            rounded-r-lg
            border-r border-y border-sky-500/60
            bg-sky-500/70
            shadow-lg shadow-sky-500/20
            transition-all duration-200 ease-out
            outline-none
          `}
          style={{
            width: isHovered ? expandedWidth : baseWidth,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onPointerDown={() => setIsHovered(true)}
          onPointerUp={() => setIsHovered(false)}
          onClick={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Open blueprint"
        >
          <div
            className="pointer-events-none absolute -top-px -bottom-px -left-6 w-6 border-y border-sky-500/60 bg-sky-500/70 shadow-lg shadow-sky-500/20"
            aria-hidden="true"
          />
          <div className="flex h-full w-full flex-col items-end pr-[6px] justify-center gap-1 text-sky-100">
            <div className="flex flex-1 items-center"><ChevronRight className="w-4 h-4 opacity-70" /></div>
            <span
              className="text-xs tracking-widest opacity-90"
              style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
            >
              BLUEPRINT
            </span>
            <div className="flex flex-1 items-center"><ChevronRight className="w-4 h-4 opacity-70" /></div>
          </div>
        </button>
      </div>

      {/* Modal overlay */}
      <FeatureModal
        visible={isOpen}
        title={blueprintTitle}
        subTitle={blueprintSubTitle}
        onClose={() => setIsOpen(false)}
      >
        {(instructions || imageGrid) ? (
          <BlueprintInstructions
            instructions={instructions}
            imageGrid={imageGrid}
          />
        ) : (
          <p className="max-w-xl text-sm text-slate-300 sm:text-base">
            No instructions are available at this moment
          </p>
        )}
      </FeatureModal>
    </>
  )
}

function BlueprintInstructions({
  instructions,
  imageGrid,
}: {
  instructions?: BlueprintCircularInstructions | null
  imageGrid?: MinecraftBlock[][]
}) {
  const { onMobile, onMobileSideways, effectiveMaxDiameter, effectiveGridMaxSize } = useResponsiveDesign()

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

  const totalSteps = useMemo(() => {
    return instructions?.totalSteps || imageGrid?.[0].length || null
  }, [instructions, imageGrid])

  const numericStep = useMemo(() => {
    const n = parseInt(step, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.min(n, (totalSteps || 0));
  }, [step, totalSteps]);

  useEffect(() => {
    if (instructions) {
      const stepGrid = instructions.stepInstructions[(numericStep || 1)-1].stepGrid;
      const width = stepGrid[0].length
      const height = stepGrid.length
      setDiameter(Math.max(width, height).toLocaleString());
    }
  }, [instructions, setDiameter, numericStep])

  const instructionString = useMemo(() => {
    if (!instructions) return null;
    return instructions.stepInstructions[(numericStep || 1)-1].instructionString
  }, [instructions, numericStep]);

  const stepGrid = useMemo(() => {
    if (!instructions) return null;
    return instructions.stepInstructions[(numericStep || 1)-1].stepGrid
  }, [instructions, numericStep])

  const sliderLabel = useMemo(() => (
    imageGrid ? "Column" : "Step"
  ), [imageGrid])

  return (
    <div className="flex flex-col w-full h-full justify-start items-center overflow-y-auto">
      <div className={`
        ${onMobileSideways ? "mt-2" : "sticky top-2"} z-40 w-fit mx-auto
        bg-slate-800/95 backdrop-blur-sm
        py-2 rounded-xl shadow-md shadow-sky-900/30
        flex flex-col justify-center items-center gap-2
        ${onMobile ? "px-2" : "px-4"}
      `}>
        <IntegerSlider
          horizontal
          label={sliderLabel}
          value={step}
          onChange={setStep}
          maxValue={(totalSteps || 1)}
          sliderLength={effectiveGridMaxSize}
          showButtons
          showOutOfTotal
        />
        {instructions && (
          <p className={`
          text-slate-300 sm:text-base
            ${onMobile ? " max-w-2xs" : "max-w-lg"}
          `}>
            {instructionString}
          </p>
        )}
      </div>
      <div className={`flex flex-col pt-6 pb-12 items-center gap-5 ${onMobileSideways ? "" : "mt-2"}`}>
        {imageGrid && (
          <ImageBlueprintGridView
            grid={imageGrid}
            highlightedColumnIndex={(numericStep || 1)-1}
            blockSize={onMobile ? 24 : 32}
            backgroundOpacity={0.25}
          />
        )}
        {instructions && stepGrid && (
          <GridView
            grid={stepGrid}
            blockSize={blockSize}
            magnifierEnabled={magnifierEnabled}
            zoomBlockSize={zoomBlockSize}
          />
        )}
      </div>
    </div>
  )
}