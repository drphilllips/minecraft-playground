import {
  createContext,
  useState,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";

// Import your constants
import {
  WEB_GRID_MAX_SIZE,
  SHRINK_STUFF_THRESHOLD,
  MOBILE_GRID_MAX_SIZE,
  GRID_MIN_SIZE,
  WEB_MAX_DIAMETER,
  MOBILE_MAX_DIAMETER,
} from "../constants/responsiveDesign";

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

type ResponsiveDesignContextType = {
  onMobile: boolean;
  isStandalone: boolean;
  viewportWidth: number | null;
  effectiveGridMaxSize: number;
  effectiveMaxDiameter: number;
};

const ResponsiveDesignContext = createContext<ResponsiveDesignContextType | null>(null);

export function ResponsiveDesignProvider({ children }: { children: ReactNode }) {
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);
  // inside your ResponsiveDesignProvider or similar
const [isStandalone, setIsStandalone] = useState<boolean>(() => {
  if (typeof window === "undefined") return false;

  const nav = window.navigator as NavigatorWithStandalone;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // old iOS Safari
    nav.standalone === true
  );
});

useEffect(() => {
  if (typeof window === "undefined") return;

  const mq = window.matchMedia("(display-mode: standalone)");

  const handler = (e: MediaQueryListEvent) => {
    setIsStandalone(e.matches);
  };

  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}, []);

  // --- Track viewport width ---
  useEffect(() => {
    const updateWidth = () => {
      if (typeof window !== "undefined") {
        setViewportWidth(window.innerWidth);
      }
    };

    updateWidth(); // Initial measurement
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // --- Compute effective grid max size ---
  const effectiveGridMaxSize = useMemo(() => {
    if (viewportWidth == null) return WEB_GRID_MAX_SIZE;

    if (viewportWidth < SHRINK_STUFF_THRESHOLD) {
      const candidate = viewportWidth - 40;
      return Math.max(GRID_MIN_SIZE, Math.min(MOBILE_GRID_MAX_SIZE, candidate));
    }

    return WEB_GRID_MAX_SIZE;
  }, [viewportWidth]);

  const onMobile = useMemo(() => {
    if (viewportWidth == null) return false;

    if (viewportWidth < SHRINK_STUFF_THRESHOLD) {
      return true;
    }

    return false;
  }, [viewportWidth])

  // --- Compute allowed max diameter ---
  const effectiveMaxDiameter = useMemo(() => {
    if (viewportWidth == null) return WEB_MAX_DIAMETER;

    return viewportWidth < SHRINK_STUFF_THRESHOLD
      ? MOBILE_MAX_DIAMETER
      : WEB_MAX_DIAMETER;
  }, [viewportWidth]);

  return (
    <ResponsiveDesignContext.Provider
      value={{
        onMobile,
        isStandalone,
        viewportWidth,
        effectiveGridMaxSize,
        effectiveMaxDiameter,
      }}
    >
      {children}
    </ResponsiveDesignContext.Provider>
  );
}

export default ResponsiveDesignContext;