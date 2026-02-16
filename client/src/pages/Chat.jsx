import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Send, Paperclip, Smile } from 'lucide-react';
import socket from '../services/socket';
import axios from 'axios';

const Chat = () => {
    const { channelId } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Fetch initial messages
        const fetchMessages = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(`http://localhost:5000/api/messages/channel/${channelId}`, config);
                setMessages(data.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        if (channelId) {
            fetchMessages();

            // Socket join channel
            socket.connect();
            socket.emit('join-channel', channelId);

            socket.on('receive-message', (message) => {
                setMessages((prev) => [...prev, message]);
            });

            return () => {
                socket.off('receive-message');
                socket.disconnect();
            };
        }
    }, [channelId, user.token]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const messageData = {
                channelId,
                content: newMessage,
            };

            const { data } = await axios.post(`http://localhost:5000/api/messages`, messageData, config);

            // Emit via socket
            socket.emit('send-message', data.data);

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, index) => (
                    <div key={msg._id || index} className={`flex ${msg.senderId._id === user.user.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl p-4 ${msg.senderId._id === user.user.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                            <div className="flex items-center space-x-2 mb-1">
                                <span className="text-xs font-bold opacity-75">{msg.senderId.name}</span>
                                <span className="text-[10px] opacity-50">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-sm">{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                    <button type="button" className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Paperclip className="h-5 w-5" />
                    </button>
                    <input
                        type="text"
                        className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="button" className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Smile className="h-5 w-5" />
                    </button>
                    <button type="submit" className="bg-indigo-600 p-2 rounded-lg text-white hover:bg-indigo-700 transition-colors">
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;

