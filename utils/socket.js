"use strict";
import { io } from "socket.io-client";
const socket = io.connect("http://98.83.149.250:8000", {
  transports: ["websocket"],
  reconnection: true,
});
export default socket;
