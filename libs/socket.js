'use strict';
// import { getWiFiIPv4 } from '@/utils';
import { io } from 'socket.io-client';
// const base_url = getWiFiIPv4() || 'http://192.168.1.246:3000';
const socket = io.connect('http://localhost:3000', {
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
