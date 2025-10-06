const express = require('express');
const router = express.Router();
const LadyProfile = require('../models/LadyProfile');
const { auth, adminAuth } = require('../middleware/auth');

// Get all lady profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await LadyProfile.find();
    res.json(profiles);
  } catch (err) {
    console.error('Get lady profiles error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create lady profile (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { name, age, location, bio, images, interests, userId } = req.body;

    // Validate required fields
    if (!name || !age || !location || !bio || !userId) {
      return res.status(400).json({ msg: 'Missing required fields: name, age, location, bio, userId' });
    }

    // Validate age
    if (isNaN(age) || age < 18 || age > 100) {
      return res.status(400).json({ msg: 'Invalid age: must be between 18 and 100' });
    }

    // Check for duplicate userId
    const existingProfile = await LadyProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ msg: `User ID '${userId}' is already in use` });
    }

    const profile = new LadyProfile({
      name,
      age,
      location,
      bio,
      images: images || [],
      interests: interests || [],
      userId
    });
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error('Create lady profile error:', err);
    res.status(500).json({ msg: err.message || 'Server error' });
  }
});

// Update lady profile (admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { name, age, location, bio, images, interests, userId } = req.body;

    // Check for duplicate userId (excluding current profile)
    if (userId) {
      const existingProfile = await LadyProfile.findOne({ userId, _id: { $ne: req.params.id } });
      if (existingProfile) {
        return res.status(400).json({ msg: `User ID '${userId}' is already in use` });
      }
    }

    const profile = await LadyProfile.findByIdAndUpdate(
      req.params.id,
      { name, age, location, bio, images, interests, userId },
      { new: true }
    );
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error('Update lady profile error:', err);
    res.status(500).json({ msg: err.message || 'Server error' });
  }
});

// Delete lady profile (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const profile = await LadyProfile.findByIdAndDelete(req.params.id);
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });
    res.json({ msg: 'Profile deleted' });
  } catch (err) {
    console.error('Delete lady profile error:', err);
    res.status(500).json({ msg: err.message || 'Server error' });
  }
});

module.exports = router;