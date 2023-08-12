import messageModel from "../models/User_Chat_management/messageModel";
import type { Message } from "../models/User_Chat_management/messageModel";
abstract class MessageStore {
  abstract saveMessage(message: Message): void;
  abstract findMessagesForUser(userID: string): Promise<Message[]>;
}
class MongoMessageStore extends MessageStore {
  async saveMessage(message: Omit<Message, "createdAt" | "updatedAt">) {
    await messageModel.create(message);
  }

  async findMessagesForUser(userID: string) {
    return await messageModel.find().or([{ from: userID }, { to: userID }]);
  }
}
export default MongoMessageStore;
