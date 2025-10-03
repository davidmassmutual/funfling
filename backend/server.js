const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');
const chatsRoutes = require('./routes/chats');
const paymentsRoutes = require('./routes/payments');

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

// CORS middleware - this handles OPTIONS preflight requests automatically
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://funfling.vercel.app' : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// REMOVED: app.options('*', cors()); - This was causing the PathError

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/chats', chatsRoutes);
app.use('/api/payments', paymentsRoutes);

// Socket.io for real-time chats
const Message = require('./models/Message');

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', async (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    const recentMessages = await Message.find({ roomId }).sort({ createdAt: -1 }).limit(50);
    socket.emit('loadMessages', recentMessages.reverse());
  });

  socket.on('sendMessage', async (data) => {
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