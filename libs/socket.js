'use strict';
import { io } from 'socket.io-client';
const socket = io.connect('http://10.0.107.97:3000', {
	transports: ['websocket'],
	reconnection: true,
	reconnectionAttempts: 5,
	// reconnectionAttempts: Infinity,
	reconnectionDelay: 1000,
	reconnectionDelayMax: 5000,
	reconnectionTimeout: 20000,
});


socket.on('reconnect', (attemptNumber) => {
	console.log('Reconnected after attempts:', attemptNumber);
});

socket.on('disconnect', (reason) => {
	console.log('Disconnected:', reason);
	if (reason === 'io server disconnect') {
		socket.connect(); 
	}
});


export default socket;