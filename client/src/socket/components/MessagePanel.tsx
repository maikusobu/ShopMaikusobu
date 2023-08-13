import React, { useState, useEffect } from "react";
import {
  Textarea,
  Button,
  Text,
  Box,
  Avatar,
  Header,
  Divider,
  Group,
  Stack,
  createStyles,
} from "@mantine/core";
import StatusIcon from "./StatusIcon";
import type { UserType } from "./Chat";
import type { Socket } from "socket.io-client";
import { useGetUserByIdQuery } from "../../api/UserApi/UserApi";

import useAvatar from "../../hook/useAvatar";
interface MessagePanelProps {
  user: UserType;
  onInput: (input: string) => void;
  socket: Socket;
  senderId: string;
}
interface Typing {
  senderId: string;
  userID: string;
  username: string;
  typing: boolean;
}
const useStyles = createStyles(() => ({
  message: {},
  sender: {},
  form: {
    border: "2px solid white",
    padding: "20px",
  },
}));
const MessagePanel: React.FC<MessagePanelProps> = ({
  user,
  onInput,
  socket,
  senderId,
}) => {
  const [input, setInput] = useState("");
  const { classes } = useStyles();
  const { data } = useGetUserByIdQuery(user.userID, {
    skip: !user.userID,
  });
  const { data: sender } = useGetUserByIdQuery(senderId, {
    skip: senderId === "",
  });
  const imageUrl = useAvatar(data ? data : null);
  const senderImageUrl = useAvatar(sender ? sender : null);
  const [typing, setTyping] = useState<Typing>({
    senderId: "",
    userID: "",
    username: "",
    typing: false,
  });
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid) {
      onInput(input);
      setInput("");

      socket.emit("typing", {
        senderId: senderId,
        userID: user.userID,
        username: user.username,
        typing: false,
      });
    }
  };
  const onChange = (value: string) => {
    setInput(value);
    socket.emit("typing", {
      senderId: senderId,
      userID: user.userID,
      username: user.username,
      typing: value ? value.length > 0 : false,
    });
  };
  const displaySender = (index: number) => {
    return (
      index === 0 ||
      user.conversations[0].messages[index - 1].fromSelf !==
        user.conversations[0].messages[index].fromSelf
    );
  };
  useEffect(() => {
    socket.on("typing", (data) => {
      setTyping(data);
    });
    return () => {
      socket.off("typing");
    };
  }, [socket]);
  const isValid = input.length > 0;
  return (
    <Box
      sx={{
        border: "5px solid white",
        flexGrow: 1,
        height: "100vh",
      }}
    >
      <Stack>
        <Header height={20} p="10px" withBorder={false}>
          <Group>
            <StatusIcon connected={user.connected} />
            <Avatar src={imageUrl} size={30} radius={30} />
            {user.username}
          </Group>
        </Header>
        <Divider opacity={1} color="white" size={3} mt={30} />
        <Box
          p="20px"
          h="330px"
          sx={{
            display: "flex",
            overflowY: "auto",
          }}
        >
          <Stack
            spacing={5}
            sx={{
              flexWrap: "nowrap",
              minHeight: "min-content",
              width: "100%",
            }}
          >
            {user.conversations[0].messages.map((message, index) => (
              <div
                key={index}
                className={classes.message}
                style={{
                  width: "40%",
                  alignSelf: message.fromSelf ? "flex-end" : "flex-start",
                }}
              >
                {displaySender(index) && (
                  <div className={classes.sender}>
                    {message.fromSelf ? (
                      <Group mb="10px" position="right">
                        <div>
                          <Avatar
                            src={senderImageUrl}
                            size="25px"
                            radius={30}
                          />
                        </div>
                        <Text size="18px" weight={900}>
                          {sender?.username}
                        </Text>
                      </Group>
                    ) : (
                      <Group mb="10px">
                        <div>
                          <Avatar src={imageUrl} size="25px" radius={30} />
                        </div>
                        <Text size="18px" weight={900}>
                          {user.username}
                        </Text>
                      </Group>
                    )}
                  </div>
                )}
                <Text
                  size="15px"
                  px="15px"
                  sx={{
                    textAlign: message.fromSelf ? "right" : "left",
                  }}
                >
                  {message.content}
                </Text>
              </div>
            ))}
            {typing.typing &&
              typing.senderId === user.userID &&
              user.connected && (
                <Group>
                  <Avatar src={imageUrl} size="20px" radius={30} />

                  <Text size="14px"> {typing.username} is typing... </Text>
                </Group>
              )}
          </Stack>
        </Box>

        <form onSubmit={onSubmit} className={classes.form}>
          <Textarea
            value={input}
            radius={40}
            onChange={(e) => onChange(e.currentTarget.value)}
            placeholder="Your message..."
            className="input"
          />
          <Button
            disabled={!isValid}
            type="submit"
            mt="10px"
            size="20px"
            p="5px"
          >
            <Text size="18px"> Send </Text>
          </Button>
        </form>
      </Stack>
    </Box>
  );
};

export default MessagePanel;
