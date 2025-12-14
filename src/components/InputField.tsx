

export default function InputField({
  label,
  closer=false,
  children,
  labelHelperComponent,
  className,
}: {
  label: string;
  closer?: boolean;
  children?: React.ReactNode;
  labelHelperComponent?: React.ReactNode;
  className?: string
}) {
  return (
    <div className={`flex flex-col items-start ${closer ? "gap-1" : "gap-2"} ${className}`}>
      <div className="flex flex-row items-center gap-2">
        <label className="block text-sm font-medium">
          {label}
        </label>
        {labelHelperComponent}
      </div>

      {children}
    </div>
  )
}