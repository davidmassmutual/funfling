import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

function Profile() {
  const { user, api } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    location: '',
    bio: '',
    images: [],
    interests: []
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profiles/me');
        setProfile(res.data || profile);  // Default empty if none
      } catch (err) {
        setError('Failed to load profile.');
      }
    };
    if (user) fetchProfile();
  }, [user, api]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.put('/profiles/me', profile);  // Assume backend supports PUT /profiles/me
      alert('Profile updated!');
    } catch (err) {
      setError('Update failed.');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="profile-form">
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="input-field"
        />
        <input
          type="number"
          name="age"
          value={profile.age}
          onChange={handleChange}
          placeholder="Age"
          required
          className="input-field"
        />
        <input
          type="text"
          name="location"
          value={profile.location}
          onChange={handleChange}
          placeholder="Location (e.g., NYC)"
          required
          className="input-field"
        />
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          placeholder="Bio: Tell us about yourself..."
          required
          className="input-field"
          rows="4"
        />
        <input
          type="text"
          name="interests"
          value={profile.interests.join(', ')}
          onChange={(e) => setProfile({ ...profile, interests: e.target.value.split(', ') })}
          placeholder="Interests (comma-separated)"
          className="input-field"
        />
        <p>Images: Upload URLs (comma-separated)</p>
        <input
          type="text"
          name="images"
          value={profile.images.join(', ')}
          onChange={(e) => setProfile({ ...profile, images: e.target.value.split(', ') })}
          placeholder="Image URLs"
          className="input-field"
        />
        <button type="submit" className="submit-btn">Update Profile</button>
      </form>
      <button onClick={() => navigate('/')} className="back-btn">Back to Dashboard</button>
    </div>
  );
}

export default Profile;