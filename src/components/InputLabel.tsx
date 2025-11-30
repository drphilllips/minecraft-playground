

export default function InputLabel({
  label,
  closer=false,
}: {
  label: string;
  closer?: boolean;
}) {
  return (
    <label className={`block text-sm font-medium ${closer ? "mb-1" : "mb-2"}`}>
      {label}
    </label>
  )
}