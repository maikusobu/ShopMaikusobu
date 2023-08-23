/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket } from "socket.io";
import userModel from "../models/User_management/userModel";
import sessionModel from "../models/User_Chat_management/sessionModel";
export const socketMiddleware = async (socket: Socket, next: any) => {
  const id = socket.handshake.auth.userID;
  if (!id) return next(new Error("No User Id"));
  const user = await userModel.findById(id);
  if (socket.handshake.auth.sessionID) {
    const session = await sessionModel.findById(
      socket.handshake.auth.sessionID
    );
    if (session) {
      socket.data.username = session.username as string;
      socket.data.sessionID = session.id;
      return next();
    }
  } else {
    const session = await sessionModel.findOne({ userID: id });
    if (session) {
      socket.data.username = session.username as string;

      socket.data.sessionID = session.id;
      return next();
    }
  }

  if (!user) {
    return next(new Error("Not have that user"));
  }
  socket.data.username = user.username;
  next();
};
