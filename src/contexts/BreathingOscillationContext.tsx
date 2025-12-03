import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type BreathingOscillationContextValue = {
  /**
   * Normalized breathing phase, 0..1 where:
   * - 0   = minimum size
   * - 0.5 = maximum size
   * - 1   = minimum size (end of full in/out cycle)
   */
  phase: number;
};

const BreathingOscillationContext = createContext<
  BreathingOscillationContextValue | undefined
>(undefined);

type BreathingOscillationProviderProps = {
  children: ReactNode;
};

/**
 * Provides a shared breathing phase value to all descendants.
 *
 * Internally this uses a single requestAnimationFrame loop (via
 * useSharedBreathingPhase) so any number of children can consume
 * the same phase without starting their own loops.
 */
export const BreathingOscillationProvider: React.FC<
  BreathingOscillationProviderProps
> = ({ children }) => {
  const PERIOD_MS = 4000; // full 0->1->0 cycle

  const [phase, setPhase] = useState(0); // 0..1

  useEffect(() => {
    let rafId: number;
    const start = performance.now();

    const loop = () => {
      const now = performance.now();
      const t = ((now - start) % PERIOD_MS) / PERIOD_MS; // 0..1 over period

      // Triangle wave: 0->1->0 over [0,1]
      const tri = t < 0.5 ? t * 2 : (1 - t) * 2;

      setPhase(tri);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const value = useMemo(
    () => ({
      phase,
    }),
    [phase]
  );

  return (
    <BreathingOscillationContext.Provider value={value}>
      {children}
    </BreathingOscillationContext.Provider>
  );
};

export { BreathingOscillationContext };
