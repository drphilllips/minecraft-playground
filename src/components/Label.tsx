

export default function BlankLabel({
  text,
  style,
}: {
  text: string
  style?: React.CSSProperties
}) {


  return (
    <p
      className="text-start text-sm md:text-base text-slate-500 italic leading-relaxed"
      style={style}
    >
      {text}
    </p>
  )
}