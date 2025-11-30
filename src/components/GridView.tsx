import { useEffect, useMemo, useRef, useState } from "react"
import { BLANK_CELL_STYLE } from "../constants/gridCellStyles";


const ZOOM_BLOCK_SIZE = 16;
const ZOOM_RADIUS = 4;

export default function GridView({
  grid,
  blockSize,
  width,
  height,
  magnifierEnabled,
}: {
  grid: string[][]
  blockSize: number
  width: number
  height: number
  magnifierEnabled: boolean
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

    const radius = ZOOM_RADIUS; // window radius around the hovered cell (7x7)
    const height = grid.length;
    const width = grid[0]?.length ?? 0;
    const windowRows: string[][] = [];

    for (let y = hoverInfo.row - radius; y <= hoverInfo.row + radius; y++) {
      const row: string[] = [];
      for (let x = hoverInfo.col - radius; x <= hoverInfo.col + radius; x++) {
        if (y < 0 || y >= height || x < 0 || x >= width) {
          row.push(BLANK_CELL_STYLE);
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
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const gap = 2;
    const totalSize = blockSize + gap;

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
    const magWidth = cols * ZOOM_BLOCK_SIZE + (cols - 1) * gap;
    const magHeight = rows * ZOOM_BLOCK_SIZE + (rows - 1) * gap;

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
  }, [ref, magnifierEnabled, magnifierWindow, hoverInfo]);

  return (
    <div>
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
              let cellClasses = "border ";

              cellClasses += cell;

              return (
                <div
                  key={colIndex}
                  className={cellClasses}
                  style={{ width: blockSize, height: blockSize }}
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
                  let cellClasses = "border ";

                  cellClasses += cell

                  return (
                    <div
                      key={colIndex}
                      className={cellClasses}
                      style={{
                        width: ZOOM_BLOCK_SIZE,
                        height: ZOOM_BLOCK_SIZE,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}