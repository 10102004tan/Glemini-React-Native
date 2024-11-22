'use strict';
import { io } from 'socket.io-client';
const socket = io.connect('http://192.168.53.179:3000', {
	transports: ['websocket'],
	reconnection: true,
});
export default socket;
