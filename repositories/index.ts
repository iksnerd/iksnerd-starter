import { CmsService, ContentRepository, RepositoryHost } from "@/core";

import { getUserRepository } from "./user";
import { getUserServerRepository } from "@/repositories/user-server";
import { getContentRepository } from "@/repositories/content";

export const repositoryHost: RepositoryHost = {
  getUserRepository(databaseService) {
    return getUserRepository(databaseService);
  },
  getUserServerRepository(databaseService) {
    return getUserServerRepository(databaseService);
  },
  getContentRepository(cmsService: CmsService): ContentRepository {
    return getContentRepository(cmsService);
  },
};
