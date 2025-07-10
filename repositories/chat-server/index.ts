import { DatabaseService } from "@/core/ports/services/database-admin-service";
import { UserChatData, UserChatRepository } from "@/core";

export const USERS_COLLECTION = "users";

const USER_CHAT_COLLECTION = "chats";

// Build the collection path, not the document path
const buildUserChatCollectionPath = (userId: string): string =>
  `${USERS_COLLECTION}/${userId}/${USER_CHAT_COLLECTION}`;

export function getUserChatServerRepository(
  databaseService: DatabaseService,
): UserChatRepository {
  return {
    async get(payload) {
      return databaseService.get<UserChatData>(
        buildUserChatCollectionPath(payload.userId),
        payload.id,
      );
    },

    async getAll(payload) {
      return databaseService.getAll<UserChatData>(
        buildUserChatCollectionPath(payload.userId),
      );
    },

    async update(update) {
      await databaseService.update<UserChatData>(
        buildUserChatCollectionPath(update.userId),
        update.id,
        update.data,
      );
    },

    async create(create) {
      await databaseService.create<UserChatData>(
        buildUserChatCollectionPath(create.userId),
        create.data,
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
