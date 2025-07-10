import {
  CmsService,
  DatabaseClientService,
  DatabaseService,
  UserRepository,
  ContentRepository,
  UserChatRepository,
} from "@/core";

export interface RepositoryHost {
  getUserRepository(databaseService: DatabaseClientService): UserRepository;
  getUserChatRepository(
    databaseService: DatabaseClientService,
  ): UserChatRepository;
  getUserServerRepository(databaseService: DatabaseService): UserRepository;
  getUserChatServerRepository(
    databaseService: DatabaseService,
  ): UserChatRepository;
  getContentRepository(cmsService: CmsService): ContentRepository;
}
