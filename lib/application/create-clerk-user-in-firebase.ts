"use server";

import { databaseService } from "@/services/database/database-admin-service";
import { UserData } from "@/core";
import { USERS_COLLECTION } from "@/repositories/user";

interface Payload {
  userData: UserData;
  userId: string;
}

export const getClerkUserFromFirebase = async (
  userId: string,
): Promise<UserData | null> => {
  return await databaseService.get(USERS_COLLECTION, userId);
};

export const createClerkUserInFirebase = async (
  payload: Payload,
): Promise<void> => {
  await databaseService.set(USERS_COLLECTION, payload.userId, payload.userData);
};

export const updateClerkUserInFirebase = async (
  payload: Payload,
): Promise<void> => {
  await databaseService.update(
    USERS_COLLECTION,
    payload.userId,
    payload.userData,
  );
};

export const deleteClerkUserInFirebase = async (
  userId: string,
): Promise<void> => {
  await databaseService.delete(USERS_COLLECTION, userId);
};
