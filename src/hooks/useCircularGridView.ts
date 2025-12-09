import { useEffect, useMemo, useState } from "react";
import calculateBlockSize from "../utils/calculateBlockSize";
import { MOBILE_MAX_DIAMETER, WEB_SMALL_ZOOM_BLOCK_SIZE, WEB_DEFAULT_ZOOM_BLOCK_SIZE } from "../constants/responsiveDesign";

type UseCircularGridViewOptions = {
  maxDiameter: number;
  gridMaxSize: number;
  defaultDiameter?: number;
};

export default function useCircularGridView({
  maxDiameter,
  gridMaxSize,
  defaultDiameter=17,
}: UseCircularGridViewOptions) {
  const [diameter, setDiameter] = useState(`${defaultDiameter}`);
  const [level, setLevel] = useState("1");

  useEffect(() => {
    if (parseInt(diameter, 10) > maxDiameter) {
      setTimeout(() => setDiameter(String(maxDiameter)), 0);
    }
  }, [diameter, maxDiameter])

  const numericDiameter = useMemo(() => {
    const n = parseInt(diameter, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.min(n, maxDiameter);
  }, [diameter, maxDiameter]);

  const numericLevel = useMemo(() => {
    const n = parseInt(level, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.min(n, Math.ceil((numericDiameter || 0) / 2));
  }, [level, numericDiameter]);

  const blockSize = useMemo(() => {
    return calculateBlockSize(numericDiameter, gridMaxSize);
  }, [numericDiameter, gridMaxSize]);

  const magnifierEnabled = useMemo(() => {
    return blockSize < 16;
  }, [blockSize]);

  const zoomBlockSize = useMemo(() => {
    if (maxDiameter === MOBILE_MAX_DIAMETER) {
      return WEB_SMALL_ZOOM_BLOCK_SIZE;
    } else {
      return WEB_DEFAULT_ZOOM_BLOCK_SIZE;
    }
  }, [maxDiameter])

  return {
    diameter,
    setDiameter,
    numericDiameter,
    level,
    setLevel,
    numericLevel,
    blockSize,
    magnifierEnabled,
    zoomBlockSize,
  };
}