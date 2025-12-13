import type { BlockId } from "../types/blockId";
import type { BlockMaterial } from "../types/blockMaterial";

export const MATERIAL_REPRESENTATIVE_BLOCKS: Record<BlockMaterial, BlockId> = {
  wood: "oak_planks",
  bamboo: "bamboo_planks",
  nether_wood: "crimson_planks",
  stone: "stone",
  natural_stone: "andesite",
  masonry: "chiseled_stone_bricks",
  deepslate: "deepslate",
  blackstone: "blackstone",
  quartz: "quartz_bricks",
  nether_brick: "nether_bricks",
  tuff: "tuff",
  prismarine: "prismarine_bricks",
  resin: "resin_block",
  metal_and_ore: "iron_block",
  concrete: "white_concrete",
  terracotta: "terracotta",
  wool_and_carpet: "white_wool",
  earth: "dirt",
  organics: "moss_block",
  luminant_and_special: "glowstone",
  nether: "netherrack",
  end: "end_stone",
};