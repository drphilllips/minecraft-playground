import { useResponsiveDesign } from "../contexts/useResponsiveDesign"


export default function HoverTagContainer({
  onToggle,
  isOpen,
  isHovered,
  anyOpen,
  onHoverChange,
  hoverText,
  hoverSubText,
  hoverBelow = false,
  children,
  hoverActionComponent,
  className,
  style,
}: {
  onToggle: () => void
  isOpen: boolean
  isHovered: boolean
  anyOpen: boolean
  onHoverChange: (_: boolean) => void
  hoverText: string
  hoverSubText?: string
  hoverBelow?: boolean
  children: React.ReactNode
  hoverActionComponent: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const { onMobile } = useResponsiveDesign();

  const displayHoverTag = isOpen || (!anyOpen && isHovered)

  return (
    <div
      onClick={!onMobile ? onToggle : undefined}
      onPointerDown={onMobile ? () => onToggle() : undefined}
      onPointerEnter={!onMobile ? () => onHoverChange(true) : undefined}
      onPointerLeave={!onMobile ? () => onHoverChange(false) : undefined}
      className={`relative flex items-center cursor-pointer ${className ?? ""}`}
      style={style}
    >
      {children}

      <HoverTag
        open={displayHoverTag}
        text={hoverText}
        subText={hoverSubText}
        actionComponent={hoverActionComponent}
        hoverBelow={hoverBelow}
        stopPropogation={isOpen}
      />
    </div>
  )
}


function HoverTag({
  open,
  text,
  subText,
  actionComponent,
  hoverBelow=false,
  stopPropogation=false,
}: {
  open: boolean
  text: string
  subText?: string
  actionComponent?: React.ReactNode
  hoverBelow?: boolean
  stopPropogation?: boolean
}) {
  const { onMobile } = useResponsiveDesign();

  return (
    <div
      onClick={stopPropogation ? (e) => { e.stopPropagation() } : undefined}
      onPointerDown={stopPropogation ? (e) => { e.stopPropagation() } : undefined}
      onPointerUp={stopPropogation ? (e) => { e.stopPropagation() } : undefined}
      onPointerMove={stopPropogation ? (e) => { e.stopPropagation() } : undefined}
      onContextMenu={stopPropogation ? (e) => { e.stopPropagation() } : undefined}
      onWheel={stopPropogation ? (e) => { e.stopPropagation() } : undefined}
      className={
        `items-center absolute
        ${hoverBelow
          ? "left-1/2 -translate-x-1/2 top-full mt-1"
          : "-top-1 left-1/2 -translate-x-1/2 -translate-y-full"
        }
        transition-opacity duration-250 z-30 cursor-default ` +
        (open
          ? stopPropogation
            ? "opacity-100 pointer-events-auto"
            : "opacity-100 pointer-events-none"
          : "opacity-0 pointer-events-none"
        )
      }
    >
      <div className={`
        w-full flex flex-col items-center justify-center
        text-center rounded-2xl border
        border-slate-700 bg-slate-950/90
        px-3 pt-2 ${actionComponent ? "pb-3" : "pb-2"} shadow-lg gap-1
      `}>
        <div className="">
          <p className={`${onMobile ? "text-xs" : "text-sm"} font-semibold text-slate-100`}>
            {text}
          </p>
          {subText && (
            <p className={`${onMobile ? "text-xs" : "text-sm"} text-slate-300 whitespace-nowrap text-center`}>
              {subText}
            </p>
          )}
        </div>
        {actionComponent}
      </div>
    </div>
  )
}