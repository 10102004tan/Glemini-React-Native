"use strict";
import { io } from "socket.io-client";
const socket = io.connect("http://10.0.202.198:3000",{
    transports: ['websocket'],
    reconnection: true,
});
export default socket;
