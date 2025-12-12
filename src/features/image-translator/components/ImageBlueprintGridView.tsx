import { useMemo } from "react";
import type { MinecraftBlock } from "../types/minecraftBlock";
import indexGridByColumns from "../utils/indexGridByColumns";
import { IMAGE_BLUEPRINT_BG_DISPLAY_RADIUS } from "../constants/imageBlueprint";
import { FeatureOutputContainer } from "../../../components/FeaturePage";
import { BlockGrid } from "../../../components/GridView";
import { useResponsiveDesign } from "../../../contexts/useResponsiveDesign";


export default function ImageBlueprintGridView({
  grid,
  blockSize,
  highlightedColumnIndex,
  backgroundOpacity=0.5,
}: {
  grid: MinecraftBlock[][]
  blockSize: number
  highlightedColumnIndex: number
  backgroundOpacity?: number
}) {
  const gridByColumns = useMemo(() => indexGridByColumns(grid), [grid]);

  const leftBackgroundGrid = useMemo(() => (
    gridByColumns.slice(
      Math.max(0, highlightedColumnIndex-IMAGE_BLUEPRINT_BG_DISPLAY_RADIUS),
      highlightedColumnIndex,
    )
  ), [gridByColumns, highlightedColumnIndex])

  const highlightedColumnGrid = useMemo(() => (
    [gridByColumns[highlightedColumnIndex]]
  ), [gridByColumns, highlightedColumnIndex])

  const rightBackgroundGrid = useMemo(() => (
    gridByColumns.slice(
      highlightedColumnIndex+1,
      Math.min(gridByColumns.length, highlightedColumnIndex+1+IMAGE_BLUEPRINT_BG_DISPLAY_RADIUS),
    )
  ), [gridByColumns, highlightedColumnIndex])

  const lastColumnHighlighted = useMemo(() => (
    highlightedColumnIndex === gridByColumns.length-1
  ), [gridByColumns, highlightedColumnIndex])

  return (
    <FeatureOutputContainer>
      <BlockGrid
        grid={leftBackgroundGrid}
        blockSize={blockSize}
        indexedByColumn
        opacity={backgroundOpacity}
      />
      <div className="flex flex-row px-[2px]">
        <BlockGrid
          grid={highlightedColumnGrid}
          blockSize={blockSize}
          indexedByColumn
        />
        <BlockVerbose
          grid={highlightedColumnGrid}
          blockSize={blockSize}
          lastColumn={lastColumnHighlighted}
        />
      </div>
      <BlockGrid
        grid={rightBackgroundGrid}
        blockSize={blockSize}
        indexedByColumn
        opacity={backgroundOpacity}
      />
    </FeatureOutputContainer>
  )
}

function BlockVerbose({
  grid,
  blockSize,
  lastColumn,
}: {
  grid: MinecraftBlock[][]
  blockSize: number
  lastColumn: boolean
}) {
  const { onMobile } = useResponsiveDesign();

  if (!grid || grid.length === 0) return null;

  const column = grid[0] ?? [];

  // Group consecutive identical blocks (by id or name) into runs
  const groups: { block: MinecraftBlock; count: number }[] = [];
  for (let i = 0; i < column.length; i++) {
    const curr = column[i];
    const currKey = curr?.id ?? curr?.name ?? "";
    if (groups.length === 0) {
      groups.push({ block: curr, count: 1 });
    } else {
      const prev = groups[groups.length - 1].block;
      const prevKey = prev?.id ?? prev?.name ?? "";
      if (currKey === prevKey) {
        groups[groups.length - 1].count += 1;
      } else {
        groups.push({ block: curr, count: 1 });
      }
    }
  }

  return (
    <div className="flex flex-col gap-[2px]">
      {groups.map((group, groupIndex) => {
        const { block, count } = group;
        const groupHeight = blockSize * count + 2 * (count - 1);
        return (
          <div
            key={groupIndex}
            className={`
              border-y border-r border-slate-700
              bg-slate-900/80 text-slate-100
              flex items-start truncate
              ${(lastColumn && groupIndex === 0) && "rounded-tr-lg"}
              ${(lastColumn && groupIndex === groups.length - 1) && "rounded-br-lg"}
            `}
            style={{
              padding: blockSize / 4,
              height: groupHeight,
              minHeight: groupHeight,
              fontSize: onMobile ? 8 : 12,
              lineHeight: onMobile ? "12px" : "16px" // matches roughly 1.5 / 1.333 ratios
            }}
          >
            {block?.name ?? ""}
            {count > 1 ? ` x ${count}` : ""}
          </div>
        );
      })}
    </div>
  );
}