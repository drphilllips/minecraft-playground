import { useEffect, useState } from "react";
import { useResponsiveDesign } from "../contexts/useResponsiveDesign";

export default function IntegerSlider({
  label,
  value,
  onChange,
  maxValue,
  sliderLength,
  paddingTop,
  horizontal=false,
  showButtons=false,
  showOutOfTotal=false,
}: {
  label: string;
  value: string;
  onChange: (_: string) => void;
  maxValue: number;
  sliderLength: number; // visual height of the vertical slider (px)
  paddingTop?: number;
  horizontal?: boolean;
  showButtons?: boolean;
  showOutOfTotal?: boolean;
}) {
  const { onMobile } = useResponsiveDesign();

  const [localValue, setLocalValue] = useState(value);

  // Sync external changes → internal state
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const n = parseInt(raw, 10);

    if (!Number.isFinite(n)) return;

    setLocalValue(String(n));

    if (n >= maxValue) {
      onChange(String(maxValue));
    } else {
      onChange(String(n));
    }
  };

  const increment = () => {
    const current = parseInt(localValue, 10) || 0;
    const next = Math.min(maxValue, current + 1);
    setLocalValue(String(next));
    onChange(String(next));
  };

  const decrement = () => {
    const current = parseInt(localValue, 10) || 0;
    const next = Math.max(1, current - 1);
    setLocalValue(String(next));
    onChange(String(next));
  };

  // How "thick" the slider should look horizontally in the row
  const trackThickness = 32; // tweak this to taste

  return (
    <div className={horizontal ? "flex flex-col items-center" : `flex flex-row items-start ${!onMobile && "gap-2"}`}>
      {horizontal && (
        <label className="text-lg font-medium mb-1">
          {label}: {localValue}{showOutOfTotal ? ` / ${maxValue}` : ""}
        </label>
      )}
      {horizontal ? (
        <div className="flex flex-row items-center gap-4">
          {showButtons && (
            <button
              onClick={decrement}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition text-lg"
            >
              -
            </button>
          )}
          <div
            className="relative flex items-center justify-center shrink-0"
            style={{ paddingTop, height: trackThickness, width: sliderLength }}
          >
            <input
              type="range"
              min={1}
              max={maxValue}
              value={localValue}
              onChange={handleSliderChange}
              className="absolute origin-center"
              style={{ width: sliderLength }}
            />
          </div>
          {showButtons && (
            <button
              onClick={increment}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition text-lg"
            >
              +
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-row items-start">
          <div className="flex flex-col items-center gap-2">
            {showButtons && (
              <button
                onClick={increment}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition text-lg"
              >
                +
              </button>
            )}
            <div
              className="relative flex items-center justify-center shrink-0"
              style={{ paddingTop, width: trackThickness, height: sliderLength }}
            >
              <input
                type="range"
                min={1}
                max={maxValue}
                value={localValue}
                onChange={handleSliderChange}
                className="absolute -rotate-90 origin-center"
                style={{ width: sliderLength }}
              />
            </div>
            {showButtons && (
              <button
                onClick={decrement}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition text-lg"
              >
                -
              </button>
            )}
          </div>
        </div>
      )}
      {!horizontal && (
        <label className="text-lg font-medium">
          {label}: {localValue}{showOutOfTotal ? ` / ${maxValue}` : ""}
        </label>
      )}
    </div>
  );
}