"use client"

import { io } from 'socket.io-client';

// Use environment variable for server URL, fallback to localhost for development
const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export const socket = io(SERVER_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

// Add some debugging
socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id || 'ID not available');
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from server. Reason:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message || error);
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected to server after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
  console.error('Reconnection failed:', error.message || error);
});