import { useResponsiveDesign } from "../contexts/useResponsiveDesign"


export default function HoverableOpacity({
  onPress,
  children,
  activeColor,
  activeClass,
  hoverClass,
  className,
}: {
  onPress?: () => void
  children?: React.ReactNode
  activeColor?: string
  activeClass?: string
  hoverClass?: string
  className?: string
}) {
  const { onMobile } = useResponsiveDesign();

  return (
    <button
      type="button"
      onClick={(e) => {
        // Prevent parent containers from also receiving this click
        e.stopPropagation();
        onPress?.();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
      className={`
        ${onMobile
          ? activeClass ? activeClass : `active:${activeColor}/60 active-opacity-80`
          : hoverClass ? hoverClass : `hover:${activeColor}/60`
        }
        ${onPress ? "select-none cursor-pointer" : ""}
        transition-colors duration-200
        ${className}
      `}
    >
      {children}
    </button>
  )
}