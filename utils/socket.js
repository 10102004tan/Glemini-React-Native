'use strict';
import { io } from 'socket.io-client';
const socket = io.connect('http://192.168.2.179:3000');
export default socket;
