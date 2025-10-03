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
    const fetchProfiles = async () => {
      try {
        const res = await api.get('/profiles');
        setProfiles(res.data);
      } catch (err) {
        setError('Failed to load profiles.');
      }
    };
    if (user) fetchProfiles();
  }, [user, api]);

  if (!user) return <div>Please log in to view dashboard.</div>;

  return (
    <div className="dashboard-container">
      <h2>Welcome to FunFling, {user.username}!</h2>
      {error && <p className="error">{error}</p>}
      <div className="profiles-grid">
        {profiles.map(profile => (
          <div key={profile._id} className="profile-card">
            <img src={profile.images[0] || 'https://via.placeholder.com/200?text=Profile'} alt={profile.name} className="profile-img" />
            <h3>{profile.name}, {profile.age}</h3>
            <p className="bio">{profile.bio.substring(0, 100)}...</p>
            <p className="location">📍 {profile.location}</p>
            <div className="interests">{profile.interests.map(i => <span key={i} className="interest-tag">{i}</span>)}</div>
            <button 
              onClick={() => navigate(`/chats?user=${profile.user._id}`)} 
              className="chat-btn"
            >
              Start Chat
            </button>
          </div>
        ))}
      </div>
      {profiles.length === 0 && <p>No profiles yet. Check back soon!</p>}
    </div>
  );
}

export default Dashboard;