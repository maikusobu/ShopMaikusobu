/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { useEffect } from "react";
import { selectAuth } from "../api/AuthReducer/AuthReduce";
import { useAppSelector } from "../app/hooks";
import Chat from "./components/Chat";
import socket from "./socket";
import Layout from "../component/layout/layout";
interface AppProps {}

const AppChat: React.FC<AppProps> = () => {
  const auth = useAppSelector(selectAuth);

  useEffect(() => {
    const handleSession = ({
      sessionID,
    }: {
      sessionID: string;
      userID: string;
    }) => {
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
    };
    socket.onAny((event, ...args) => console.log(event, args));
    socket.on("session", handleSession);

    const handleConnectError = (err: Error) => {
      if (err) {
        console.log(err);
      }
    };
    socket.on("connect_error", handleConnectError);
    return () => {
      socket.off("session", handleSession);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");
    socket.auth = { userID: auth.id, sessionID };
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [auth]);

  return <Layout>{auth.isLoggedIn && <Chat />}</Layout>;
};

export default AppChat;
