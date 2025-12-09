import { useEffect, useMemo, useRef, useState } from "react";
import GridView from "../../components/GridView";
import { useResponsiveDesign } from "../../contexts/useResponsiveDesign";
import { useBreathingPhase } from "../../contexts/useBreathingOscillation";
import generateDome from "./utils/generateDome";
import { generateDomeGrid } from "./utils/generateDomeGrid";
import calculateBlockSize from "../../utils/calculateBlockSize";
import { BLANK_CIRCLE_OUTPUT, BLANK_DOME_OUTPUT } from "../../constants/gridOutput";
import type { CircularCellType } from "../../types/circularStyle";


export default function DomePreview() {
  const { effectiveMaxDiameter, effectiveGridMaxSize } = useResponsiveDesign();
  const breathingPhase = useBreathingPhase();

  const [diameter, setDiameter] = useState("1");

  const numericDiameter = useMemo(() => {
    const n = parseInt(diameter, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    if (!effectiveMaxDiameter) return n;

    const maxDiam = effectiveMaxDiameter / 2 - 1;
    return Math.max(1, Math.min(n, maxDiam));
  }, [diameter, effectiveMaxDiameter]);
  const blockSize = useMemo(
    () => calculateBlockSize(numericDiameter, effectiveGridMaxSize / 2),
    [numericDiameter, effectiveGridMaxSize]
  );

  const [animationToggle, setAnimationToggle] = useState<"diameter" | "level">("diameter");
  const [firstDiameterRunDone, setFirstDiameterRunDone] = useState(false);

  const [level, setLevel] = useState("1");

  const diameterReachedMinRef = useRef(false);
  const levelReachedMaxRef = useRef(false);

  const numericLevel = useMemo(() => {
    const n = parseInt(level, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.min(n, Math.ceil((numericDiameter || 0) / 2));
  }, [level, numericDiameter]);

  const dome = useMemo(() => {
    if (numericDiameter == null) return BLANK_DOME_OUTPUT;
    return generateDome(numericDiameter, "centerLines");
  }, [numericDiameter])

  const domeGrid = useMemo(() => {
    if (!dome) return BLANK_CIRCLE_OUTPUT;
    return generateDomeGrid(dome.space as CircularCellType[][][], numericLevel || 1);
  }, [dome, numericLevel]);

  useEffect(() => {
    if (animationToggle !== "diameter") return;
    if (!effectiveMaxDiameter) return;

    const minDiam = 1;
    const maxDiam = effectiveMaxDiameter / 2 - 1;
    const value = minDiam + (maxDiam - minDiam) * breathingPhase;

    let rounded = Math.round(value);
    if (rounded % 2 === 0) rounded += 1;

    const next = String(Math.max(1, rounded));
    setTimeout(() => setDiameter(next), 0);
  }, [animationToggle, breathingPhase, effectiveMaxDiameter]);

  useEffect(() => {
    const TOP = 0.98;
    const BOTTOM = 0.02;

    if (animationToggle !== "diameter") return;

    const atTop = breathingPhase >= TOP;
    const atBottom = breathingPhase <= BOTTOM;

    if (!firstDiameterRunDone) {
      // First run: diameter does min -> max (bottom -> top), then hand off to level.
      if (atTop) {
        setTimeout(() => {
          setFirstDiameterRunDone(true);
          // Reset level phase tracking for a fresh min -> max -> min cycle.
          levelReachedMaxRef.current = false;
          setAnimationToggle("level");
        }, 0);
      }
    } else {
      // Subsequent diameter phases: full cycle max -> min -> max.
      // We start these at the top, and wait for: top -> bottom -> top.
      if (!diameterReachedMinRef.current) {
        // Wait until we've seen the bottom once.
        if (atBottom) {
          diameterReachedMinRef.current = true;
        }
      } else {
        // Then wait until we hit the top again to complete max -> min -> max.
        if (atTop) {
          diameterReachedMinRef.current = false;
          // Prepare level phase for a new min -> max -> min run.
          levelReachedMaxRef.current = false;
          setTimeout(() => {
            setAnimationToggle("level");
          }, 0);
        }
      }
    }
  }, [breathingPhase, animationToggle, firstDiameterRunDone]);

  useEffect(() => {
    const TOP = 0.98;
    const BOTTOM = 0.02;

    if (animationToggle !== "level") return;

    const atTop = breathingPhase >= TOP;
    const atBottom = breathingPhase <= BOTTOM;

    // Level phase should be a full min -> max -> min, which corresponds to
    // top -> bottom -> top in the shared breathing phase when we use 1 - breathingPhase
    // for the mapping (see mapping effect below).
    if (!levelReachedMaxRef.current) {
      // Wait until we've passed through the bottom once.
      if (atBottom) {
        levelReachedMaxRef.current = true;
      }
    } else {
      // After we've seen bottom, wait for the next top to complete the cycle.
      if (atTop) {
        levelReachedMaxRef.current = false;
        // Reset diameter tracking for the next diameter phase.
        diameterReachedMinRef.current = false;
        setTimeout(() => {
          setAnimationToggle("diameter");
        }, 0);
      }
    }
  }, [breathingPhase, animationToggle]);


  // Drive dome level from the shared breathing phase when in "level" mode.
  useEffect(() => {
    if (animationToggle !== "level") return;
    const minLevel = 1;
    const maxLevel = Math.ceil(effectiveMaxDiameter / 4);
    const invertedPhase = 1 - breathingPhase;
    const value = minLevel + (maxLevel - minLevel) * invertedPhase; // top->bottom->top (1->0->1) -> min->max->min

    const rounded = Math.round(value);
    setTimeout(() => {
      setLevel(String(rounded));
    }, 0);
  }, [effectiveMaxDiameter, animationToggle, breathingPhase, setLevel]);

  return (
    <GridView
      grid={domeGrid.grid}
      blockSize={blockSize}
      width={effectiveGridMaxSize/2}
      height={effectiveGridMaxSize/2}
      magnifierEnabled={false}
    />
  )
}