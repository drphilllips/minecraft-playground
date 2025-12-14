import { useEffect, useState } from "react";
import { useResponsiveDesign } from "../../../contexts/useResponsiveDesign";
import type { BlockSummary } from "../../../types/gridOutput";
import { BLOCK_NAMES } from "../constants/blockNames";
import type { BlockId } from "../types/blockId";
import { formatBlockCount } from "../utils/blockSummary";
import { ChevronRight, X } from "lucide-react";
import HoverTagContainer from "../../../components/HoverTagContainer";
import { BlockFilterButton } from "./BlockFilter";
import type { BlockFilter } from "../types/blockFilter";
import BlockTexture from "./BlockTexture";
import HoverableOpacity from "../../../components/HoverableOpacity";
import { BLOCK_MATERIALS } from "../constants/blockMaterials";
import { getAvailableBlocksOfMaterial } from "../utils/ensureSelectedMaterialHasAvailableBlocks";
import type { BlockMaterial } from "../types/blockMaterial";

export default function BlockSummaryView({
  blockSummary,
  blockFilter,
  setBlockFilterViewOpen,
  onRemoveBlock,
  removeMaterialFilter,
}: {
  blockSummary: BlockSummary
  blockFilter: BlockFilter
  setBlockFilterViewOpen: (_: boolean) => void
  onRemoveBlock: (_: BlockId) => void
  removeMaterialFilter: (_: BlockMaterial) => void
}) {
  const { onMobile, effectiveGridMaxSize } = useResponsiveDesign();
  const [openBlockId, setOpenBlockId] = useState<BlockId | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<BlockId | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!onMobile || !isOpen) {
      setTimeout(() => {
        setOpenBlockId(null)
        setHoveredBlockId(null)
      }, 0)
    }
  }, [onMobile, isOpen]);

  function removeBlockAndClearOpenBlockId(blockId: BlockId) {
    // If any block material has no more available blocks
    // then remove that material filter
    const blockMaterials = BLOCK_MATERIALS[blockId]
    blockMaterials.forEach(
      blockMaterial => {
        const availableMaterialBlocks = (
          getAvailableBlocksOfMaterial(blockFilter, blockMaterial)
        )
        console.log(availableMaterialBlocks);
        if (availableMaterialBlocks.length === 1) {
          console.log("Remove filter", blockMaterial);
          // This is the last block of this material
          // So, remove the material filter
          removeMaterialFilter(blockMaterial);
        }
      }
    );

    onRemoveBlock(blockId);
    if (blockId === openBlockId) setOpenBlockId(null);
  }

  const entries = Object.entries(blockSummary).filter(([, count]) =>
    typeof count === "number" && count > 0
  ) as [BlockId, number][];

  if (entries.length === 0) {
    return null;
  }

  const totalBlocks = entries.reduce((sum, [, count]) => sum + count, 0);
  const uniqueBlocks = entries.length;

  return (
    <div
      style={{ width: effectiveGridMaxSize }}
      className={`space-y-2 ${isOpen ? (onMobile ? "pb-1" : "pb-2") : ""}`}
    >
      <HoverableOpacity
        onPress={() => setIsOpen((prev) => !prev)}
        className={`
          ${onMobile ? "rounded-md" : "px-2 py-1 rounded-lg"}
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
            (onMobile ? "grid grid-cols-3" : "grid grid-cols-5 px-2") + " gap-y-2 gap-x-4"
          }
        >
          {entries.map(([blockId, count]) => (
            <BlockCountTag
              key={blockId}
              blockId={blockId as BlockId}
              count={count}
              isOpen={openBlockId === blockId}
              isHovered={hoveredBlockId === blockId}
              anyOpen={openBlockId !== null}
              onToggle={() =>
                setOpenBlockId((prev) => (prev === blockId ? null : (blockId as BlockId)))
              }
              onHoverChange={(hovered) =>
                setHoveredBlockId(hovered ? (blockId as BlockId) : null)
              }
              onRemoveBlock={() => removeBlockAndClearOpenBlockId(blockId)}
              blockRemovable={entries.length > 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BlockCountTag({
  blockId,
  count,
  isOpen,
  isHovered,
  anyOpen,
  onToggle,
  onHoverChange,
  onRemoveBlock,
  blockRemovable,
}: {
  blockId: BlockId;
  count: number;
  isOpen: boolean;
  isHovered: boolean;
  anyOpen: boolean;
  onToggle: () => void;
  onHoverChange: (_: boolean) => void;
  onRemoveBlock: () => void;
  blockRemovable: boolean
}) {
  const { onMobile } = useResponsiveDesign();

  return (
    <HoverTagContainer
      onToggle={onToggle}
      isOpen={isOpen}
      isHovered={isHovered}
      anyOpen={anyOpen}
      onHoverChange={onHoverChange}
      hoverText={BLOCK_NAMES[blockId as BlockId]}
      hoverSubText={formatBlockCount(count)}
      className="w-full h-full"
      hoverActionComponent={(
        (isOpen && blockRemovable) && (
          <HoverableOpacity
            onPress={onRemoveBlock}
            className={`
              flex flex-row items-center
              gap-1 p-1 rounded-md
              bg-red-500/30 border border-red-500/80
              z-20 cursor-pointer
            `}
            activeColor="bg-red-800"
          >
            <p className="text-red-500 text-xs">Remove</p>
            <X className="w-4 h-4 text-red-500" />
          </HoverableOpacity>
        )
      )}
    >
      <BlockTexture
        blockId={blockId}
        className={onMobile ? "w-5 h-5" : "w-8 h-8"}
      />
      <span className={onMobile ? "ml-1 text-sm" : "ml-1 text-lg"}>{count}</span>
    </HoverTagContainer>
  )
}