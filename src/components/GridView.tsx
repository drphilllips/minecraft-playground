import type React from "react";
import { BLANK_CELL_STYLE } from "../constants/gridCellStyles";
import { WEB_DEFAULT_ZOOM_BLOCK_SIZE } from "../constants/responsiveDesign";
import { FeatureOutputContainer } from "./FeaturePage";
import type { MinecraftBlock } from "../features/image-translator/types/minecraftBlock";
import useGridViewMagnifier from "../hooks/useGridViewMagnifier";
import type { GridSquare, HoverInfo, MagnifierStyle } from "../types/gridView";

export default function GridView({
  grid,
  blockSize,
  width,
  height,
  magnifierEnabled,
  zoomBlockSize=WEB_DEFAULT_ZOOM_BLOCK_SIZE,
  lite=false,
}: {
  grid: string[][] | MinecraftBlock[][]
  blockSize: number
  width?: number
  height?: number
  magnifierEnabled: boolean
  zoomBlockSize?: number
  lite?: boolean
}) {
  const {
    ref,
    handleGridMouseMove,
    setHoverInfo,
    magnifierWindow,
    hoverInfo,
    magnifierStyle,
  } = useGridViewMagnifier({
    grid, blockSize, magnifierEnabled, zoomBlockSize
  });

  return (
    <FeatureOutputContainer>
      {/* Grid */}
      <BlockGrid
        grid={grid}
        blockSize={blockSize}
        width={width}
        height={height}
        lite={lite}
        ref={ref}
        handleGridMouseMove={handleGridMouseMove}
        setHoverInfo={setHoverInfo}
      />

      {/* Magnifier */}
      <GridViewMagnifier
        enabled={magnifierEnabled}
        hoverInfo={hoverInfo}
        magnifierStyle={magnifierStyle}
        magnifierWindow={magnifierWindow}
        zoomBlockSize={zoomBlockSize}
      />
    </FeatureOutputContainer>
  )
}

export function BlockGrid({
  grid,
  blockSize,
  width,
  height,
  lite=false,
  ref,
  handleGridMouseMove,
  setHoverInfo,
  indexedByColumn=false,
  opacity=1.0,
}: {
  grid: string[][] | MinecraftBlock[][]
  blockSize: number
  width?: number
  height?: number
  lite?: boolean
  ref?: React.RefObject<HTMLDivElement | null>
  handleGridMouseMove?: React.MouseEventHandler<HTMLDivElement>
  setHoverInfo?: React.Dispatch<React.SetStateAction<HoverInfo | null>>
  indexedByColumn?: boolean
  opacity?: number
}) {
  return (
    <div
      ref={ref}
      className={indexedByColumn ? "flex items-center justify-center flex-row space-x-[2px]" : "flex items-center justify-center flex-col space-y-[2px]"}
      onMouseMove={handleGridMouseMove}
      onMouseLeave={() => setHoverInfo?.(null)}
      style={{
        width,
        height,
      }}
    >
      {indexedByColumn
        ? (
          // grid[n] is a column; render columns horizontally, cells stacked vertically
          grid.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-[2px]">
              {column.map((cell, rowIndex) => {
                const style: React.CSSProperties = {
                  width: blockSize,
                  height: blockSize,
                };
                style.opacity = opacity;

                let cellClasses = "";

                if (typeof cell === "string") {
                  cellClasses = "border " + cell;
                } else if (lite) {
                  const { r, g, b } = cell.color.rgb;
                  style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                } else {
                  style.backgroundImage = `url(/textures/blocks/${cell.id}.png)`;
                  style.backgroundSize = "cover";
                  style.backgroundRepeat = "no-repeat";
                  style.imageRendering = "pixelated";
                }

                return (
                  <div
                    key={rowIndex}
                    className={cellClasses}
                    style={style}
                  />
                );
              })}
            </div>
          ))
        ) : (
          // grid[n] is a row; render rows vertically, cells laid out horizontally
          grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-[2px]">
              {row.map((cell, colIndex) => {
                const style: React.CSSProperties = {
                  width: blockSize,
                  height: blockSize,
                };
                style.opacity = opacity;

                let cellClasses = "";

                if (typeof cell === "string") {
                  cellClasses = "border " + cell;
                } else if (lite) {
                  const { r, g, b } = cell.color.rgb;
                  style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                } else {
                  style.backgroundImage = `url(/textures/blocks/${cell.id}.png)`;
                  style.backgroundSize = "cover";
                  style.backgroundRepeat = "no-repeat";
                  style.imageRendering = "pixelated";
                }

                return (
                  <div
                    key={colIndex}
                    className={cellClasses}
                    style={style}
                  />
                );
              })}
            </div>
          ))
        )}
    </div>
  );
}

export function GridViewMagnifier({
  enabled,
  hoverInfo,
  magnifierStyle,
  magnifierWindow,
  zoomBlockSize=WEB_DEFAULT_ZOOM_BLOCK_SIZE,
}: {
  enabled: boolean
  hoverInfo: HoverInfo | null
  magnifierStyle: MagnifierStyle | null
  magnifierWindow: GridSquare[][] | null
  zoomBlockSize?: number
}) {
  return (
    <>
      {enabled && magnifierWindow && hoverInfo && magnifierStyle && (
        <div
          className="pointer-events-none fixed z-50 rounded-xl border border-slate-700 bg-slate-950/95 p-2 shadow-xl"
          style={magnifierStyle}
        >
          <div className="space-y-[2px]">
            {magnifierWindow.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-[2px]">
                {row.map((cell, colIndex) => {
                  const style: React.CSSProperties = {
                    width: zoomBlockSize,
                    height: zoomBlockSize,
                  };

                  let cellClasses = "";

                  if (cell == null) {
                    cellClasses = "border " + BLANK_CELL_STYLE;
                  } else if (typeof cell === "string") {
                    // String-based grids keep their border treatment
                    cellClasses = "border " + cell;
                  } else {
                    // Pixel grids: no extra border so the image stays true at high resolution
                    style.backgroundImage = `url(/textures/blocks/${cell.id}.png)`;
                    style.backgroundSize = "cover";
                    style.backgroundRepeat = "no-repeat";
                    style.imageRendering = "pixelated";
                  }

                  return (
                    <div
                      key={colIndex}
                      className={cellClasses}
                      style={style}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}