import { VectorDbService } from "@/core";
import { vectorSearch } from "@/services/vector-db/search";

export const vectorDbService: VectorDbService = {
  search: async (payload) => {
    return await vectorSearch(payload);
  },
};
