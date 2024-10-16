'use strict'
import { io } from "socket.io-client";
const socket = io.connect("http://172.31.99.18:8000");
export default socket;