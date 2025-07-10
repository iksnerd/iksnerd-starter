import {
  CmsService,
  ContentRepository,
  RepositoryHost,
  UserChatRepository,
} from "@/core";

import { getUserRepository } from "./user";
import { getUserServerRepository } from "@/repositories/user-server";
import { getContentRepository } from "@/repositories/content";
import { getUserChatRepository } from "@/repositories/user-chat";
import { getUserChatServerRepository } from "@/repositories/chat-server";

export const repositoryHost: RepositoryHost = {
  getUserRepository(databaseService) {
    return getUserRepository(databaseService);
  },
  getUserChatRepository(databaseService) {
    return getUserChatRepository(databaseService);
  },
  getUserServerRepository(databaseService) {
    return getUserServerRepository(databaseService);
  },
  getUserChatServerRepository(databaseService): UserChatRepository {
    return getUserChatServerRepository(databaseService);
  },
  getContentRepository(cmsService: CmsService): ContentRepository {
    return getContentRepository(cmsService);
  },
};
