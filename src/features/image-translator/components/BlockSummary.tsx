import { useEffect, useState } from "react";
import { useResponsiveDesign } from "../../../contexts/useResponsiveDesign";
import type { BlockSummary } from "../../../types/gridOutput";
import { BLOCK_NAMES } from "../constants/blockNames";
import type { BlockId } from "../types/blockId";
import { formatBlockCount } from "../utils/blockSummary";
import { ChevronRight } from "lucide-react";

export default function BlockSummary({
  blockSummary,
}: {
  blockSummary: BlockSummary;
}) {
  const { onMobile, effectiveGridMaxSize } = useResponsiveDesign();
  const [openBlockId, setOpenBlockId] = useState<BlockId | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!onMobile || !isOpen) {
      setTimeout(() => setOpenBlockId(null), 0);
    }
  }, [onMobile, isOpen]);

  const entries = Object.entries(blockSummary).filter(([, count]) =>
    typeof count === "number" && count > 0
  ) as [string, number][];

  if (entries.length === 0) {
    return null;
  }

  const totalBlocks = entries.reduce((sum, [, count]) => sum + count, 0);
  const uniqueBlocks = entries.length;

  return (
    <div style={{ width: effectiveGridMaxSize }} className="space-y-2">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${onMobile ? "active:bg-slate-800/60 active:opacity-90" : "px-3 py-2"} w-full flex items-center justify-between rounded-2xl bg-slate-900/60 hover:bg-slate-800/70 transition-colors duration-200`}
      >
        <span className={`${onMobile ? "text-sm" : "text-lg"} text-left font-semibold text-slate-100`}>
          Blocks
        </span>
        <span
          className={`${onMobile ? "text-sm gap-1" : "text-base gap-2"} text-slate-300 flex items-center justify-end whitespace-nowrap text-right`}
        >
          {`${totalBlocks.toLocaleString()}${onMobile ? "" : " total"} / ${uniqueBlocks.toLocaleString()}${onMobile ? "" : " unique"}`}
          <ChevronRight
            className={
              `ml-1 ${onMobile ? "h-4 w-4" : "h-5 w-5"} transition-transform duration-200 ` +
              (isOpen ? "rotate-90" : "rotate-0")
            }
          />
        </span>
      </button>

      {isOpen && (
        <div
          className={
            (onMobile ? "grid grid-cols-3" : "grid grid-cols-5") + " gap-y-2 gap-x-4"
          }
        >
          {entries.map(([blockId, count]) => (
            <SummaryTag
              key={blockId}
              blockId={blockId as BlockId}
              count={count}
              open={openBlockId === blockId}
              onToggle={() =>
                setOpenBlockId((prev) => (prev === blockId ? null : (blockId as BlockId)))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryTag({
  blockId,
  count,
  open,
  onToggle,
}: {
  blockId: BlockId;
  count: number;
  open: boolean;
  onToggle: () => void;
}) {
  const { onMobile } = useResponsiveDesign();

  return (
    <div
      onClick={onToggle}
      className="relative group flex items-center w-full h-full cursor-pointer"
    >
      <img
        src={`/textures/blocks/${blockId}.png`}
        alt={blockId}
        className={onMobile ? "w-5 h-5" : "w-8 h-8"}
      />
      <span className={onMobile ? "ml-1 text-sm" : "ml-1 text-lg"}>{count}</span>

      <div
        className={
          `pointer-events-none items-center absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full transition-opacity duration-250 z-50 ` +
          (open ? "opacity-100 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100")
        }
      >
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
  )
}