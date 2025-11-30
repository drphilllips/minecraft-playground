
export default function Separator({
  orientation = "horizontal",
  className = "",
}: {
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      role="separator"
      className={
        "bg-slate-700/60 " +
        (isHorizontal ? "h-px w-full " : "w-px h-full ") +
        (className || "")
      }
    />
  );
}