import { useEffect, useState } from "react";
import { useResponsiveDesign } from "../hooks/useResponsiveDesign";

export default function IntegerSlider({
  label,
  value,
  onChange,
  maxValue,
  height,
  paddingTop,
}: {
  label: string;
  value: string;
  onChange: (_: string) => void;
  maxValue: number;
  height: number; // visual height of the vertical slider (px)
  paddingTop: number;
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

  // How "thick" the slider should look horizontally in the row
  const trackThickness = 32; // tweak this to taste

  return (
    <div className={`flex flex-row items-start ${!onMobile && "gap-2"}`}>
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ paddingTop, width: trackThickness, height }}
      >
        <input
          type="range"
          min={1}
          max={maxValue}
          value={localValue}
          onChange={handleSliderChange}
          className="absolute -rotate-90 origin-center"
          // width = visual height (before rotation), wrapper keeps horizontal footprint small
          style={{ width: height }}
        />
      </div>
      <label className="text-lg font-medium">
        {label}: {localValue}
      </label>
    </div>
  );
}