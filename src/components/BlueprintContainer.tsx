import React, { useState } from "react"
import { ChevronRight } from "lucide-react"

type BlueprintContainerProps = {
  children: React.ReactNode
}

export default function BlueprintContainer({ children }: BlueprintContainerProps) {
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
          <div className="relative w-[92vw] max-w-5xl h-[80vh] rounded-2xl border border-sky-500/70 bg-slate-900 shadow-2xl shadow-sky-500/30">
            {/* Close button */}
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full border border-slate-600 bg-slate-800/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-100 shadow-sm hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              onClick={handleClose}
            >
              Close
            </button>

            {/* Placeholder content */}
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
              <h2 className="text-lg font-semibold text-sky-100 sm:text-xl">
                Blueprint Workspace (Coming Soon)
              </h2>
              <p className="max-w-xl text-sm text-slate-300 sm:text-base">
                This modal will become your dedicated blueprint space for advanced Minecraft build
                planning. For now, it&apos;s just a blank canvas waiting for your next idea.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}