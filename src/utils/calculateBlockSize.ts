

export default function calculateBlockSize(numericDiameter: number | null, gridSize: number) {
  if (numericDiameter == null) return 16;

  const gap = 2; // matches gap-[2px] between cells
  const size = numericDiameter; // grid is size x size

  // Total pixels available for blocks after subtracting gaps
  const totalGaps = Math.max(0, size - 1);
  const maxPixelsForBlocks = gridSize - totalGaps * gap;

  if (maxPixelsForBlocks <= 0) {
    // Fallback to a minimal size if something goes wrong
    return 2;
  }

  const rawBlockSize = maxPixelsForBlocks / size;

  // Clamp only the upper bound so we never exceed the effective max size,
  // but allow small blocks for large diameters so width == height.
  return Math.min(20, rawBlockSize);
}