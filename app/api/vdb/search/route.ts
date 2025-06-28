import { NextRequest } from "next/server";
import { qdrantSearch } from "@/lib/application/qdrant-search";
import { VectorSearchClientPayload, VectorSearchPayload } from "@/core";
import { localEmbeddingModel } from "@/lib/ai/providers/ollama";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = (await req.json()) as VectorSearchClientPayload;
    console.log("Received body:", body);

    const userQueryEmbedded = await localEmbeddingModel.doEmbed({
      values: [body.query],
    });

    const results = await qdrantSearch({
      score_threshold: body.score_threshold,
      vector: userQueryEmbedded.embeddings[0],
      collectionName: body.collectionName,
      limit: body.limit,
      consistency: body.consistency,
    } as VectorSearchPayload);

    return Response.json(results);
  } catch (error) {
    console.error("Error processing request:", error);
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
