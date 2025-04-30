import {
  CmsService,
  DatabaseClientService,
  DatabaseService,
  UserRepository,
  ContentRepository
} from '@/core';

export interface RepositoryHost {
  getUserRepository(databaseService: DatabaseClientService): UserRepository;
  getUserServerRepository(databaseService: DatabaseService): UserRepository;
  getContentRepository(
    cmsService: CmsService
  ): ContentRepository;
}
