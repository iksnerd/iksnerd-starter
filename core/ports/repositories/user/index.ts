import { User, UserData } from "@/core";
import { SetPayload, UpdatePayload } from "@/core";

export interface UserRepository {
  get(id: string): Promise<UserData | null>;
  getOrgMembers(orgId: string): Promise<User[]>;
  create(payload: SetPayload<UserData>): Promise<void>;
  update(payload: UpdatePayload<UserData>): Promise<void>;
}
