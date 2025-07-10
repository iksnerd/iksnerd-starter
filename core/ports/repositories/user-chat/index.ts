import { CreatePayload, IDOnlyPayload } from "@/core";
import { UpdatePayload, UserChatData } from "@/core";

interface UserChatPayload {
  userId: string;
}

export interface UserChatRepository {
  get(payload: UserChatPayload & IDOnlyPayload): Promise<UserChatData | null>;
  getAll(payload: UserChatPayload): Promise<UserChatData[]>;
  create(
    payload: CreatePayload<UserChatData> & UserChatPayload & IDOnlyPayload,
  ): Promise<void>;
  update(payload: UpdatePayload<UserChatData> & UserChatPayload): Promise<void>;
  delete(payload: UserChatPayload & IDOnlyPayload): Promise<void>;
}
