import { z } from "zod";
import { baseEntitySchema } from "@/core";
import { Message } from "ai";

export const userChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["data", "user", "assistant", "system"]),
  content: z.string(),
  toolInvocations: z.array(z.any()).optional(),
  createdAt: z.date().optional(),
  parts: z
    .array(
      z.object({
        type: z.enum(["text", "tool-invocation"]),
        text: z.string().optional(),
        toolInvocation: z
          .object({
            id: z.string(),
            name: z.string(),
            arguments: z.any(),
          })
          .optional(),
      }),
    )
    .optional(),
  annotations: z.array(z.any()).optional(),
});

// Type inference from the schema

// Schema that combines base entity fields with message fields
export const userChatMessageDataSchema = baseEntitySchema.merge(
  userChatMessageSchema,
);

export type UserChatMessage = z.infer<typeof userChatMessageSchema>;

export type UserChatMessageData = z.infer<typeof userChatMessageDataSchema>;

export const userChatData = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  messages: z.array(userChatMessageDataSchema).optional(),
});

export const userChat = baseEntitySchema.merge(userChatData);

export type UserChatData = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title?: string;
  description?: string;
  messages?: Message[];
};
export type UserChat = z.infer<typeof userChat>;
