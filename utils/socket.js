"use strict";
import { io } from "socket.io-client";
const socket = io.connect("http://10.0.192.89:3000",{
    transports: ['websocket'],
    reconnection: true,
});
export default socket;
