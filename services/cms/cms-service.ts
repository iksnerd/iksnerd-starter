import { CmsService } from '@/core';
import { hygraphClient } from '@/infrastructure/hygraph/client';

export const cmsService: CmsService = {
  async query<T> (query: string): Promise<T | null> {
    
    try {
      const response = await hygraphClient<T>(query);
      return response;
    } catch (error) {
      console.error('Error fetching data from CMS:', error);
      return null;
    }
  }
};
