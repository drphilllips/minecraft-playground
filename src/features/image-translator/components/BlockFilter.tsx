import type { BlockFilter } from "../types/blockFilter";
import { Filter, FilterX, X } from "lucide-react";
import { useResponsiveDesign } from "../../../contexts/useResponsiveDesign";
import { useMemo } from "react";
import { BLOCK_MATERIAL_IDS, type BlockMaterial } from "../types/blockMaterial";
import InputField from "../../../components/InputField";
import { MATERIAL_NAMES } from "../constants/materialNames";
import BlankLabel from "../../../components/Label";
import BlockTexture from "./BlockTexture";
import { MATERIAL_REPRESENTATIVE_BLOCKS } from "../constants/materialRepresentativeBlocks";
import HoverableOpacity from "../../../components/HoverableOpacity";

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

  function clearFilters() {
    setBlockFilter({});
  }

  const inactiveMaterialFilters: BlockMaterial[] = useMemo(() => (
    BLOCK_MATERIAL_IDS.filter(
      (material) => !blockFilter.materials?.includes(material)
    )
  ), [blockFilter.materials]);

  return (
    <div className="flex flex-col w-full items-center justify-start gap-5 px-8 pt-3 pb-10">
      <InputField
        label="Materials in Use"
        className="w-full"
        labelHelperComponent={(
          Object.values(blockFilter).length > 0 && (
            <ClearBlockFiltersButton onPress={clearFilters} />
          )
        )}
      >
        <div className="flex flex-row flex-wrap gap-1">
          {(blockFilter.materials?.length || 0) > 0 ? blockFilter.materials?.map(
            (material, i) => (
              <BlockActiveMaterialFilterTag
                key={i}
                material={material}
                onRemove={() => removeActiveMaterialFilter(material)}
              />
            )
          ) : (
            <BlankLabel text="All materials in use — select material from the list below to filter" />
          )}
        </div>
      </InputField>
      <InputField label="Unselected Materials" className="w-full">
        <div className="flex flex-row flex-wrap gap-1">
          {inactiveMaterialFilters?.map(
            (material, i) => (
              <BlockSelectMaterialFilterTag
                key={i}
                material={material}
                onSelect={() => addActiveMaterialFilter(material)}
              />
            )
          )}
        </div>
      </InputField>
    </div>
  )
}

function BlockActiveMaterialFilterTag({
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
        select-none
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
        "
      >
        <X className="h-3 w-3 text-slate-200" />
      </button>
    </div>
  )
}

function BlockSelectMaterialFilterTag({
  material,
  onSelect,
}: {
  material: BlockMaterial
  onSelect: () => void
}) {

  const materialName = useMemo(() => (
    MATERIAL_NAMES[material]
  ), [material])

  const representativeBlock = useMemo(() => (
    MATERIAL_REPRESENTATIVE_BLOCKS[material]
  ), [material])

  return (
    <button
      type="button"
      onClick={onSelect}
      className="
        flex flex-row gap-2 items-center justify-center
        px-3 py-1.5
        rounded-lg
        bg-slate-800/60
        border border-slate-600/60
        text-slate-100 text-sm
        whitespace-nowrap
        hover:bg-slate-700/70
        hover:border-slate-500/70
        active:bg-slate-600/70
        transition-colors
        select-none
      "
      aria-label={`Add ${material} filter`}
    >
      <BlockTexture
        blockId={representativeBlock}
        className={"w-5 h-5"}
      />
      {materialName}
    </button>
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
        px-1 gap-1 rounded-md
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
        px-1 py-2 gap-1 rounded-md
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