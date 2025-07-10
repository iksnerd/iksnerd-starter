import { CmsService } from "@/core";
import { hygraphClient } from "@/infrastructure";

export const cmsService: CmsService = {
  async query<T>(query: string): Promise<T | null> {
    try {
      return await hygraphClient<T>(query);
    } catch (error) {
      console.error("Error fetching data from CMS:", error);
      return null;
    }
  },
};
