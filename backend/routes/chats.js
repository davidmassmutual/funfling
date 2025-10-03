const express = require('express');
const Message = require('../models/Message');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get chat history for a room (protected)
router.get('/:otherUserId', auth, async (req, res) => {
  try {
    const roomId = [req.user.id, req.params.otherUserId].sort().join('_');
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;