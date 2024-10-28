"use strict";
import { io } from "socket.io-client";
const socket = io.connect("http://10.0.124.92:3000");
export default socket;
