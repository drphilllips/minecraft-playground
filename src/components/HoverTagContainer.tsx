import { useResponsiveDesign } from "../contexts/useResponsiveDesign"


export default function HoverTagContainer({
  onToggle,
  hoverActive,
  hoverText,
  hoverSubText,
  hoverBelow=false,
  children,
  className,
  style,
}: {
  onToggle: () => void
  hoverActive: boolean
  hoverText: string
  hoverSubText?: string
  hoverBelow?: boolean
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      onClick={onToggle}
      className={`relative group flex items-center cursor-pointer ${className ?? ""}`}
      style={style}
    >
      {children}

      <HoverTag
        open={hoverActive}
        text={hoverText}
        subText={hoverSubText}
        hoverBelow={hoverBelow}
      />
    </div>
  )
}


function HoverTag({
  open,
  text,
  subText,
  hoverBelow=false,
}: {
  open: boolean
  text: string
  subText?: string
  hoverBelow?: boolean
}) {
  const { onMobile } = useResponsiveDesign();

  return (
    <div
      className={
        `pointer-events-none items-center absolute
        ${hoverBelow
          ? "left-1/2 -translate-x-1/2 top-full mt-1"
          : "-top-1 left-1/2 -translate-x-1/2 -translate-y-full"
        }
        transition-opacity duration-250 z-30 ` +
        (open ? "opacity-100 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100")
      }
    >
      <div className="w-full flex flex-col items-center justify-center text-center rounded-2xl border border-slate-700 bg-slate-950/90 px-3 py-2 shadow-lg">
        <p className={`${onMobile ? "text-xs" : "text-sm"} font-semibold text-slate-100`}>
          {text}
        </p>
        {subText && (
          <p className={`${onMobile ? "text-xs" : "text-sm"} text-slate-300 whitespace-nowrap text-center`}>
            {subText}
          </p>
        )}
      </div>
    </div>
  )
}