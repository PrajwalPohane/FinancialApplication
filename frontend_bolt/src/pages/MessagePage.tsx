import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip, 
  Smile,
  Phone,
  Video,
  MoreHorizontal,
  Star,
  Archive,
  Trash2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const MessagePage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Matheus Ferrero',
      lastMessage: 'Thanks for the payment! The project is complete.',
      time: '2:30 PM',
      unread: 2,
      avatar: 'M',
      online: true,
      type: 'client'
    },
    {
      id: 2,
      name: 'Floyd Miles',
      lastMessage: 'Can we schedule a call for tomorrow?',
      time: '1:15 PM',
      unread: 0,
      avatar: 'F',
      online: false,
      type: 'colleague'
    },
    {
      id: 3,
      name: 'Jerome Bell',
      lastMessage: 'The invoice has been processed successfully.',
      time: '11:45 AM',
      unread: 1,
      avatar: 'J',
      online: true,
      type: 'client'
    },
    {
      id: 4,
      name: 'Savannah Nguyen',
      lastMessage: 'Great work on the analytics dashboard!',
      time: 'Yesterday',
      unread: 0,
      avatar: 'S',
      online: false,
      type: 'manager'
    },
    {
      id: 5,
      name: 'Brooklyn Simmons',
      lastMessage: 'When can we expect the next update?',
      time: 'Yesterday',
      unread: 3,
      avatar: 'B',
      online: true,
      type: 'client'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Matheus Ferrero',
      content: 'Hi! I wanted to discuss the payment for the recent project.',
      time: '2:15 PM',
      isOwn: false,
      type: 'text'
    },
    {
      id: 2,
      sender: 'You',
      content: 'Sure! I can process the payment today. What\'s the total amount?',
      time: '2:18 PM',
      isOwn: true,
      type: 'text'
    },
    {
      id: 3,
      sender: 'Matheus Ferrero',
      content: 'The total is $854.08 for the web development work.',
      time: '2:20 PM',
      isOwn: false,
      type: 'text'
    },
    {
      id: 4,
      sender: 'You',
      content: 'Perfect! I\'ll send the payment right now.',
      time: '2:22 PM',
      isOwn: true,
      type: 'text'
    },
    {
      id: 5,
      sender: 'You',
      content: 'Payment sent! You should receive it within a few minutes.',
      time: '2:25 PM',
      isOwn: true,
      type: 'text'
    },
    {
      id: 6,
      sender: 'Matheus Ferrero',
      content: 'Thanks for the payment! The project is complete.',
      time: '2:30 PM',
      isOwn: false,
      type: 'text'
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage('');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation, index) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(index)}
                className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700/50 transition-colors duration-200 ${
                  selectedChat === index ? 'bg-gray-700/50 border-r-2 border-emerald-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{conversation.avatar}</span>
                    </div>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium truncate">{conversation.name}</h3>
                      <span className="text-gray-400 text-xs">{conversation.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-gray-400 text-sm truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        conversation.type === 'client' ? 'bg-blue-500/10 text-blue-400' :
                        conversation.type === 'colleague' ? 'bg-purple-500/10 text-purple-400' :
                        'bg-orange-500/10 text-orange-400'
                      }`}>
                        {conversation.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gray-800 border-b border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {filteredConversations[selectedChat]?.avatar}
                    </span>
                  </div>
                  {filteredConversations[selectedChat]?.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold">
                    {filteredConversations[selectedChat]?.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {filteredConversations[selectedChat]?.online ? 'Online' : 'Last seen 2 hours ago'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isOwn
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.isOwn ? 'text-emerald-100' : 'text-gray-400'
                  }`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="bg-gray-800 border-t border-gray-700 p-6">
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200">
                <Paperclip className="h-5 w-5" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-12"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors duration-200">
                  <Smile className="h-5 w-5" />
                </button>
              </div>
              
              <button
                onClick={handleSendMessage}
                className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;