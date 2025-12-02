import { useEffect, useMemo, useState } from "react";
import calculateBlockSize from "../utils/calculateBlockSize";
import { MOBILE_MAX_DIAMETER, WEB_SMALL_ZOOM_BLOCK_SIZE, WEB_DEFAULT_ZOOM_BLOCK_SIZE } from "../constants/responsiveDesign";

type UseCircularGridViewOptions = {
  maxDiameter: number;
  gridMaxSize: number;
  defaultDiameter?: number;
  enableMagnifierDiameter?: number;
};

export default function useCircularGridView({
  maxDiameter,
  gridMaxSize,
  defaultDiameter=17,
  enableMagnifierDiameter=40,
}: UseCircularGridViewOptions) {
  const [diameter, setDiameter] = useState(`${defaultDiameter}`);

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

  const blockSize = useMemo(() => {
    return calculateBlockSize(numericDiameter, gridMaxSize);
  }, [numericDiameter, gridMaxSize]);

  const magnifierEnabled = useMemo(() => {
    if (numericDiameter == null) return false;
    return numericDiameter >= enableMagnifierDiameter;
  }, [numericDiameter, enableMagnifierDiameter]);

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
    blockSize,
    magnifierEnabled,
    zoomBlockSize,
  };
}