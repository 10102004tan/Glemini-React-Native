'use strict';
// import { getWiFiIPv4 } from '@/utils';
import { io } from 'socket.io-client';
// const base_url = getWiFiIPv4() || 'http://192.168.1.246:3000';
const socket = io.connect('http://192.168.2.4:3000', {
  reconnection: true,
  reconnectionAttempts: 5,
  // reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionTimeout: 20000,
});

// Hàm authenticate socket
export const authenticateSocket = (token, xClientId) => {
  if (token && xClientId) {
    socket.emit('authentication', {
      authorization: token,
      xClientId: xClientId,
    });
    console.log('Socket authentication sent');
  }
};

socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after attempts:', attemptNumber);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  if (reason === 'io server disconnect') {
    socket.connect();
  }
});

socket.on('unauthorized', (message) => {
  console.log('Socket unauthorized:', message);
});

socket.on('ping', (data) => {
  console.log('ping from socket server');
  socket.emit('pong', { timestamp: Date.now() });
});

export default socket;
