import { qdrantClient } from "@/infrastructure";
import { VectorSearchPayload } from "@/core";

export const qdrantSearch = async (payload: VectorSearchPayload) => {
  return await qdrantClient.search(payload.collectionName, {
    vector: payload.vector,
    limit: payload.limit,
    score_threshold: payload.score_threshold, // Adjust this threshold based on your needs
    consistency: payload.consistency,
  });
};
