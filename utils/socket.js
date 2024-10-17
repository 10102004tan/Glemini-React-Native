'use strict'
import { io } from "socket.io-client";
const socket = io.connect("http://172.31.98.108:3000");
export default socket;