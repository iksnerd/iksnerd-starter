import { qdrantClient } from "@/infrastructure";
import { devModelOn } from "../../constants";
import { localEmbeddingModel } from "../../providers/ollama";

interface FindRelevantContentResponse {
  content: string;
  metadata: Record<string, unknown> | object;
  category: string;
  slug: string;
}
type Metadata = {
  source?: string;
  category?: string;
  excerpt?: string;
  chunkIndex?: number;
  chunkSize?: number;
};

const lawsCollectionName = "test_collection";
export const findRelevantContent = async (
  userQuery: string,
): Promise<FindRelevantContentResponse[]> => {
  try {
    if (devModelOn) {
      const localUserQueryEmbedded = await localEmbeddingModel.doEmbed({
        values: [userQuery],
      });

      console.log("User Query LOCAL Embedded:", localUserQueryEmbedded);

      const searchResult = await qdrantClient.search(lawsCollectionName, {
        vector: localUserQueryEmbedded.embeddings[0],
        limit: 10,
        score_threshold: 0.4, // Adjust this threshold based on your needs
        // consistency: "quorum", // Ensures that the search is consistent across all replicas
      });

      console.log("Search Result:", searchResult);

      return searchResult.map((item) => {
        return {
          content: (item.payload?.text as string) || "",
          metadata: item.payload?.metadata || {},
          slug:
            (item.payload?.metadata as Metadata).source?.split(".")[0] || "",
          category:
            (item.payload?.category as string) || "Закон за счетоводството",
        };
      });
    } else {
      const userQueryEmbedded = await localEmbeddingModel.doEmbed({
        values: [userQuery],
      });

      console.log("User Query Embedded:", userQueryEmbedded);

      const searchResult = await qdrantClient.search(lawsCollectionName, {
        vector: userQueryEmbedded.embeddings[0],
        limit: 10,
        score_threshold: 0.5, // Adjust this threshold based on your needs
        // consistency: "quorum", // Ensures that the search is consistent across all replicas
      });

      console.log("Search Result:", searchResult);

      return searchResult.map((item) => {
        return {
          content: (item.payload?.text as string) || "",
          metadata: item.payload?.metadata as Metadata,
          slug:
            (item.payload?.metadata as Metadata).source?.split(".")[0] || "",
          category:
            (item.payload?.category as string) || "Закон за счетоводството",
        };
      });
    }
  } catch (error) {
    throw error;
  }
};
