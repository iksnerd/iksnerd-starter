import { Message } from "ai";
import { repositoryHost } from "@/repositories";
import { databaseService } from "@/services/database/database-admin-service";

const userServerRepository =
  repositoryHost.getUserChatServerRepository(databaseService);

// Recursively remove undefined values from any object or array
const removeUndefinedValues = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj
      .map(removeUndefinedValues)
      .filter((item) => item !== undefined) as T;
  }

  if (obj !== null && typeof obj === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = removeUndefinedValues(value);
      }
    }
    return cleaned as T;
  }

  return obj;
};

const cleanMessages = (messages: Message[]): Message[] => {
  return removeUndefinedValues(messages) as Message[];
};

export async function createOrUpdateUserChat({
  chatId,
  userId,
  messages,
}: {
  chatId: string;
  userId: string;
  messages: Message[];
}) {
  // check if the chat exists
  const chat = await userServerRepository.get({ id: chatId, userId: userId });

  const cleanedMessages = cleanMessages(messages);

  if (!chat) {
    // If the chat does not exist, create a new one
    await userServerRepository.create({
      id: chatId,
      userId: chatId,
      data: {
        id: chatId,
        title: "",
        description: "",
        messages: cleanedMessages,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return;
  }

  await userServerRepository.update({
    id: chatId,
    userId: userId,
    data: {
      title: "",
      description: "",
      messages: cleanedMessages,
    },
  });
}
