import { useEffect, useState } from "react";

const PERIOD_MS = 4000; // full 0->1->0 cycle

export function useSharedBreathingPhase() {
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

  return phase; // 0..1, 0=min, 1=max
}