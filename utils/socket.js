"use strict";
import { io } from "socket.io-client";
const socket = io.connect("http://10.0.111.48:3000",{
    transports: ['websocket'],
});
export default socket;

