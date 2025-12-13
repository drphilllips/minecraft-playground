import React, { useEffect, useMemo, useState } from "react"
import { ChevronRight } from "lucide-react"
import type { BlueprintCircularInstructions } from "../types/blueprintInstruction"
import IntegerSlider from "./IntegerSlider"
import GridView from "./GridView"
import Separator from "./Separator"
import useCircularGridView from "../hooks/useCircularGridView"
import { useResponsiveDesign } from "../contexts/useResponsiveDesign"
import ImageBlueprintGridView from "../features/image-translator/components/ImageBlueprintGridView"
import type { MinecraftBlock } from "../features/image-translator/types/minecraftBlock"


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
  const { onMobile } = useResponsiveDesign();

  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const baseWidth = "1.75rem"
  const expandedWidth = "2.75rem"

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleOpen()
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
          onClick={handleOpen}
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
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
          <div className="relative flex flex-col w-[92vw] max-w-5xl h-[80vh] rounded-2xl border border-sky-500/70 bg-slate-900 shadow-2xl shadow-sky-500/30">
            <div className="relative flex flex-row w-full items-center">
              {/* Title & Subtitle */}
              <div
                className={`
                  inline-flex flex-col gap-1 items-center
                  w-fit mx-auto pb-2
                  ${onMobile ? "pt-12" : "pt-4"}
                `}
              >
                <h2 className="text-3xl font-bold text-slate-100 tracking-tight text-center">
                  {blueprintTitle}
                </h2>
                <Separator />
                <p className="max-w-2xl font-bold leading-tight text-slate-400 text-lg text-center">
                  {blueprintSubTitle.toUpperCase()}
                </p>
              </div>


              {/* Close button */}
              <button
                type="button"
                className="absolute right-4 top-4 rounded-full border border-slate-600 bg-slate-800/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-100 shadow-sm hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                onClick={handleClose}
              >
                Close
              </button>
            </div>

            {/* Placeholder content */}
            <div className="flex-1 min-h-0 flex flex-col items-center justify-start text-center">
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
            </div>
          </div>
        </div>
      )}
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
      <div className={`flex flex-col pt-8 pb-12 items-center gap-5 ${onMobileSideways ? "" : "mt-2"}`}>
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