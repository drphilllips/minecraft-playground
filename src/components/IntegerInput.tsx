import { useEffect, useState } from "react";
import InputField from "./InputField";


export default function IntegerInput({
  label,
  value,
  onChange,
  maxValue,
  maxReachedAlert,
}: {
  label: string
  value: string
  onChange: (_: string) => void
  maxValue: number
  maxReachedAlert: string
}) {

  const [showMaxAlert, setShowMaxAlert] = useState(false)
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const n = parseInt(localValue, 10);
    if (Number.isFinite(n) && n < maxValue) {
      setShowMaxAlert(false);
    }
  }, [localValue, maxValue]);

  useEffect(() => {
    setLocalValue(value);
  }, [value])

  const increment = () => {
    const n = parseInt(value, 10) || 0;
    if (n >= maxValue) {
      setShowMaxAlert(true);
      setLocalValue(String(maxValue));
      onChange(String(maxValue));
      return;
    }
    setShowMaxAlert(false);
    setLocalValue(String(n + 1));
    onChange(String(n + 1));
  };

  const decrement = () => {
    const n = parseInt(value, 10) || 0;
    const next = Math.max(1, n - 1);
    setShowMaxAlert(false);
    setLocalValue(String(next));
    onChange(String(next));
  };

  return (
    <InputField label={label}>
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={decrement}
          className={`
            px-4 py-2 rounded-lg
            bg-slate-700 hover:bg-slate-600
            cursor-pointer
            transition text-lg
          `}
        >
          -
        </button>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={localValue}
          onChange={(e) => {
            let raw = e.target.value.replace(/[^0-9]/g, "");
            raw = raw.replace(/^0+/, "");
            if (raw === "") {
              setLocalValue("");
              setShowMaxAlert(false);
              // DO NOT call onChange — allow user to freely clear the field
              return;
            }
            const n = parseInt(raw, 10);
            if (!Number.isFinite(n)) {
              setLocalValue("");
              return;
            }
            setLocalValue(String(n));
            if (n > maxValue) {
              setShowMaxAlert(true);
              setLocalValue(String(maxValue));
              onChange(String(maxValue));
              return;
            } else {
              setShowMaxAlert(false);
              setLocalValue(String(n));
              onChange(String(n));
            }
          }}
          className="w-20 text-center text-2xl font-semibold rounded-lg bg-slate-800 border border-slate-600 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={increment}
          className={`
            px-4 py-2 rounded-lg
            bg-slate-700 hover:bg-slate-600
            cursor-pointer
            transition text-lg
          `}
        >
          +
        </button>

        {showMaxAlert && (
          <span className="text-xs text-amber-300">
            {maxReachedAlert}
          </span>
        )}
      </div>
    </InputField>
  )
}