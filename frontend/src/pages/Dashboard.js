import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const { user, api } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLadyProfiles = async () => {
      try {
        console.log('Fetching lady profiles...');
        const res = await api.get('/lady-profiles');
        console.log('Lady profiles response:', res.data);
        setProfiles(res.data);
        if (res.data.length === 0) {
          setError('No profiles available yet.');
        }
      } catch (err) {
        console.error('Fetch profiles error:', err.response?.data || err.message);
        setError('Failed to load profiles: ' + (err.response?.data?.msg || err.message));
      }
    };
    if (user) fetchLadyProfiles();
  }, [user, api]);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.username}! 👩</h2>
      {error && <p className="error">{error}</p>}
      <h3>Meet Our Ladies 🌟</h3>
      <div className="profiles-grid">
        {profiles.map(profile => (
          <div key={profile._id} className="profile-card">
            <img
              src={profile.images[0] || 'https://via.placeholder.com/200?text=Profile'}
              alt={profile.name}
              className="profile-img"
            />
            <h4>{profile.name}, {profile.age}</h4>
            <p className="bio">{profile.bio.substring(0, 100)}...</p>
            <p className="location">📍 {profile.location}</p>
            <div className="interests">
              {profile.interests.map(interest => (
                <span key={interest} className="interest-tag">{interest}</span>
              ))}
            </div>
            <button
              onClick={() => navigate(`/chats?receiver=${profile.userId}`)}
              className="chat-btn"
            >
              💬 Chat Now
            </button>
          </div>
        ))}
      </div>
      {profiles.length === 0 && !error && <p>Loading profiles...</p>}
    </div>
  );
}

export default Dashboard;