import React from 'react'

interface ChatMessageProps {
  sender: string;
  message: string;
  timestamp?: string;
  isOwnMessage: boolean;
  isSystemMessage?: boolean;
  isUserJoined?: boolean;
  isUserLeft?: boolean;
}

const ChatMessage = ({ sender, message, timestamp, isOwnMessage, isSystemMessage = false, isUserJoined = false, isUserLeft = false }: ChatMessageProps) => {
  // Special handling for user join/leave messages
  if (isUserJoined) {
    return (
      <div className="flex justify-center mb-4">
        <div className="bg-green-50 border border-green-200 px-6 py-3 rounded-full shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
            <p className="text-green-800 text-sm font-semibold">
              {sender} joined the room
            </p>
            <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded">{timestamp}</span>
          </div>
        </div>
      </div>
    );
  }

  if (isUserLeft) {
    return (
      <div className="flex justify-center mb-4">
        <div className="bg-red-50 border border-red-200 px-6 py-3 rounded-full shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
            <p className="text-red-800 text-sm font-semibold">
              {sender} left the room
            </p>
            <span className="text-red-600 text-xs bg-red-100 px-2 py-1 rounded">{timestamp}</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`flex ${isSystemMessage ? "justify-center" : isOwnMessage ? "justify-end" : "justify-start"} mb-4`}> 
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-md ${
        isSystemMessage 
          ? "bg-gray-600 text-white text-center" 
          : isOwnMessage 
            ? "bg-blue-500 text-white shadow-blue-200" 
            : "bg-white text-gray-800 border border-gray-200 shadow-gray-200"
      }`}>
        {isSystemMessage && (
          <p className='text-xs font-bold mb-1 text-gray-200'>{sender}</p>
        )}
        {!isSystemMessage && !isOwnMessage && (
          <p className='text-sm font-semibold mb-1 text-gray-600'>{sender}</p>
        )}
        <p className={`${isSystemMessage ? "text-sm" : "text-base"} leading-relaxed`}>
          {message}
        </p>
        {timestamp && (
          <p className={`text-xs mt-2 ${
            isSystemMessage 
              ? 'text-gray-300' 
              : isOwnMessage 
                ? 'text-blue-100' 
                : 'text-gray-400'
          }`}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
