import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import '../styles/Chats.css';

function Chats() {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const otherUserId = new URLSearchParams(location.search).get('user');
  const roomId = user && otherUserId ? [user.id, otherUserId].sort().join('_') : null;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user || !roomId) {
      setError('Select a user to chat.');
      return;
    }
    const newSocket = io('http://localhost:5000');  // Update to Render URL
    setSocket(newSocket);

    newSocket.emit('joinRoom', roomId);

    newSocket.on('receiveMessage', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => newSocket.close();
  }, [roomId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (socket && message.trim()) {
      socket.emit('sendMessage', { roomId, message: message.trim(), sender: user.username });
      setMessage('');
    }
  };

  if (!user) return <div>Please log in.</div>;

  return (
    <div className="chats-container">
      <h2>Chat</h2>
      {error && <p className="error">{error}</p>}
      <div className="messages-container">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender === user.username ? 'sent' : 'received'}`}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="message-form">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
          disabled={!socket}
        />
        <button type="submit" className="send-btn" disabled={!socket || !message.trim()}>Send</button>
      </form>
    </div>
  );
}

export default Chats;