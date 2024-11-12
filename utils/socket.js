"use strict";
import { io } from "socket.io-client";

const socket = io.connect("http://10.0.185.165:3000",{
    transports: ['websocket'],
});

// socket.on("connect", () => {
//    // callback function
//     console.log("Socket connected");
// });
//
// socket.on("disconnect", () => {
//     console.log("Socket disconnected");
// });
export default socket;
