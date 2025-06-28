import { VectorSearchPayload } from "@/core";

export const vectorSearch = async (payload: VectorSearchPayload) => {
  try {
    const response = await fetch("/api/vdb/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to send email" + error,
    };
  }
};
