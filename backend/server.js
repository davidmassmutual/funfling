const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');
const ladyProfileRoutes = require('./routes/ladyProfiles');
const chatsRoutes = require('./routes/chats');
const paymentsRoutes = require('./routes/payments');
const axios = require('axios');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'https://funfling.vercel.app' : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  }
});

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://funfling.vercel.app' : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/lady-profiles', ladyProfileRoutes);
app.use('/api/chats', chatsRoutes);
app.use('/api/payments', paymentsRoutes);

// Socket.io with Smartsupp notification
const Message = require('./models/Message');
const LadyProfile = require('./models/LadyProfile');

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', async (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    const recentMessages = await Message.find({ roomId }).sort({ createdAt: -1 }).limit(50);
    socket.emit('loadMessages', recentMessages.reverse());
  });

  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, content, roomId } = data;
    const newMessage = new Message({ senderId, receiverId, content, roomId, createdAt: new Date() });
    await newMessage.save();
    io.to(roomId).emit('receiveMessage', newMessage);

    // Send notification to Smartsupp
    try {
      const ladyProfile = await LadyProfile.findOne({ userId: receiverId });
      if (ladyProfile) {
        await axios.post(
          'https://api.smartsupp.com/v2/conversations',
          {
            content: `New message from user ${senderId} to ${ladyProfile.name}: ${content}`,
            visitor: { id: senderId },
            agent: { id: ladyProfile.userId }
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.SMARTSUPP_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(`Smartsupp notification sent for ${ladyProfile.name}`);
      }
    } catch (err) {
      console.error('Smartsupp notification error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));