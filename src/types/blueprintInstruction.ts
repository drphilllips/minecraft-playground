import type { MinecraftBlock } from "../features/image-translator/types/minecraftBlock"


export type FullInstructions = {
  stepInstructions: StepInstruction[]
  totalSteps: number
}

export type StepInstruction = {
  step: number
  stepGrid: string[][] | MinecraftBlock[][]
  instructionString: string
}