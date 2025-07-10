import { DatabaseClientService, UserChatRepository } from "@/core";
import { USERS_COLLECTION } from "@/repositories/user";

export const USER_CHAT_COLLECTION = "chats";

// Build the collection path, not the document path
const buildUserChatCollectionPath = (userId: string): string =>
  `${USERS_COLLECTION}/${userId}/${USER_CHAT_COLLECTION}`;

export function getUserChatRepository(
  databaseService: DatabaseClientService,
): UserChatRepository {
  return {
    async get(payload) {
      return databaseService.get(
        buildUserChatCollectionPath(payload.userId),
        payload.id,
      );
    },

    async getAll(payload) {
      return databaseService.getAll(
        buildUserChatCollectionPath(payload.userId),
      );
    },

    async update(update) {
      await databaseService.update(
        buildUserChatCollectionPath(update.userId),
        update.id,
        update.data,
      );
    },

    async create(set) {
      // For create, we need to use set() with the specific ID instead of create()
      // since we want to specify the document ID
      await databaseService.create(
        buildUserChatCollectionPath(set.userId),
        set.data,
      );
    },

    async delete(payload) {
      await databaseService.delete(
        buildUserChatCollectionPath(payload.userId),
        payload.id,
      );
    },
  };
}
