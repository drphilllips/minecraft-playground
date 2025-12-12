import type { MinecraftBlock } from "../features/image-translator/types/minecraftBlock"


export type BlueprintCircularInstructions = {
  stepInstructions: BlueprintCircularStepInstruction[]
  totalSteps: number
}

export type BlueprintCircularStepInstruction = {
  step: number
  stepGrid: string[][] | MinecraftBlock[][]
  instructionString: string
}