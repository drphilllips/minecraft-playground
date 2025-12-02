

export default function InputField({
  label,
  closer=false,
  children,
}: {
  label: string;
  closer?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col ${closer ? "gap-1" : "gap-2"}`}>
      <label className="block text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}