const express = require('express');
const Profile = require('../models/Profile');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get all profiles (for dashboard)
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', 'username');
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create profile (protected)
router.post('/', auth, async (req, res) => {
  try {
    const profile = new Profile({ ...req.body, user: req.user.id });
    await profile.save();
    await profile.populate('user', 'username');
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get own profile
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'username');
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update own profile
router.put('/me', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new Profile({ ...req.body, user: req.user.id });
    } else {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { ...req.body },
        { new: true, runValidators: true }
      );
    }
    await profile.populate('user', 'username');
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete profile (admin or owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });

    // Allow owner or admin
    if (profile.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await Profile.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;