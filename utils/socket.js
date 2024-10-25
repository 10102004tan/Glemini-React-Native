'use strict'
import { io } from "socket.io-client";
const socket = io.connect("http://10.0.226.182:8000");
export default socket;