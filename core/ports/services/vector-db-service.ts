import { qdrantSearch } from "@/lib/application/qdrant-search";

export interface VectorSearchPayloadBase {
  collectionName: string;
  limit?: number;
  score_threshold?: number;
  consistency?: number | "quorum" | "all" | "majority" | undefined;
}

export interface VectorSearchPayload extends VectorSearchPayloadBase {
  vector: number[]; // The vector to search for
}

export interface VectorSearchClientPayload extends VectorSearchPayloadBase {
  query: string; // The query string to embed and search
}

export type QdrantSearchResponse = Awaited<ReturnType<typeof qdrantSearch>>;

export interface VectorDbService {
  search: (payload: VectorSearchPayload) => Promise<QdrantSearchResponse>;
}
