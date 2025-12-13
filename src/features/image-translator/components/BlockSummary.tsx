import { useEffect, useState } from "react";
import { useResponsiveDesign } from "../../../contexts/useResponsiveDesign";
import type { BlockSummary } from "../../../types/gridOutput";
import { BLOCK_NAMES } from "../constants/blockNames";
import type { BlockId } from "../types/blockId";
import { formatBlockCount } from "../utils/blockSummary";
import { ChevronRight } from "lucide-react";
import HoverTagContainer from "../../../components/HoverTagContainer";
import { BlockFilterButton } from "./BlockFilter";
import type { BlockFilter } from "../types/blockFilter";
import BlockTexture from "./BlockTexture";
import HoverableOpacity from "../../../components/HoverableOpacity";

export default function BlockSummaryView({
  blockSummary,
  blockFilter,
  setBlockFilterViewOpen,
}: {
  blockSummary: BlockSummary
  blockFilter: BlockFilter
  setBlockFilterViewOpen: (_: boolean) => void
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
      <HoverableOpacity
        onPress={() => setIsOpen((prev) => !prev)}
        className={`
          ${onMobile ? "rounded-md" : "px-3 py-2 rounded-xl"}
          w-full flex flex-row items-center gap-2
          justify-between
        `}
        activeColor={onMobile ? "bg-slate-800" : "bg-slate-600"}
        hoverClass="hover:bg-slate-800/60"
      >
        <div
          className={`
            ${onMobile ? "gap-1" : "gap-2"}
            flex flex-row items-center
          `}
        >
          <span className={`${onMobile ? "text-sm" : "text-lg"} text-left font-semibold text-slate-100`}>
            Blocks
          </span>
          <BlockFilterButton
            blockFilter={blockFilter}
            onPress={() => setBlockFilterViewOpen(true)}
          />
        </div>

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
      </HoverableOpacity>

      {isOpen && (
        <div
          className={
            (onMobile ? "grid grid-cols-3" : "grid grid-cols-5") + " gap-y-2 gap-x-4"
          }
        >
          {entries.map(([blockId, count]) => (
            <BlockCount
              key={blockId}
              blockId={blockId as BlockId}
              count={count}
              hoverActive={openBlockId === blockId}
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

function BlockCount({
  blockId,
  count,
  hoverActive,
  onToggle,
}: {
  blockId: BlockId;
  count: number;
  hoverActive: boolean;
  onToggle: () => void;
}) {
  const { onMobile } = useResponsiveDesign();

  return (
    <HoverTagContainer
      onToggle={onToggle}
      hoverActive={hoverActive}
      hoverText={BLOCK_NAMES[blockId as BlockId]}
      hoverSubText={formatBlockCount(count)}
      className="w-full h-full"
    >
      <BlockTexture
        blockId={blockId}
        className={onMobile ? "w-5 h-5" : "w-8 h-8"}
      />
      <span className={onMobile ? "ml-1 text-sm" : "ml-1 text-lg"}>{count}</span>
    </HoverTagContainer>
  )
}