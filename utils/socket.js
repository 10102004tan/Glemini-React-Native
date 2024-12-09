'use strict';
import { io } from 'socket.io-client';
const socket = io.connect('http://18.139.228.246:3000', {
	transports: ['websocket'],
	reconnection: true,
});
export default socket;
