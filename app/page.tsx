"use client"

import { useState, useEffect } from "react";
import ChatFrom from "@/components/ChatFrom";
import ChatMessage from "@/components/ChatMessage";
import {socket} from "@/lib/socketClient";

interface Message {
  id: string;
  message: string;
  sender: string;
  timestamp: string;
  isOwnMessage: boolean;
  isSystemMessage?: boolean;
  isUserJoined?: boolean;
  isUserLeft?: boolean;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  
  const [messages, setMessages] = useState<Message[]>([]);

  // Socket.IO event listeners
  useEffect(() => {
    // Listen for user join events
    socket.on('userJoined', (data: { username: string, room: string }) => {
      console.log('Received userJoined event:', data);
      if (data && data.username && data.room) {
        const joinMessage: Message = {
          id: Date.now().toString(),
          message: `user ${data.username} has joined room ${data.room}`,
          sender: data.username,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwnMessage: false,
          isUserJoined: true
        };
        setMessages(prev => [...prev, joinMessage]);
      }
    });

    // Listen for messages from the server
    socket.on('messages', (data: { message: string, sender: string, room: string }) => {
      console.log('Received messages event:', data);
      if (data && data.message && data.sender) {
        const newMessage: Message = {
          id: Date.now().toString(),
          message: data.message,
          sender: data.sender,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwnMessage: false, // We'll determine this when we have the current user context
          isSystemMessage: false
        };
        setMessages(prev => [...prev, newMessage]);
      }
    });

    // Listen for user leave events
    socket.on('userLeft', (data: { username: string, room: string }) => {
      if (data && data.username && data.room) {
        const leaveMessage: Message = {
          id: Date.now().toString(),
          message: `user ${data.username} has left room ${data.room}`,
          sender: data.username,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwnMessage: false,
          isUserLeft: true
        };
        setMessages(prev => [...prev, leaveMessage]);
      }
    });

    // Listen for new messages
    socket.on('newMessage', (data: { message: string, sender: string, room: string }) => {
      if (data && data.message && data.sender) {
        const newMessage: Message = {
          id: Date.now().toString(),
          message: data.message,
          sender: data.sender,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwnMessage: false,
          isSystemMessage: false
        };
        setMessages(prev => [...prev, newMessage]);
      }
    });

    // Cleanup function to remove event listeners
    return () => {
      socket.off('userJoined');
      socket.off('messages');
      socket.off('userLeft');
      socket.off('newMessage');
    };
  }, []);

  // Function to handle joining a room
  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && roomName.trim()) {
      setCurrentUser(username.trim());
      setCurrentRoom(roomName.trim());
      setHasJoined(true);
      
      // Emit join room event to server
      console.log('Emitting joinRoom event:', { username: username.trim(), room: roomName.trim() });
      socket.emit('joinRoom', {
        username: username.trim(),
        room: roomName.trim()
      });
      
      // Start with empty messages array
      setMessages([]);
    }
  };

  const handleSendMessage = (message: string) => {
    const data = { room: currentRoom, message: message, sender: currentUser };
    console.log('Emitting message event:', data);
    socket.emit('message', data);
    
    // Add message to local state for immediate feedback
    const newMessage: Message = {
      id: Date.now().toString(),
      message: message,
      sender: currentUser || "You",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwnMessage: true,
      isSystemMessage: false
    };
    
    setMessages(prev => [...prev, newMessage]);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!hasJoined ? (
        // Join Room Form
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Join a Room
            </h1>
            <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border-0 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                className="w-full px-4 py-3 border-0 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Join Room
            </button>            </form>
          </div>
        </div>
      ) : (
        // Chat Room
        <div className="p-4">
          <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Room: {currentRoom}
                </h1>
                <p className="text-sm text-gray-500 mt-1">Real-time chat room</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Logged in as</p>
                  <p className="text-lg font-semibold text-blue-600">{currentUser}</p>
                </div>
                <button
                  onClick={() => setHasJoined(false)}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md"
                >
                  Leave Room
                </button>
              </div>
            </div>
          </div>
          
          {/* Chat Messages Container */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-96 overflow-y-auto mb-6">
            {messages.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                <p className="text-lg">💬 No messages yet</p>
                <p className="text-sm mt-2">Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg.message}
                  sender={msg.sender}
                  timestamp={msg.timestamp}
                  isOwnMessage={msg.isOwnMessage}
                  isSystemMessage={msg.isSystemMessage}
                  isUserJoined={msg.isUserJoined}
                  isUserLeft={msg.isUserLeft}
                />
              ))
            )}
          </div>
          
          <ChatFrom onSendMessage={handleSendMessage}/>
          </div>
        </div>
      )}
    </div>
  );
}
