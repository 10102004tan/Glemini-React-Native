"use strict";
import { io } from "socket.io-client";
const socket = io.connect("http://10.0.141.227:3000");
export default socket;
