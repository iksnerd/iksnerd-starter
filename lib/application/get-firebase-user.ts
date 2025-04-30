"use server";

import { databaseService } from "@/services/database/database-admin-service";
import { USERS_COLLECTION } from "@/repositories/user";
import { UserData } from "@/core";

interface Payload {
  userId: string;
}

export const getFirebaseUser = async (
  payload: Payload,
): Promise<UserData | null> => {
  return databaseService.get(USERS_COLLECTION, payload.userId);
};
