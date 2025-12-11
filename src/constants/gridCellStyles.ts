import type { CircularCellStyling } from "../types/circularStyle";


export const BLANK_CELL_STYLE = "border-slate-800 bg-slate-900";

export const CIRCLE_EDGE_STYLE = "border-purple-500 bg-purple-500";
export const CIRCLE_CENTER_LINE_STYLE = "border-purple-500/70 bg-purple-500/40";
export const CIRCLE_CENTER_OVERLAP_STYLE = "border-purple-500/80 bg-purple-500/70";

export const DOME_LEVEL_EDGE_STYLE = "border-blue-500 bg-blue-500";
export const DOME_LEVEL_CENTER_LINE_STYLE = "border-blue-500/70 bg-blue-500/40";
export const DOME_LEVEL_CENTER_OVERLAP_STYLE = "border-blue-500/80 bg-blue-500/70";
export const DOME_OTHER_LEVEL_STYLE = "border-slate-500/70 bg-slate-500/40";

export const CIRCLE_CELL_STYLING: CircularCellStyling = {
  body: BLANK_CELL_STYLE,
  edge: CIRCLE_EDGE_STYLE,
  centerLine: CIRCLE_CENTER_LINE_STYLE,
  centerOverlap: CIRCLE_CENTER_OVERLAP_STYLE,
  none: BLANK_CELL_STYLE,
}

export const DOME_CELL_STYLING: CircularCellStyling = {
  body: DOME_OTHER_LEVEL_STYLE,
  edge: DOME_LEVEL_EDGE_STYLE,
  centerLine: DOME_LEVEL_CENTER_LINE_STYLE,
  centerOverlap: DOME_LEVEL_CENTER_OVERLAP_STYLE,
  none: BLANK_CELL_STYLE,
}
