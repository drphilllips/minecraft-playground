import { useMemo } from "react";
import type { MinecraftBlock } from "../types/minecraftBlock";
import indexGridByColumns from "../utils/indexGridByColumns";
import { IMAGE_BLUEPRINT_MOBILE_BG_DISPLAY_RADIUS, IMAGE_BLUEPRINT_MOBILE_FONT_SIZE, IMAGE_BLUEPRINT_MOBILE_LINE_HEIGHT, IMAGE_BLUEPRINT_MOBILE_VERBOSE_WIDTH, IMAGE_BLUEPRINT_WEB_BG_DISPLAY_RADIUS, IMAGE_BLUEPRINT_WEB_FONT_SIZE, IMAGE_BLUEPRINT_WEB_LINE_HEIGHT, IMAGE_BLUEPRINT_WEB_VERBOSE_WIDTH } from "../constants/imageBlueprint";
import { FeatureOutputContainer } from "../../../components/FeaturePage";
import { BlockGrid } from "../../../components/GridView";
import { useResponsiveDesign } from "../../../contexts/useResponsiveDesign";
import type { ImageBlueprintBlockGroupInfo } from "../types/imageBlueprint";


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
  const { onMobile } = useResponsiveDesign();

  const gridByColumns = useMemo(() => indexGridByColumns(grid), [grid]);

  const backgroundDisplayRadius = useMemo(() => (
    onMobile
    ? IMAGE_BLUEPRINT_MOBILE_BG_DISPLAY_RADIUS
    : IMAGE_BLUEPRINT_WEB_BG_DISPLAY_RADIUS
  ), [onMobile])

  const leftBackgroundGrid = useMemo(() => (
    gridByColumns.slice(
      Math.max(0, highlightedColumnIndex-backgroundDisplayRadius),
      highlightedColumnIndex,
    )
  ), [gridByColumns, highlightedColumnIndex, backgroundDisplayRadius])

  const highlightedColumnGrid = useMemo(() => (
    [gridByColumns[highlightedColumnIndex]]
  ), [gridByColumns, highlightedColumnIndex])

  const rightBackgroundGrid = useMemo(() => (
    gridByColumns.slice(
      highlightedColumnIndex+1,
      Math.min(gridByColumns.length, highlightedColumnIndex+1+backgroundDisplayRadius),
    )
  ), [gridByColumns, highlightedColumnIndex, backgroundDisplayRadius])

  const lastColumnHighlighted = useMemo(() => (
    highlightedColumnIndex === gridByColumns.length-1
  ), [gridByColumns, highlightedColumnIndex])

  return (
    <FeatureOutputContainer>
      <div className="flex flex-row gap-[2px]">
        <BlockGrid
          grid={leftBackgroundGrid}
          blockSize={blockSize}
          indexedByColumn
          opacity={backgroundOpacity}
        />
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
        <BlockGrid
          grid={rightBackgroundGrid}
          blockSize={blockSize}
          indexedByColumn
          opacity={backgroundOpacity}
        />
      </div>
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

  const width = useMemo(() => (
    onMobile
    ? IMAGE_BLUEPRINT_MOBILE_VERBOSE_WIDTH
    : IMAGE_BLUEPRINT_WEB_VERBOSE_WIDTH
  ), [onMobile]);

  const fontSize = useMemo(() => (
    onMobile
    ? IMAGE_BLUEPRINT_MOBILE_FONT_SIZE
    : IMAGE_BLUEPRINT_WEB_FONT_SIZE
  ), [onMobile]);

  const lineHeight = useMemo(() => (
    onMobile
    ? IMAGE_BLUEPRINT_MOBILE_LINE_HEIGHT
    : IMAGE_BLUEPRINT_WEB_LINE_HEIGHT
  ), [onMobile]);

  if (!grid || grid.length === 0) return null;

  const column = grid[0] ?? [];

  // Group consecutive identical blocks (by id or name) into runs
  const groups: ImageBlueprintBlockGroupInfo[] = [];
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
              flex items-start
              ${(lastColumn && groupIndex === 0) && "rounded-tr-lg"}
              ${(lastColumn && groupIndex === groups.length - 1) && "rounded-br-lg"}
            `}
            style={{
              height: groupHeight,
              minHeight: groupHeight,
              fontSize,
              lineHeight,
            }}
          >
            <div
              className="flex flex-row justify-start items-center px-1"
              style={{ height: blockSize }}
            >
              <span
                className="inline-block truncate text-start"
                style={{ width, maxWidth: width }}
              >
                {block.name}
              </span>
              {count > 1 && (
                <span className="ml-1 whitespace-nowrap">
                  {`x ${count}`}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}