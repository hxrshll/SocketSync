import { createServer } from 'node:http';
import { Server } from 'socket.io';

const port = parseInt(process.env.PORT || '3001', 10);

// Create a simple HTTP server for Socket.IO only
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('joinRoom', (data: { username: string, room: string }) => {
    socket.join(data.room);
    console.log(`${data.username} joined room: ${data.room}`);
    socket.to(data.room).emit('userJoined', {
      username: data.username,
      room: data.room
    });
  });

  socket.on('message', (data: { message: string, sender: string, room: string }) => {
    console.log(`Message from ${data.sender} in room ${data.room}: ${data.message}`);
    socket.to(data.room).emit('messages', {
      message: data.message,
      sender: data.sender,
      room: data.room
    });
  });

  socket.on('leaveRoom', (data: { username: string, room: string }) => {
    socket.leave(data.room);
    console.log(`${data.username} left room: ${data.room}`);
    socket.to(data.room).emit('userLeft', {
      username: data.username,
      room: data.room
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(port, () => {
  console.log(`Socket.IO server is running on http://localhost:${port}`);
});
