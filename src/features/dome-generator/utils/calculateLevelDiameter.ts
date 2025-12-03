

export default function calculateLevelDiameter(d: number, level: number) {
  // Total radius of the dome in grid units (can be .5 when d is odd)
  const R = d / 2;

  // Number of vertical levels from base (widest) to top (narrowest)
  const maxLevel = Math.floor(R) + 1;

  // Clamp level so that 1 = base (widest), maxLevel = top (narrowest)
  const clampedLevel = Math.min(Math.max(level, 1), maxLevel);

  // Map level (1 = base, maxLevel = top) to a height h in [0, R]
  // Map level (1 = base, maxLevel = top) to a height h in [0, R]
  const t = maxLevel > 1
  ? (d % 2 === 0
      // For even diameters, shift levels forward so the dome narrows one level earlier
      ? clampedLevel / (maxLevel - 1)
      // For odd diameters, keep the original mapping so behavior is unchanged
      : (clampedLevel - 1) / (maxLevel - 1))
  : 0;
  const h = t * R;

  // Radius of this horizontal slice of the dome (hemisphere)
  const sliceRadius = Math.sqrt(Math.max(0, R * R - h * h));

  // Diameter for this level; start from the continuous diameter 2 * r
  let thisLevelDiameter = Math.max(1, Math.round(2 * sliceRadius));

  // Ensure diameter never exceeds the overall dome diameter
  thisLevelDiameter = Math.min(thisLevelDiameter, d);

  // Match parity with the overall dome diameter for nicer centering
  if (thisLevelDiameter % 2 !== d % 2) {
    if (thisLevelDiameter < d) {
      thisLevelDiameter += 1;
    } else if (thisLevelDiameter > 1) {
      thisLevelDiameter -= 1;
    }
  }

  return thisLevelDiameter;
}