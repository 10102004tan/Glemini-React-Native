"use strict";
import { io } from "socket.io-client";
const socket = io.connect("http://172.20.10.9:8000");
export default socket;
