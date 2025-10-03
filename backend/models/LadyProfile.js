const mongoose = require('mongoose');

const ladyProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  location: { type: String, required: true },
  bio: { type: String, required: true },
  images: [{ type: String }],
  interests: [{ type: String }],
  userId: { type: String, required: true }, // Unique ID for Smartsupp integration
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LadyProfile', ladyProfileSchema);