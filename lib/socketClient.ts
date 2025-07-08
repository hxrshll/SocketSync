"use client"

import { io } from 'socket.io-client';

// Use environment variable for server URL, fallback to localhost for development
const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export const socket = io(SERVER_URL, {
  transports: ['websocket', 'polling']
});

// Add some debugging
socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});