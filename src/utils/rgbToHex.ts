export function rgbToHex({ r, g, b, a }: { r: number, g: number, b: number, a: number }) {
  return `#${[r, g, b, a]
    .map(x => x.toString(16).padStart(2, "0"))
    .join("")}`;
}