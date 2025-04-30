import { DatabaseClientService, User, UserData, UserRepository } from "@/core";

export const USERS_COLLECTION = "users";

export function getUserRepository(
  databaseService: DatabaseClientService,
): UserRepository {
  return {
    async get(id) {
      return databaseService.get<User>(USERS_COLLECTION, id);
    },

    async update(update) {
      await databaseService.update<UserData>(
        USERS_COLLECTION,
        update.id,
        update.data,
      );
    },

    async create(set) {
      await databaseService.set<UserData>(USERS_COLLECTION, set.id, set.data);
    },

    async getOrgMembers(orgId) {
      return databaseService.getAll<User>(USERS_COLLECTION, [
        {
          field: "orgId",
          operator: "==",
          value: orgId,
        },
      ]);
    },
  };
}
