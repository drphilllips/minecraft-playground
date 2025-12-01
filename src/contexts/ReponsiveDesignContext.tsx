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
  MOBILE_VIEWPORT_THRESHOLD,
  MOBILE_GRID_MAX_SIZE,
  GRID_MIN_SIZE,
  WEB_MAX_DIAMETER,
  MOBILE_MAX_DIAMETER,
} from "../constants/responsiveDesign";

type ResponsiveDesignContextType = {
  onMobile: boolean;
  viewportWidth: number | null;
  effectiveGridMaxSize: number;
  effectiveMaxDiameter: number;
};

const ResponsiveDesignContext = createContext<ResponsiveDesignContextType | null>(null);

export function ResponsiveDesignProvider({ children }: { children: ReactNode }) {
  const [onMobile, setOnMobile] = useState(false);
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);

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

    if (viewportWidth < MOBILE_VIEWPORT_THRESHOLD) {
      setTimeout(() => setOnMobile(true), 0);
      const candidate = viewportWidth - 40;
      return Math.max(GRID_MIN_SIZE, Math.min(MOBILE_GRID_MAX_SIZE, candidate));
    }

    return WEB_GRID_MAX_SIZE;
  }, [viewportWidth]);

  // --- Compute allowed max diameter ---
  const effectiveMaxDiameter = useMemo(() => {
    if (viewportWidth == null) return WEB_MAX_DIAMETER;

    return viewportWidth < MOBILE_VIEWPORT_THRESHOLD
      ? MOBILE_MAX_DIAMETER
      : WEB_MAX_DIAMETER;
  }, [viewportWidth]);

  return (
    <ResponsiveDesignContext.Provider
      value={{
        onMobile,
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