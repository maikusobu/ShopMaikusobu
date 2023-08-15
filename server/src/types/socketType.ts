import { ObjectId } from "mongoose";

export interface ServerToClientEvents {
  session: (data: { userID: string; sessionID: string }) => void;
  users: (users: User[]) => void;
  "user connected": (user: User) => void;
  "private message": (message: Message) => void;
  typing: (data: { userID: string }) => void;
  "user disconnected": (userID: string) => void;
}

export interface ClientToServerEvents {
  "private message": (data: { content: string; to: string }) => void;
  typing: (data: { userID: string }) => void;
  newMessageCheck: (userID: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  sessionID: string;
  username: string;
}

export interface User {
  userID: string;
  username: string;
  connected: boolean;
  conversations: Conversation[];
}

export interface Session {
  id: string;
  userID: ObjectId;
  username: string;
  connected: boolean;
}

export interface Message {
  content: string;
  from: string;
  to: string;
}

export interface Conversation {
  participants: {
    participant_id: ObjectId;
    hasNewMessage: boolean;
  }[];
  messages: Message[];
}
