/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { useState, useEffect } from "react";
import socket from "../socket";
import User from "./User";
import MessagePanel from "./MessagePanel";
import { Group } from "@mantine/core";
import { selectAuth } from "../../api/AuthReducer/AuthReduce";
import { useAppSelector } from "../../app/hooks";
interface Message {
  from: string;
  content: string;
  fromSelf: boolean;
}
interface Participant {
  participant_id: string;
  hasNewMessage: boolean;
}
interface Conversation {
  participants: Participant[];
  messages: Message[];
}
export interface UserType {
  userID: string;
  username: string;
  connected: boolean;
  hasNewMessages: boolean;
  conversations: Conversation[];
}

interface ChatProps {}

const Chat: React.FC<ChatProps> = () => {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const auth = useAppSelector(selectAuth);
  const onMessage = (content: string) => {
    if (selectedUser) {
      socket.emit("private message", {
        content,
        to: selectedUser.userID,
      });

      const newSelectedUser = selectedUser;

      newSelectedUser.conversations[0].messages.push({
        content,
        fromSelf: true,
        from: auth.id,
      });
      newSelectedUser.conversations[0].participants[0].hasNewMessage = false;
      setSelectedUser(newSelectedUser);
    }
  };
  const onSelectUser = (user: UserType) => {
    const newUser = {
      ...user,
      conversations: user.conversations.map((conversation, index) => {
        if (index === 0) {
          return {
            ...conversation,
            participants: conversation.participants.map(
              (participant, index) => {
                if (index === 1) {
                  return { ...participant, hasNewMessage: false };
                } else {
                  return participant;
                }
              }
            ),
          };
        } else {
          return conversation;
        }
      }),
    };
    socket.emit("newMessageCheck", user.userID);
    setSelectedUser(newUser);
  };

  useEffect(() => {
    const handleUsersUpdate = (updatedUsers: UserType[]) => {
      const updatedUserList = updatedUsers.map((user) => ({
        ...user,
        conversations: user.conversations.map((conversation) => ({
          ...conversation,
          messages: conversation.messages.map((message) => ({
            ...message,
            fromSelf: message.from === auth.id,
          })),
        })),
      }));
      setUsers(updatedUserList);
    };

    socket.on("connect", () => {
      const updatedUsers = users.map((user) =>
        user.userID === auth.id ? { ...user, connected: true } : user
      );
      handleUsersUpdate(updatedUsers);
    });

    socket.on("disconnect", () => {
      const updatedUsers = users.map((user) =>
        user.userID === auth.id ? { ...user, connected: false } : user
      );
      handleUsersUpdate(updatedUsers);
    });

    socket.on("users", (users) => {
      const sortedUsers = users.sort(
        (a: { username: number }, b: { username: number }) => {
          if (a.username < b.username) return -1;
          return a.username > b.username ? 1 : 0;
        }
      );
      handleUsersUpdate(sortedUsers);
    });

    socket.on("user connected", (user) => {
      const userIndex = users.findIndex((u) => u.userID === user.userID);
      if (userIndex !== -1) {
        const updatedUsers = users.map((existingUser) =>
          existingUser.userID === user.userID
            ? { ...existingUser, connected: true }
            : existingUser
        );
        handleUsersUpdate(updatedUsers);
      } else {
        const updatedUsers = [...users, { ...user, connected: true }];
        handleUsersUpdate(updatedUsers);
      }
    });

    socket.on("user disconnected", (id) => {
      const updatedUsers = users.map((user) =>
        user.userID === id ? { ...user, connected: false } : user
      );
      handleUsersUpdate(updatedUsers);
    });

    socket.on("private message", ({ content, from, to }) => {
      const updatedUsers = users.map((user) => {
        if (user.userID === (auth.id === from ? to : from)) {
          const updatedUser = {
            ...user,
            conversations: user.conversations.map((conversation) => {
              if (
                conversation.participants.some(
                  (p) => p.participant_id === auth.id
                )
              ) {
                return {
                  ...conversation,
                  messages: [
                    ...conversation.messages,
                    {
                      content,
                      fromSelf: auth.id === from,
                      from: from,
                    },
                  ],
                };
              } else return conversation;
            }),
          };
          return updatedUser;
        }

        return user;
      });

      handleUsersUpdate(updatedUsers);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("users");
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("private message");
    };
  }, [auth.id, selectedUser, users]);
  return (
    <Group h="100%" w="100%" spacing={0}>
      <div className="left-panel">
        {users.map((user) => {
          return (
            <User
              key={user.userID}
              id={user.userID}
              connect={user.connected}
              hasNewMessages={user.hasNewMessages}
              selected={selectedUser?.username === user.username}
              onSelect={() => onSelectUser(user)}
            />
          );
        })}
      </div>

      {selectedUser && (
        <MessagePanel
          user={selectedUser}
          onInput={onMessage}
          className="right-panel"
        />
      )}
    </Group>
  );
};

export default Chat;
