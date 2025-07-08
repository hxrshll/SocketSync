# SocketSync - Real-time Chat App

A modern real-time chat application built with Next.js, Socket.IO, and TypeScript.

## Features

- 🚀 Real-time messaging
- 🏠 Chat rooms
- 👥 User join/leave notifications
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## Deployment Options (Free)

### Option 1: Railway (Recommended)

1. Push your code to GitHub
2. Go to [Railway](https://railway.app)
3. Sign up with GitHub
4. Click "Deploy from GitHub repo"
5. Select this repository
6. Set environment variable: `NEXT_PUBLIC_SOCKET_URL=https://your-app.railway.app`
7. Deploy!

### Option 2: Render

1. Push your code to GitHub
2. Go to [Render](https://render.com)
3. Sign up with GitHub
4. Create a new "Web Service"
5. Connect your GitHub repo
6. Set environment variable: `NEXT_PUBLIC_SOCKET_URL=https://your-app.onrender.com`
7. Deploy!

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. In a separate terminal, run Socket.IO server:
   ```bash
   npm run dev:socket
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

- `NEXT_PUBLIC_SOCKET_URL`: The URL of your Socket.IO server
- `PORT`: Server port (set automatically by hosting platforms)
- `NODE_ENV`: Environment (development/production)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Socket.IO, Node.js
- **Deployment**: Railway/Render (free tiers)
