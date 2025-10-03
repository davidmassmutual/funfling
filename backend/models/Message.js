const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },  // e.g., 'user1id_user2id'
  message: { type: String, required: true },
  sender: { type: String, required: true },  // Username
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);