import { createOllama } from "ollama-ai-provider";

const ollama = createOllama();

export const localChatModel = ollama("phi3");
export const localEmbeddingModel = ollama.embedding("nomic-embed-text");
