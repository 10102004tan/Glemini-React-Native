"use strict";
import { io } from "socket.io-client";
const socket = io.connect("http://10.0.215.155:3000");
export default socket;
