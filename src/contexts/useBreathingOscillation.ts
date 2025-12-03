import { useContext } from "react";
import { BreathingOscillationContext, type BreathingOscillationContextValue } from "./BreathingOscillationContext";

export function useBreathingOscillation(): BreathingOscillationContextValue {
  const ctx = useContext(BreathingOscillationContext);
  if (!ctx) {
    throw new Error(
      "useBreathingOscillationContext must be used within a BreathingOscillationProvider"
    );
  }
  return ctx;
}

/**
 * Convenience hook for components that only care about the phase number.
 *
 * Example:
 * const phase = useBreathingPhase();
 */
export function useBreathingPhase(): number {
  return useBreathingOscillation().phase;
}