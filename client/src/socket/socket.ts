import { io } from "socket.io-client";
const URL = import.meta.env.VITE_SERVER;
const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});
socket.onAny((event, ...args) => {
  console.log(event, args, "d");
});
export default socket;
