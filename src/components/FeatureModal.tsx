import { useResponsiveDesign } from "../contexts/useResponsiveDesign"
import Separator from "./Separator"


export default function FeatureModal({
  visible,
  title,
  subTitle,
  onClose,
  children,
}: {
  visible: boolean
  title: string
  subTitle?: string
  onClose: () => void
  children?: React.ReactNode
}) {
  const { onMobile } = useResponsiveDesign();

  return (
    <>
      {visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
          <div className="relative flex flex-col w-[92vw] max-w-5xl h-[70vh] rounded-2xl border border-sky-500/70 bg-slate-900 shadow-2xl shadow-sky-500/30">
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
                  {title}
                </h2>
                {subTitle && (
                  <>
                    <Separator />
                    <p className="max-w-2xl font-bold leading-tight text-slate-400 text-lg text-center">
                      {subTitle.toUpperCase()}
                    </p>
                  </>
                )}
              </div>

              {/* Close button */}
              <button
                type="button"
                className="absolute right-4 top-4 rounded-full border border-slate-600 bg-slate-800/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-100 shadow-sm hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-start text-center">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}