import { useEffect, useMemo, useRef, useState } from "react"
import type React from "react";
import { BLANK_CELL_STYLE } from "../constants/gridCellStyles";
import { WEB_DEFAULT_ZOOM_BLOCK_SIZE } from "../constants/responsiveDesign";
import { FeatureOutputContainer } from "./FeaturePage";
import type { RgbColor } from "../features/image-translator/types/color";


const ZOOM_RADIUS = 4;

export default function GridView({
  grid,
  blockSize,
  width,
  height,
  magnifierEnabled,
  zoomBlockSize=WEB_DEFAULT_ZOOM_BLOCK_SIZE,
}: {
  grid: string[][] | RgbColor[][]
  blockSize: number
  width?: number
  height?: number
  magnifierEnabled: boolean
  zoomBlockSize?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [magnifierStyle, setMagnifierStyle] = useState<{
    left: number;
    top: number;
  } | null>(null);

  const [hoverInfo, setHoverInfo] = useState<{
    row: number;
    col: number;
    clientX: number;
    clientY: number;
  } | null>(null);

  const magnifierWindow = useMemo(() => {
    if (!hoverInfo || !magnifierEnabled || grid.length === 0) return null;

    const isStringGrid = typeof grid[0]?.[0] === "string";

    const radius = ZOOM_RADIUS; // window radius around the hovered cell (7x7)
    const height = grid.length;
    const width = grid[0]?.length ?? 0;
    const windowRows: (string | RgbColor)[][] = [];

    for (let y = hoverInfo.row - radius; y <= hoverInfo.row + radius; y++) {
      const row: (string | RgbColor)[] = [];
      for (let x = hoverInfo.col - radius; x <= hoverInfo.col + radius; x++) {
        if (y < 0 || y >= height || x < 0 || x >= width) {
          if (isStringGrid) {
            row.push(BLANK_CELL_STYLE);
          } else {
            row.push({ r: 0, g: 0, b: 0, a: 0 });
          }
        } else {
          row.push(grid[y][x]);
        }
      }
      windowRows.push(row);
    }

    return windowRows;
  }, [hoverInfo, magnifierEnabled, grid]);

  const handleGridMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!magnifierEnabled || !ref.current || grid.length === 0) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const gap = 2;
    const totalSize = blockSize + gap;

    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;

    // Pixel dimensions of the actual grid content (excluding outer padding)
    const gridPixelWidth = cols > 0 ? cols * totalSize - gap : 0;
    const gridPixelHeight = rows > 0 ? rows * totalSize - gap : 0;

    const containerWidth = rect.width;
    const containerHeight = rect.height;

    // When the grid is centered within a larger container, compute the blank margins
    const marginX = Math.max(0, (containerWidth - gridPixelWidth) / 2);
    const marginY = Math.max(0, (containerHeight - gridPixelHeight) / 2);

    // Mouse position relative to the top-left corner of the grid content
    const offsetX = e.clientX - rect.left - marginX;
    const offsetY = e.clientY - rect.top - marginY;

    // If the mouse is in the padded area outside the grid content, ignore
    if (
      offsetX < 0 ||
      offsetY < 0 ||
      offsetX > gridPixelWidth ||
      offsetY > gridPixelHeight
    ) {
      setHoverInfo(null);
      return;
    }

    const col = Math.floor(offsetX / totalSize);
    const row = Math.floor(offsetY / totalSize);

    const maxRow = grid.length - 1;
    const maxCol = (grid[0]?.length ?? 1) - 1;

    if (row < 0 || row > maxRow || col < 0 || col > maxCol) {
      setHoverInfo(null);
      return;
    }

    setHoverInfo({
      row,
      col,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  useEffect(() => {
    if (
      !magnifierEnabled ||
      !magnifierWindow ||
      !hoverInfo ||
      !ref.current
    ) {
      return;
    }

    const previewRect = ref.current.getBoundingClientRect();
    const rows = magnifierWindow.length;
    const cols = magnifierWindow[0]?.length ?? 0;
    const gap = 2;
    const magWidth = cols * zoomBlockSize + (cols - 1) * gap;
    const magHeight = rows * zoomBlockSize + (rows - 1) * gap;

    const desiredLeft = hoverInfo.clientX - magWidth / 2;
    const desiredTop = hoverInfo.clientY - magHeight / 2;

    const minLeft = previewRect.left;
    const maxLeft = previewRect.right - magWidth;
    const minTop = previewRect.top;
    const maxTop = previewRect.bottom - magHeight;

    const clampedLeft = Math.min(Math.max(desiredLeft, minLeft), maxLeft);
    const clampedTop = Math.min(Math.max(desiredTop, minTop), maxTop);

    setMagnifierStyle({
      left: clampedLeft,
      top: clampedTop,
    });
  }, [ref, zoomBlockSize, magnifierEnabled, magnifierWindow, hoverInfo]);

  return (
    <FeatureOutputContainer>
      {/* Grid */}
      <div
        ref={ref}
        className="flex items-center justify-center flex-col space-y-[2px]"
        onMouseMove={handleGridMouseMove}
        onMouseLeave={() => setHoverInfo(null)}
        style={{
          width,
          height,
        }}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-[2px]">
            {row.map((cell, colIndex) => {
              const style: React.CSSProperties = {
                width: blockSize,
                height: blockSize,
              };

              let cellClasses = "";

              if (typeof cell === "string") {
                // String-based grids (circle/dome/etc.) still use Tailwind borders
                cellClasses = "border " + cell;
              } else {
                // Pixel grids: no extra border so colors don't get washed out at high resolutions
                const { r, g, b, a } = cell as RgbColor;
                const alpha = a <= 1 ? a : a / 255;
                style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

      {/* Magnifier */}
      {magnifierEnabled && magnifierWindow && hoverInfo && magnifierStyle && (
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

                  if (typeof cell === "string") {
                    // String-based grids keep their border treatment
                    cellClasses = "border " + cell;
                  } else {
                    // Pixel grids: no extra border so the image stays true at high resolution
                    const { r, g, b, a } = cell as RgbColor;
                    const alpha = a <= 1 ? a : a / 255;
                    style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
    </FeatureOutputContainer>
  )
}