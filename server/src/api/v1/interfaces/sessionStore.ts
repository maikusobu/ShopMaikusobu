import sessionModel from "../models/User_Chat_management/sessionModel";
import type { Session } from "../models/User_Chat_management/sessionModel";
abstract class SessionStore {
  abstract findSession(id: string): Promise<Session | null>;
  abstract saveSession(session: Session): Promise<string>;
  abstract findAllSessions(): Promise<Session[]>;
  abstract updateSession(id: string, session: Session): Promise<void>;
  abstract findByID(id: string): Promise<Session | null>; // only for development //
}
class MongoSessionStore extends SessionStore {
  async findSession(id: string) {
    return await sessionModel.findById(id);
  }
  async findByID(id: string) {
    return await sessionModel.findOne({ userID: id });
  }
  async saveSession(session: Session) {
    const newSession = await sessionModel.create(session);
    return newSession.id;
  }
  async updateSession(id: string, session: Session) {
    await sessionModel.findByIdAndUpdate(id, session);
  }
  async findAllSessions() {
    return await sessionModel.find();
  }
}
export default MongoSessionStore;
