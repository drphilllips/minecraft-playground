import { useMemo, useState } from "react";
import calculateBlockSize from "../utils/calculateBlockSize";

type UseCircularGridViewOptions = {
  defaultDiameter: number;
  maxDiameter: number;
  gridMaxSize: number;
  enableMagnifierDiameter?: number;
};

export default function useCircularGridView({
  defaultDiameter,
  maxDiameter,
  gridMaxSize,
  enableMagnifierDiameter = 40,
}: UseCircularGridViewOptions) {
  const [diameter, setDiameter] = useState(`${defaultDiameter}`);

  const numericDiameter = useMemo(() => {
    const n = parseInt(diameter, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.min(n, maxDiameter);
  }, [diameter, maxDiameter]);

  const blockSize = useMemo(() => {
    return calculateBlockSize(numericDiameter, gridMaxSize);
  }, [numericDiameter, gridMaxSize]);

  const magnifierEnabled = useMemo(() => {
    if (numericDiameter == null) return false;
    return numericDiameter >= enableMagnifierDiameter;
  }, [numericDiameter, enableMagnifierDiameter]);

  return {
    diameter,
    setDiameter,
    numericDiameter,
    blockSize,
    magnifierEnabled,
  };
}