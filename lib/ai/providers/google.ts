import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProviderOptions,
} from "@ai-sdk/google";
import { EMBEDDINGS_MODELS } from "@/lib/ai/constants";

export const googleProvider = createGoogleGenerativeAI();

export const embeddingsModelSearch = googleProvider.textEmbeddingModel(
  EMBEDDINGS_MODELS.TEXT_EMBEDDING_004,
  {
    outputDimensionality: 768, // optional, number of dimensions for the embedding
    taskType: "QUESTION_ANSWERING", // optional, specifies the task type for generating embeddings
  },
);

export const embeddingsModelDocumentRetrieval =
  googleProvider.textEmbeddingModel(EMBEDDINGS_MODELS.TEXT_EMBEDDING_004, {
    outputDimensionality: 768, // optional, number of dimensions for the embedding
    taskType: "RETRIEVAL_DOCUMENT", // optional, specifies the task type for generating embeddings
  });

export const googleProviderOptions = {
  thinkingConfig: {
    thinkingBudget: 2048,
    includeThoughts: true,
  },
  responseModalities: ["TEXT"],
} satisfies GoogleGenerativeAIProviderOptions;
