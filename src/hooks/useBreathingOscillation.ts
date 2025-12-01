import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";

type UseBreathingOscillationArgs = {
  min: number;
  max: number;
  baseDelay: number;
  step: number;
  onChange: Dispatch<SetStateAction<string>>;
  enabled?: boolean;
  shouldContinue?: (value: number) => boolean;
  proportionalTiming?: boolean;
};

export function useBreathingOscillation({
  min,
  max,
  baseDelay,
  step,
  onChange,
  enabled = true,
  shouldContinue,
  proportionalTiming = false,
}: UseBreathingOscillationArgs) {
  const onChangeRef = useRef(onChange);
  const shouldContinueRef = useRef(shouldContinue);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    shouldContinueRef.current = shouldContinue;
  }, [shouldContinue]);

  const directionRef = useRef<1 | -1>(1);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // If disabled, clear any pending timeout and do nothing.
    if (!enabled) {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const tick = () => {
      let nextDelay = baseDelay;
      let shouldStop = false;

      onChangeRef.current((prev: string) => {
        const numeric = parseInt(prev, 10) || min;

        // Flip direction at bounds
        if (numeric >= max) {
          directionRef.current = -1;
        } else if (numeric <= min) {
          directionRef.current = 1;
        }

        // Fixed-step move
        const nextNumeric = numeric + directionRef.current * step;
        const clamped = Math.max(min, Math.min(max, nextNumeric));

        // --- timing based on value (natural version) ---
        const range = max - min || 1;
        const normalizedSizeRaw = (clamped - min) / range; // 0 (small) -> 1 (large)
        const normalizedSize = Math.min(1, Math.max(0, normalizedSizeRaw));

        // Smoothstep ease for organic feel
        const t = normalizedSize;
        const eased = t * t * (3 - 2 * t);

        const minSpeed = 0.6; // slowest at smallest value
        const maxSpeed = 1.8; // fastest at largest value
        const speed = minSpeed + (maxSpeed - minSpeed) * eased;

        let delay: number;
        if (proportionalTiming) {
          // Delay increases proportionally with value: small -> fast, large -> slow
          delay = baseDelay * speed;
        } else {
          // Default inverse timing: small -> slow, large -> fast
          delay = baseDelay / speed;
        }
        nextDelay = delay;

        if (shouldContinueRef.current && !shouldContinueRef.current(clamped)) {
          shouldStop = true;
        }

        return String(clamped);
      });

      if (shouldStop) {
        timeoutRef.current = null;
        return;
      }

      timeoutRef.current = window.setTimeout(tick, nextDelay);
    };

    // kick it off
    timeoutRef.current = window.setTimeout(tick, baseDelay);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [proportionalTiming, min, max, baseDelay, step, enabled]);
}