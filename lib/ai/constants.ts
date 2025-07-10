export enum MODELS {
  GEMINI_2_5_PRO = "gemini-2.5-pro",
  GEMINI_2_5_PRO_PREVIEW = "gemini-2.5-pro-preview-05-06",
  GEMINI_2_5_FLASH = "gemini-2.5-flash",
  GEMINI_2_5_FLASH_LITE_PREVIEW = "gemini-2.5-flash-lite-preview-06-17",
}

export enum EMBEDDINGS_MODELS {
  TEXT_EMBEDDING_004 = "text-embedding-004",
}

export const devModelOn = false;
export const mainModel = MODELS.GEMINI_2_5_FLASH_LITE_PREVIEW;

export type GoogleGenerativeAIModelId =
  | "gemini-1.5-flash"
  | "gemini-1.5-flash-latest"
  | "gemini-1.5-flash-001"
  | "gemini-1.5-flash-002"
  | "gemini-1.5-flash-8b"
  | "gemini-1.5-flash-8b-latest"
  | "gemini-1.5-flash-8b-001"
  | "gemini-1.5-pro"
  | "gemini-1.5-pro-latest"
  | "gemini-1.5-pro-001"
  | "gemini-1.5-pro-002"
  | "gemini-2.0-flash"
  | "gemini-2.0-flash-001"
  | "gemini-2.0-flash-live-001"
  | "gemini-2.0-flash-lite"
  | "gemini-2.0-pro-exp-02-05"
  | "gemini-2.0-flash-thinking-exp-01-21"
  | "gemini-2.0-flash-exp"
  | "gemini-2.5-pro-exp-03-25"
  | "gemini-2.5-pro-preview-05-06"
  | "gemini-2.5-flash-preview-04-17"
  | "gemini-exp-1206"
  | "gemma-3-27b-it"
  | "learnlm-1.5-pro-experimental"
  | (string & {});
