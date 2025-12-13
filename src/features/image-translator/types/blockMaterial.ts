

export const BLOCK_MATERIAL_IDS = [
  "wood",
  "bamboo",
  "nether_wood",
  "stone",
  "natural_stone",
  "masonry",
  "deepslate",
  "blackstone",
  "quartz",
  "nether_brick",
  "tuff",
  "prismarine",
  "resin",
  "metal_and_ore",
  "concrete",
  "terracotta",
  "wool_and_carpet",
  "earth",
  "organics",
  "luminant_and_special",
  "nether",
  "end",
]

export type BlockMaterial = (typeof BLOCK_MATERIAL_IDS)[number];