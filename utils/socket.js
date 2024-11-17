'use strict';
import { io } from 'socket.io-client';
const socket = io.connect('http://75.101.204.65:8000');
export default socket;
