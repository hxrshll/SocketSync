import {createServer} from 'node:http';
import {Server} from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3001', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handle);
    const io = new Server(httpServer);
    
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
    
    httpServer.listen(port, hostname, () => {
        console.log(`Server is running on http://${hostname}:${port}`);
    });
});