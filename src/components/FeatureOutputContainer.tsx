

export default function FeatureOutputContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex">
      <div className="flex rounded-2xl border border-slate-700 bg-slate-950/80 p-3">
        {children}
      </div>
    </div>
  )
}