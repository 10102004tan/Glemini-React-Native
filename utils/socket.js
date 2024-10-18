'use strict'
import { io } from "socket.io-client";
const socket = io.connect("http://34.203.231.23:8000");
export default socket;