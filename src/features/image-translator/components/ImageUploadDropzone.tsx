import React, { useRef, useState } from "react";
import { useResponsiveDesign } from "../../../contexts/useResponsiveDesign";
import { MOBILE_GRID_MAX_SIZE } from "../../../constants/responsiveDesign";
import InputField from "../../../components/InputField";

type ImageUploadDropzoneProps = {
  label?: string;
  description?: string;
  onImageSelected: (file: File) => void;
  // Optional: show a small preview of the selected image
  showPreview?: boolean;
};

export default function ImageUploadDropzone({
  label = "Upload Image",
  description = "Click to browse, or drag & drop an image here.",
  onImageSelected,
  showPreview = true,
}: ImageUploadDropzoneProps) {
  const { onMobile } = useResponsiveDesign();

  const width = MOBILE_GRID_MAX_SIZE;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }

  function handleFile(file: File | null) {
    if (!file) return;
    onImageSelected(file);

    if (showPreview) {
      const url = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    handleFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    // Only reset drag state when truly leaving the dropzone
    if ((e.target as HTMLElement).contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  }

  function handleClear() {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <InputField label={label}>
      {showPreview && previewUrl ? (
        <div className="flex flex-col gap-2">
          <div style={{ width, maxWidth: width }}>
            <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/60 aspect-square">
              <img
                src={previewUrl}
                alt="Selected"
                className="block w-full h-full object-contain bg-slate-900"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="self-start rounded-md border border-slate-600 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-700 hover:border-slate-500 transition-colors"
          >
            Clear image
          </button>
        </div>
      ) : (
        <div style={{ width, maxWidth: width }}>
          <div
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={[
              "relative flex flex-col items-center justify-center text-center",
              "aspect-square",
              "border border-dashed rounded-xl px-4 py-8 cursor-pointer",
              "transition-all duration-150",
              "bg-slate-900/40 border-slate-600/80",
              "hover:border-purple-400 hover:bg-slate-900/70",
              isDragging ? "border-purple-500 bg-slate-900/80 scale-[1.01]" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              <div className="text-xs font-semibold tracking-wide uppercase text-slate-300">
                {onMobile
                  ? "Upload an image"
                  : isDragging
                  ? "Drop image to upload"
                  : "Click or drag an image"}
              </div>
              <p className="text-xs text-slate-400 max-w-full">{description}</p>
            </div>
          </div>
        </div>
      )}
    </InputField>
  );
}