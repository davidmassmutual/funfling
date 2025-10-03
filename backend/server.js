const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');
const paymentRoutes = require('./routes/payments');
const { Server } = require('socket.io');
const http = require('http');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'https://funfling.vercel.app' : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  }
});

// CORS middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://funfling.vercel.app' : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests explicitly
app.options('*', cors());

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/payments', paymentRoutes);

// Socket.io setup (unchanged)
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('join', (userId) => socket.join(userId));
  socket.on('message', ({ senderId, receiverId, content }) => {
    io.to(receiverId).emit('message', { senderId, content });
  });
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));