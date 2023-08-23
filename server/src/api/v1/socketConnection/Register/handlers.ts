import { Server, Socket } from "socket.io";
import sessionModel from "../../models/User_Chat_management/sessionModel";
import conversationModel from "../../models/User_Chat_management/conversationMode";
import {
  ClientToServerEvents,
  Conversation,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
  User,
} from "../../../../types/socketType";
import messageModel from "../../models/User_Chat_management/messageModel";
export async function handleConnection(socket: Socket) {
  socket.join(socket.handshake.auth.userID);
  let sessionID: string = "";
  if (!socket.data.sessionID) {
    sessionID = (
      await sessionModel.create({
        userID: socket.handshake.auth.userID,
        username: socket.data.username,
        connected: true,
      })
    ).id;
  } else {
    sessionID = (await sessionModel.findByIdAndUpdate(
      socket.data.sessionID,
      {
        connected: true,
      },
      { new: true }
    ))!.id;
  }

  socket.emit("session", {
    userID: socket.handshake.auth.userID,
    sessionID: sessionID,
  });
  const users: User[] = [];
  // eslint-disable-next-line prefer-const
  let [conversations, sessions] = await Promise.all([
    conversationModel
      .find({ "participants.participant_id": socket.handshake.auth.userID })
      .populate("messages"),
    sessionModel.find(),
  ]);

  sessions.forEach(async (session) => {
    if (session.userID.toString() !== socket.handshake.auth.userID) {
      const existingConversation = conversations.find((conversation) =>
        conversation.participants.some(
          (participant) =>
            participant.participant_id?.toString() === session.userID.toString()
        )
      );
      if (!existingConversation) {
        await conversationModel.create({
          participants: [
            {
              participant_id: socket.handshake.auth.userID,
              hasNewMessage: false,
            },
            {
              participant_id: session.userID,
              hasNewMessage: false,
            },
          ],
          messages: [],
        });
      }
    }
  });

  conversations = await conversationModel
    .find({ "participants.participant_id": socket.handshake.auth.userID })
    .populate("messages");

  sessions.forEach((session) => {
    if (session.userID.toString() !== socket.handshake.auth.userID) {
      users.push({
        userID: session.userID.toString(),
        username: session.username as string,
        connected: session.connected as boolean,
        conversations: conversations.filter((conversation) => {
          return (
            conversation.participants.some(
              (participant) =>
                participant.participant_id?.toString() ===
                session.userID.toString()
            ) &&
            conversation.participants.some(
              (participant) =>
                participant.participant_id?.toString() ===
                socket.handshake.auth.userID
            )
          );
        }) as unknown as Conversation[],
      });
    }
  });
  socket.emit("users", users);
  socket.broadcast.emit("user connected", {
    userID: socket.handshake.auth.userID,
    username: socket.data.username as string,
    conversations: conversations.filter((conversation) => {
      return conversation.participants.some(
        (participant) =>
          participant.participant_id?.toString() ===
          socket.handshake.auth.userID
      );
    }) as unknown as Conversation[],
    connected: true,
  });
}
export async function handleDisconnection(
  socket: Socket,
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) {
  socket.on("disconnect", async () => {
    const matchingSockets = await io
      .in(socket.handshake.auth.userID)
      .fetchSockets();
    const isDisconnected = matchingSockets.length === 0;
    if (isDisconnected) {
      socket.broadcast.emit("user disconnected", socket.handshake.auth.userID);
      await sessionModel.findOneAndUpdate(
        { userID: socket.handshake.auth.userID },
        {
          connected: false,
        }
      );
    }
  });
}
export async function handleNewMessageCheck(socket: Socket) {
  socket.on("newMessageCheck", async (userID) => {
    await conversationModel.findOneAndUpdate(
      {
        $and: [
          { "participants.participant_id": socket.handshake.auth.userID },
          { "participants.participant_id": userID },
        ],
      },
      {
        $set: {
          "participants.$[user].hasNewMessage": false,
        },
      },
      {
        arrayFilters: [{ "user.participant_id": userID }],
      }
    );
  });
}
export function handleTyping(socket: Socket) {
  socket.on("typing", (data) => {
    socket.to(data.userID).emit("typing", data);
  });
}
export async function handlePrivateMessage(
  socket: Socket,
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) {
  socket.on("private message", async ({ content, to }) => {
    const message = { content, from: socket.handshake.auth.userID, to };
    io.to([to, socket.handshake.auth.userID]).emit("private message", message);

    const new_message = await messageModel.create(message);
    await conversationModel.findOneAndUpdate(
      {
        $and: [
          { "participants.participant_id": socket.handshake.auth.userID },
          { "participants.participant_id": to },
        ],
      },
      {
        $set: {
          "participants.$[user1].hasNewMessage": true,
          "participants.$[user2].hasNewMessage": true,
        },
        $push: {
          messages: new_message._id,
        },
      },
      {
        arrayFilters: [
          { "user1.participant_id": socket.handshake.auth.userID },
          { "user2.participant_id": to },
        ],
      }
    );
  });
}
