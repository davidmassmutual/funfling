const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Admin-only middleware
const adminAuth = (req, res, next) => {
  auth(req, res, async () => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ msg: 'Admin access denied' });
      }
      req.user = user;
      next();
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });
};

module.exports = { auth, adminAuth };