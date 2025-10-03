const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'https://your-vercel-frontend.vercel.app' : '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://your-vercel-frontend.vercel.app' : 'http://localhost:3000'
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/chats', require('./routes/chats'));
app.use('/api/payments', require('./routes/payments'));

// Socket.io for real-time chats
const Message = require('./models/Message');  // For broadcasting saved messages

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', async (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    // Load recent messages for room
    const recentMessages = await Message.find({ roomId }).sort({ createdAt: -1 }).limit(50);
    socket.emit('loadMessages', recentMessages.reverse());  // Send oldest first
  });

  socket.on('sendMessage', async (data) => {  // data: { roomId, message, sender }
    const newMessage = new Message({ ...data, createdAt: new Date() });
    await newMessage.save();
    io.to(data.roomId).emit('receiveMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));