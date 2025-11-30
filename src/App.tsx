import { useState, useMemo, useRef, useEffect } from "react";
import IntegerInput from "./components/IntegerInput";

// Cell type for the circle grid
type CellType = "none" | "edge" | "centerLine" | "centerOverlap";

const MAX_DIAMETER = 100;
const GRID_MAX_SIZE = 420; // max pixel width/height for the circle grid and its container
const ENABLE_MAGNIFIER_DIAMETER = 40;
const ZOOM_BLOCK_SIZE = 16;

function generateCircleGrid(d: number): CellType[][] {
  const size = Math.max(1, Math.floor(d));
  const r = size / 2;
  const inCircle: boolean[][] = [];

  // First pass: determine which cells are inside the circle
  for (let y = 0; y < size; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - r;
      const dy = y + 0.5 - r;
      const distSq = dx * dx + dy * dy;
      row.push(distSq <= r * r);
    }
    inCircle.push(row);
  }

  // Second pass: mark edge cells only (no filled interior)
  const grid: CellType[][] = [];
  for (let y = 0; y < size; y++) {
    const row: CellType[] = [];
    for (let x = 0; x < size; x++) {
      if (!inCircle[y][x]) {
        row.push("none");
        continue;
      }

      // Check 4-neighbors; if any neighbor is outside the circle, this is an edge.
      const neighbors: [number, number][] = [
        [y - 1, x],
        [y + 1, x],
        [y, x - 1],
        [y, x + 1],
      ];

      let isEdge = false;
      for (const [ny, nx] of neighbors) {
        if (ny < 0 || ny >= size || nx < 0 || nx >= size) {
          isEdge = true;
          break;
        }
        if (!inCircle[ny][nx]) {
          isEdge = true;
          break;
        }
      }

      row.push(isEdge ? "edge" : "none");
    }
    grid.push(row);
  }

  // Third pass: overlay center lines (north-south and east-west)
  if (size >= 5) {
    const isEven = size % 2 === 0;
    const centerCols: number[] = [];
    const centerRows: number[] = [];

    if (isEven) {
      centerCols.push(size / 2 - 1, size / 2);
      centerRows.push(size / 2 - 1, size / 2);
    } else {
      centerCols.push(Math.floor(size / 2));
      centerRows.push(Math.floor(size / 2));
    }

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!inCircle[y][x]) continue;

        const onVertical = centerCols.includes(x);
        const onHorizontal = centerRows.includes(y);

        if (!onVertical && !onHorizontal) continue;

        if (grid[y][x] === "edge") {
          continue;
        }

        if (onVertical && onHorizontal) {
          grid[y][x] = "centerOverlap";
        } else {
          grid[y][x] = "centerLine";
        }
      }
    }
  }

  return grid;
}

export default function App() {
  const [diameter, setDiameter] = useState("7");
  const [hoverInfo, setHoverInfo] = useState<{
    row: number;
    col: number;
    clientX: number;
    clientY: number;
  } | null>(null);
  const [magnifierStyle, setMagnifierStyle] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const [viewportWidth, setViewportWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (typeof window !== "undefined") {
        setViewportWidth(window.innerWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const effectiveGridMaxSize = useMemo(() => {
    if (viewportWidth == null) return GRID_MAX_SIZE;

    // Treat narrow viewports as "mobile" and use a smaller max size
    if (viewportWidth < 640) {
      // Leave some margin on the sides, and clamp to a reasonable range
      const candidate = viewportWidth - 40;
      return Math.max(160, Math.min(260, candidate));
    }

    return GRID_MAX_SIZE;
  }, [viewportWidth]);

  const effectiveMaxDiameter = useMemo(() => {
    if (viewportWidth == null) return MAX_DIAMETER;
    // On "mobile" (narrow viewports), cap diameter at 50
    return viewportWidth < 640 ? 50 : MAX_DIAMETER;
  }, [viewportWidth]);


  const numericDiameter = useMemo(() => {
    const n = parseInt(diameter, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.min(n, effectiveMaxDiameter);
  }, [diameter, effectiveMaxDiameter]);

  const circleGrid = useMemo(() => {
    if (numericDiameter == null) return [];
    return generateCircleGrid(numericDiameter);
  }, [numericDiameter]);

  const blockSize = useMemo(() => {
    if (numericDiameter == null) return 16;

    const gap = 2; // matches gap-[2px] between cells
    const size = numericDiameter; // grid is size x size

    // Total pixels available for blocks after subtracting gaps
    const totalGaps = Math.max(0, size - 1);
    const maxPixelsForBlocks = effectiveGridMaxSize - totalGaps * gap;

    if (maxPixelsForBlocks <= 0) {
      // Fallback to a minimal size if something goes wrong
      return 2;
    }

    const rawBlockSize = maxPixelsForBlocks / size;

    // Clamp only the upper bound so we never exceed the effective max size,
    // but allow small blocks for large diameters so width == height.
    return Math.min(20, rawBlockSize);
  }, [numericDiameter, effectiveGridMaxSize]);

  const magnifierEnabled = useMemo(() => {
    if (numericDiameter == null) return false;
    return numericDiameter >= ENABLE_MAGNIFIER_DIAMETER;
  }, [numericDiameter]);

  const magnifierWindow = useMemo(() => {
    if (!hoverInfo || !magnifierEnabled || circleGrid.length === 0) return null;

    const radius = 3; // window radius around the hovered cell (7x7)
    const height = circleGrid.length;
    const width = circleGrid[0]?.length ?? 0;
    const windowRows: CellType[][] = [];

    for (let y = hoverInfo.row - radius; y <= hoverInfo.row + radius; y++) {
      const row: CellType[] = [];
      for (let x = hoverInfo.col - radius; x <= hoverInfo.col + radius; x++) {
        if (y < 0 || y >= height || x < 0 || x >= width) {
          row.push("none");
        } else {
          row.push(circleGrid[y][x]);
        }
      }
      windowRows.push(row);
    }

    return windowRows;
  }, [hoverInfo, magnifierEnabled, circleGrid]);

  const handleGridMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!magnifierEnabled || !gridRef.current || circleGrid.length === 0) {
      return;
    }
    const rect = gridRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const gap = 2;
    const totalSize = blockSize + gap;

    const col = Math.floor(offsetX / totalSize);
    const row = Math.floor(offsetY / totalSize);

    const maxRow = circleGrid.length - 1;
    const maxCol = (circleGrid[0]?.length ?? 1) - 1;

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
      !gridRef.current
    ) {
      return;
    }

    const previewRect = gridRef.current.getBoundingClientRect();
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
  }, [magnifierEnabled, magnifierWindow, hoverInfo]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Hero Section */}
      <header className="py-20 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Minecraft Playground
        </h1>
        <p className="mt-4 text-lg text-slate-300 max-w-xl mx-auto">
          Procedural tools and helpers for Minecraft builders.
        </p>
      </header>

      {/* Circle Generator Section */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-3">Circle Generator</h2>
        <p className="text-slate-300 mb-8 max-w-xl">
          Enter a diameter to generate a 2D block circle. This helps you build
          perfect circular structures in Minecraft.
        </p>

        <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700">
          <IntegerInput
            label="Diameter (positive integer)"
            value={diameter}
            onChange={setDiameter}
            maxValue={effectiveMaxDiameter}
          />

          {/* Circle Grid Preview */}
          <div className="mt-6 flex">
            <div className="flex rounded-2xl border border-slate-700 bg-slate-950/80 p-3">
              {circleGrid.length === 0 ? (
                <p className="text-xs text-slate-400">
                  No diameter entered. Please type a positive number to generate a circle grid.
                </p>
              ) : (
                <div
                  ref={gridRef}
                  className="inline-flex items-center justify-center flex-col space-y-[2px]"
                  onMouseMove={handleGridMouseMove}
                  onMouseLeave={() => setHoverInfo(null)}
                  style={{
                    width: effectiveGridMaxSize,
                    height: effectiveGridMaxSize,
                  }}
                >
                  {circleGrid.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-[2px]">
                      {row.map((cell, colIndex) => {
                        let cellClasses = "border ";
                        if (cell === "edge") {
                          cellClasses += "border-purple-500 bg-purple-500";
                        } else if (cell === "centerLine") {
                          cellClasses += "border-purple-500/70 bg-purple-500/40";
                        } else if (cell === "centerOverlap") {
                          cellClasses += "border-purple-500/80 bg-purple-500/70";
                        } else {
                          cellClasses += "border-slate-800 bg-slate-900";
                        }

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
              )}
            </div>
          </div>

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
                      if (cell === "edge") {
                        cellClasses += "border-purple-500 bg-purple-500";
                      } else if (cell === "centerLine") {
                        cellClasses += "border-purple-500/70 bg-purple-500/40";
                      } else if (cell === "centerOverlap") {
                        cellClasses += "border-purple-500/80 bg-purple-500/70";
                      } else {
                        cellClasses += "border-slate-800 bg-slate-900";
                      }

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
      </section>
    </div>
  );
}