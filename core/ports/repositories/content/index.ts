import { HomePage } from '@/core';

export interface ContentRepository {
  getHomePage(): Promise<HomePage | null>;
}
