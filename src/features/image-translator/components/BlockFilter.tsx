import type { BlockFilter } from "../types/blockFilter";
import { Filter, FilterX, X } from "lucide-react";
import { useResponsiveDesign } from "../../../contexts/useResponsiveDesign";
import { useEffect, useMemo } from "react";
import { BLOCK_MATERIAL_IDS, type BlockMaterial } from "../types/blockMaterial";
import InputField from "../../../components/InputField";
import { MATERIAL_NAMES } from "../constants/materialNames";
import BlankLabel from "../../../components/Label";
import BlockTexture from "./BlockTexture";
import { MATERIAL_REPRESENTATIVE_BLOCKS } from "../constants/materialRepresentativeBlocks";
import HoverableOpacity from "../../../components/HoverableOpacity";
import type { BlockId } from "../types/blockId";
import { BLOCK_NAMES } from "../constants/blockNames";
import { getAllBlocksOfMaterial, getAvailableBlocksOfMaterial } from "../utils/ensureSelectedMaterialHasAvailableBlocks";

export default function BlockFilterView({
  blockFilter,
  setBlockFilter,
}: {
  blockFilter: BlockFilter
  setBlockFilter: (_: BlockFilter) => void
}) {

  function addActiveMaterialFilter(add: BlockMaterial) {
    setBlockFilter({
      ...blockFilter,
      materials: [...(blockFilter.materials || []), add]
    })
  }

  function removeActiveMaterialFilter(remove: BlockMaterial) {
    setBlockFilter({
      ...blockFilter,
      materials: blockFilter.materials?.filter(
        (material) => material !== remove
      )
    })
  }

  function disableActiveRemoveBlockFilter(disable: BlockMaterial) {
    setBlockFilter({
      ...blockFilter,
      removeBlocks: blockFilter.removeBlocks?.filter(
        (blockId) => blockId !== disable
      )
    })
  }

  function clearFilters() {
    setBlockFilter({});
  }

  const inactiveMaterialFilters: BlockMaterial[] = useMemo(() => (
    BLOCK_MATERIAL_IDS.filter(
      (material) => !blockFilter.materials?.includes(material)
    )
  ), [blockFilter.materials]);

  const areMaterialFilters = useMemo(() => (
    (blockFilter.materials?.length || 0) > 0
  ), [blockFilter.materials])

  const areRemoveBlockFilters = useMemo(() => (
    (blockFilter.removeBlocks?.length || 0) > 0
  ), [blockFilter.removeBlocks])

  return (
    <div className="flex flex-col w-full items-center justify-start gap-5 px-8 pt-3 pb-10">
      <InputField
        label="Active Filters"
        className="w-full"
        labelHelperComponent={(
          Object.values(blockFilter).length > 0 && (
            <ClearBlockFiltersButton onPress={clearFilters} />
          )
        )}
      >
        <div className="flex flex-row flex-wrap gap-1">
          {areMaterialFilters && (
            blockFilter.materials?.map(
              (material, i) => (
                <ActiveMaterialFilterTag
                  key={i}
                  material={material}
                  onRemove={() => removeActiveMaterialFilter(material)}
                />
              )
            )
          )}
          {areRemoveBlockFilters && (
            blockFilter.removeBlocks?.map(
              (blockId, i) => (
                <ActiveRemoveBlockFilterTag
                  key={i}
                  blockId={blockId}
                  onDisable={() => disableActiveRemoveBlockFilter(blockId)}
                />
              )
            )
          )}
          {(!areMaterialFilters && !areRemoveBlockFilters) && (
            <BlankLabel text="All materials in use — select material from the list below to filter" />
          )}
        </div>
      </InputField>
      <InputField label="Unselected Materials" className="w-full">
        <div className="flex flex-row flex-wrap gap-1">
          {inactiveMaterialFilters?.map(
            (material, i) => (
              <SelectMaterialFilterTag
                key={i}
                material={material}
                onSelect={() => addActiveMaterialFilter(material)}
                blockFilter={blockFilter}
                disableRemoveBlockFilter={disableActiveRemoveBlockFilter}
              />
            )
          )}
        </div>
      </InputField>
    </div>
  )
}

function ActiveRemoveBlockFilterTag({
  blockId,
  onDisable,
}: {
  blockId: BlockId
  onDisable: () => void
}) {
  const blockName = useMemo(() => (
    BLOCK_NAMES[blockId]
  ), [blockId])

  return (
    <div
      className="
        flex flex-row items-center gap-1.5
        px-2 py-1
        rounded-md
        bg-red-500/30 border border-red-500/80
        text-red-500 text-xs
        select-none cursor-default
      "
    >
      <BlockTexture
        blockId={blockId}
        className={"w-3 h-3"}
      />
      <span className="whitespace-nowrap text-red-500 text-xs">
        {blockName}
      </span>
      <button
        type="button"
        onClick={onDisable}
        aria-label={`Disable remove-${blockId} filter`}
        className="
          flex items-center justify-center
          gap-1 p-0.5 rounded-md
          hover:bg-red-500/30
          active:bg-red-800
          transition-colors
          cursor-pointer
        "
      >
        <X className="w-3 h-3 text-red-500" />
      </button>
    </div>
  )
}

function ActiveMaterialFilterTag({
  material,
  onRemove,
}: {
  material: string
  onRemove: () => void
}) {

  const materialName = useMemo(() => (
    MATERIAL_NAMES[material]
  ), [material])

  const representativeBlock = useMemo(() => (
    MATERIAL_REPRESENTATIVE_BLOCKS[material]
  ), [material])

  return (
    <div
      className="
        flex flex-row items-center gap-1.5
        px-2 py-1
        rounded-md
        bg-slate-800/50
        border border-slate-600/60
        text-slate-100 text-xs
        select-none cursor-default
      "
    >
      <BlockTexture
        blockId={representativeBlock}
        className={"w-3 h-3"}
      />
      <span className="whitespace-nowrap">{materialName}</span>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${materialName} filter`}
        className="
          flex items-center justify-center
          rounded-sm
          p-0.5
          hover:bg-slate-600/70
          active:bg-slate-500/70
          transition-colors
          cursor-pointer
        "
      >
        <X className="h-3 w-3 text-slate-200" />
      </button>
    </div>
  )
}

function SelectMaterialFilterTag({
  material,
  onSelect,
  blockFilter,
  disableRemoveBlockFilter,
}: {
  material: BlockMaterial
  onSelect: () => void
  blockFilter: BlockFilter
  disableRemoveBlockFilter: (_: BlockId) => void
}) {

  const materialName = useMemo(() => (
    MATERIAL_NAMES[material]
  ), [material])

  const representativeBlock = useMemo(() => (
    MATERIAL_REPRESENTATIVE_BLOCKS[material]
  ), [material])

  const blocksOfMaterial = useMemo(() => (
    getAllBlocksOfMaterial(material)
  ), [material])

  const availableBlocksOfMaterial = useMemo(() => (
    getAvailableBlocksOfMaterial(blockFilter, material)
  ), [blockFilter, material])

  useEffect(() => {
    if (availableBlocksOfMaterial.length === 0) {
      disableRemoveBlockFilter(blocksOfMaterial[0])
    }
  }, [blocksOfMaterial, availableBlocksOfMaterial, disableRemoveBlockFilter]);

  return (
    <HoverableOpacity
      onPress={onSelect}
      className={`
        flex flex-row gap-2 items-center justify-center
        px-3 py-1.5 rounded-lg
        bg-slate-800/60 border border-slate-600/60
        text-slate-100 text-sm
        whitespace-nowrap
      `}
      activeClass="active:bg-slate-600/70 active:border-slate-500/70"
      hoverClass="hover:bg-slate-700/70 hover:border-slate-500/70"
    >
      <BlockTexture
        blockId={representativeBlock}
        className={"w-5 h-5"}
      />
      {materialName}
    </HoverableOpacity>
  )
}

function ClearBlockFiltersButton({
  onPress,
}: {
  onPress: () => void
}) {
  const { onMobile } = useResponsiveDesign();

  return (
    <HoverableOpacity
      onPress={onPress}
      className={`
        flex flex-row items-center
        px-1 gap-1 rounded-md cursor-pointer
      `}
      activeColor="bg-slate-600"
    >
      <FilterX
        className={`
          ${onMobile ? "h-4 w-4" : "h-4 w-4"}
          text-slate-300
        `}
      />
      <span
        className={`
          ${onMobile ? "text-xs " : "text-sm"}
          rounded-full text-slate-300 font-medium leading-tight
        `}
      >
        Clear filters
      </span>
    </HoverableOpacity>
  );
}

export function BlockFilterButton({
  blockFilter,
  onPress,
}: {
  blockFilter: BlockFilter
  onPress: () => void
}) {
  const { onMobile } = useResponsiveDesign();

  const filterCount = useMemo(() => (
    (blockFilter.materials?.length ?? 0) +
    (blockFilter.removeBlocks?.length ?? 0)
  ), [blockFilter]);

  return (
    <HoverableOpacity
      onPress={onPress}
      className={`
        flex flex-row items-center
        px-1 py-2 gap-1 rounded-md z-10
      `}
      activeColor="bg-slate-600"
    >
      <Filter className={onMobile ? "h-4 w-4 text-slate-200" : "h-5 w-5 text-slate-200"} />
      {filterCount > 0 && (
        <span
          className={
            (onMobile ? "text-xs px-1.5 py-0.5" : "text-sm px-2 py-0.5") +
            " rounded-full bg-slate-700/70 text-slate-100 font-medium leading-none"
          }
        >
          {filterCount}
        </span>
      )}
    </HoverableOpacity>
  );
}