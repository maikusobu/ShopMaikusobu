/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { useState, useEffect } from "react";
import socket from "../socket";
import User from "./User";
import MessagePanel from "./MessagePanel";
import { Group, Stack, Title } from "@mantine/core";
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
    }
  };
  const onSelectUser = (user: UserType) => {
    const newUser = {
      ...user,
      conversations: user.conversations.map((conversation, index) => {
        if (index === 0) {
          return {
            ...conversation,
            participants: conversation.participants.map((participant) => {
              if (participant.participant_id === user.userID) {
                return { ...participant, hasNewMessage: false };
              } else {
                return participant;
              }
            }),
          };
        } else {
          return conversation;
        }
      }),
    };
    const newUsers = users.map((existingUser) =>
      existingUser.userID === user.userID ? newUser : existingUser
    );
    setUsers(newUsers);
    socket.emit("newMessageCheck", user.userID);
    setSelectedUser(newUser);
  };

  const onFoundmessages = (user: UserType) => {
    for (const conversation of user.conversations) {
      for (const participant of conversation.participants) {
        if (participant.participant_id === user.userID) {
          return participant.hasNewMessage;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    const handleUsersUpdate = (
      updatedUsers: UserType[],
      callback?: () => void
    ) => {
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
      if (callback) {
        callback();
      }
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
      if (selectedUser) {
        if (selectedUser.userID === id) {
          const newUser = {
            ...selectedUser,
            connected: false,
          };
          setSelectedUser(newUser);
        }
      }
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
                  participants: conversation.participants.map((participant) => {
                    if (
                      participant.participant_id ===
                      (auth.id === from ? to : from)
                    ) {
                      return { ...participant, hasNewMessage: true };
                    } else {
                      return participant;
                    }
                  }),
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

      handleUsersUpdate(updatedUsers, () => {
        if (selectedUser)
          if (selectedUser.userID === (auth.id === from ? to : from)) {
            socket.emit("newMessageCheck", auth.id === from ? to : from);
            const updatedUser = {
              ...selectedUser,
              conversations: selectedUser.conversations.map((conversation) => {
                if (
                  conversation.participants.some(
                    (p) => p.participant_id === auth.id
                  )
                ) {
                  return {
                    ...conversation,
                    participants: conversation.participants.map(
                      (participant) => {
                        if (
                          participant.participant_id ===
                          (auth.id === from ? to : from)
                        ) {
                          return {
                            ...participant,
                            hasNewMessage: false,
                          };
                        } else {
                          return participant;
                        }
                      }
                    ),
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

            setSelectedUser(updatedUser);
          }
      });
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
    <Group h="100%" w="100%" spacing={25} align="start" px="20px" py="16px">
      <Stack>
        <Title order={4}>Danh sách user tại hệ thống</Title>
        {users.map((user) => {
          return (
            <User
              key={user.userID}
              id={user.userID}
              connect={user.connected}
              hasNewMessages={onFoundmessages(
                user.userID === selectedUser?.userID ? selectedUser : user
              )}
              selected={selectedUser?.username === user.username}
              onSelect={() => onSelectUser(user)}
            />
          );
        })}
      </Stack>

      {selectedUser && (
        <MessagePanel
          senderId={auth.id}
          socket={socket}
          user={selectedUser}
          onInput={onMessage}
        />
      )}
    </Group>
  );
};

export default Chat;
