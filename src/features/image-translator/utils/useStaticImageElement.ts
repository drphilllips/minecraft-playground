import { useEffect, useState } from "react";

export function useStaticImageElement(src: string) {
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = src;
    img.decoding = "async"; // hint to browser

    img.onload = () => {
      if (!cancelled) setImageEl(img);
    };

    return () => {
      cancelled = true;
      img.onload = null;
    };
  }, [src]);

  return imageEl;
}