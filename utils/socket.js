"use strict";
import { io } from "socket.io-client";
const socket = io.connect("http://172.168.98.38:3000");
export default socket;
