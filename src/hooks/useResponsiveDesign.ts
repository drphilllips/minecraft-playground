import { useContext } from "react";
import ResponsiveDesignContext from "../contexts/ReponsiveDesignContext";

export function useResponsiveDesign() {
  const ctx = useContext(ResponsiveDesignContext);
  if (!ctx) {
    throw new Error("useResponsiveDesign must be used inside <ResponsiveDesignProvider />");
  }
  return ctx;
}