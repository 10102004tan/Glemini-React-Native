"use strict";
import { io } from "socket.io-client";
const socket = io.connect("http://10.0.241.176:3000",{
    transports: ['websocket'],
    reconnection: true,
});
export default socket;
