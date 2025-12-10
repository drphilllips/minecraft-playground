import { useResponsiveDesign } from "../../../contexts/useResponsiveDesign";
import type { BlockSummary } from "../../../types/gridOutput";
import { BLOCK_NAMES } from "../constants/blockNames";
import type { BlockId } from "../types/blockId";
import { formatBlockCount } from "../utils/blockSummary";

export default function BlockSummary({
  blockSummary,
}: {
  blockSummary: BlockSummary;
}) {
  const { onMobile, effectiveGridMaxSize } = useResponsiveDesign();

  const entries = Object.entries(blockSummary).filter(([, count]) =>
    typeof count === "number" && count > 0
  ) as [string, number][];

  if (entries.length === 0) {
    return null;
  }

  return (
    <div
      className={
        (onMobile ? "grid grid-cols-3" : "grid grid-cols-5") + " gap-y-2 gap-x-4"
      }
      style={{ width: effectiveGridMaxSize }}
    >
      {entries.map(([blockId, count]) => (
        <div
          key={blockId}
          className="relative group flex items-center w-full h-full"
        >
          <img
            src={`/textures/blocks/${blockId}.png`}
            alt={blockId}
            className={onMobile ? "w-5 h-5" : "w-8 h-8"}
          />
          <span className={onMobile ? "ml-1 text-sm" : "ml-1 text-lg"}>{count}</span>

          <div className="pointer-events-none items-center absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-250 z-50">
            <div className="w-full flex flex-col items-center justify-center text-center rounded-2xl border border-slate-700 bg-slate-950/90 px-3 py-2 shadow-lg">
              <p className={`${onMobile ? "text-xs" : "text-sm"} font-semibold text-slate-100`}>
                {BLOCK_NAMES[blockId as BlockId]}
              </p>
              <p className={`${onMobile ? "text-xs" : "text-sm"} text-slate-300 whitespace-nowrap text-center`}>
                {formatBlockCount(count)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}