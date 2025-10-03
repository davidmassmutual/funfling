const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const LadyProfile = require('../models/LadyProfile');
const router = express.Router();

// Get all lady profiles (public)
router.get('/ladies', async (req, res) => {
  try {
    const profiles = await LadyProfile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create a lady profile (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { name, age, location, bio, images, interests, userId } = req.body;
    const profile = new LadyProfile({ name, age, location, bio, images, interests, userId });
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a lady profile (admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { name, age, location, bio, images, interests, userId } = req.body;
    const profile = await LadyProfile.findByIdAndUpdate(
      req.params.id,
      { name, age, location, bio, images, interests, userId },
      { new: true }
    );
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a lady profile (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const profile = await LadyProfile.findByIdAndDelete(req.params.id);
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });
    res.json({ msg: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;