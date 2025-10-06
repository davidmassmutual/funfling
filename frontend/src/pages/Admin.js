import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

function Admin() {
  const { user, api, adminLogin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [ladyProfiles, setLadyProfiles] = useState([]);
  const [error, setError] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [newLadyProfile, setNewLadyProfile] = useState({
    name: '',
    age: '',
    location: '',
    bio: '',
    images: '',
    interests: '',
    userId: ''
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchData = async () => {
        try {
          const [usersRes, ladyProfilesRes] = await Promise.all([
            api.get('/auth/users'),
            api.get('/lady-profiles')
          ]);
          setUsers(usersRes.data);
          setLadyProfiles(ladyProfilesRes.data);
        } catch (err) {
          setError('Failed to load data: ' + err.message);
        }
      };
      fetchData();
    }
  }, [user, api]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      await adminLogin(adminEmail, adminPassword);
    } catch (err) {
      setError('Invalid admin credentials: ' + err.message);
    }
  };

  const handleAddLadyProfile = async (e) => {
    e.preventDefault();
    try {
      const profileData = {
        ...newLadyProfile,
        age: parseInt(newLadyProfile.age) || 0,
        images: newLadyProfile.images ? newLadyProfile.images.split(',').map(img => img.trim()) : [],
        interests: newLadyProfile.interests ? newLadyProfile.interests.split(',').map(i => i.trim()) : []
      };
      const res = await api.post('/lady-profiles', profileData);
      setLadyProfiles([...ladyProfiles, res.data]);
      setNewLadyProfile({ name: '', age: '', location: '', bio: '', images: '', interests: '', userId: '' });
      setError('');
    } catch (err) {
      console.error('Add profile error:', err.response?.data || err.message);
      setError(`Failed to add profile: ${err.response?.data?.msg || err.message}`);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Delete ${type}?`)) return;
    try {
      await api.delete(`/${type === 'user' ? 'auth/users' : 'lady-profiles'}/${id}`);
      if (type === 'user') setUsers(users.filter(u => u._id !== id));
      if (type === 'lady-profile') setLadyProfiles(ladyProfiles.filter(p => p._id !== id));
    } catch (err) {
      setError(`Failed to delete ${type}: ${err.message}`);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-container">
        <h2>Admin Login 🔐</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleAdminLogin} className="admin-form">
          <input
            type="email"
            value={adminEmail}
            onChange={e => setAdminEmail(e.target.value)}
            placeholder="Admin Email"
            required
          />
          <input
            type="password"
            value={adminPassword}
            onChange={e => setAdminPassword(e.target.value)}
            placeholder="Admin Password"
            required
          />
          <button type="submit" className="admin-btn">Login</button>
        </form>
        <button onClick={() => navigate('/')} className="back-btn">Back to Home 🏠</button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>Admin Panel ⚙️</h2>
      {error && <p className="error">{error}</p>}
      <section>
        <h3>Add Lady Profile 👩</h3>
        <form onSubmit={handleAddLadyProfile} className="admin-form">
          <input
            type="text"
            value={newLadyProfile.name}
            onChange={e => setNewLadyProfile({ ...newLadyProfile, name: e.target.value })}
            placeholder="Name"
            required
          />
          <input
            type="number"
            value={newLadyProfile.age}
            onChange={e => setNewLadyProfile({ ...newLadyProfile, age: e.target.value })}
            placeholder="Age"
            required
          />
          <input
            type="text"
            value={newLadyProfile.location}
            onChange={e => setNewLadyProfile({ ...newLadyProfile, location: e.target.value })}
            placeholder="Location"
            required
          />
          <textarea
            value={newLadyProfile.bio}
            onChange={e => setNewLadyProfile({ ...newLadyProfile, bio: e.target.value })}
            placeholder="Bio"
            required
          />
          <input
            type="text"
            value={newLadyProfile.images}
            onChange={e => setNewLadyProfile({ ...newLadyProfile, images: e.target.value })}
            placeholder="Image URLs (comma-separated)"
          />
          <input
            type="text"
            value={newLadyProfile.interests}
            onChange={e => setNewLadyProfile({ ...newLadyProfile, interests: e.target.value })}
            placeholder="Interests (comma-separated)"
          />
          <input
            type="text"
            value={newLadyProfile.userId}
            onChange={e => setNewLadyProfile({ ...newLadyProfile, userId: e.target.value })}
            placeholder="Smartsupp User ID (e.g., lady1)"
            required
          />
          <button type="submit" className="admin-btn">Add Lady Profile</button>
        </form>
      </section>
      <section>
        <h3>Users 👥</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => handleDelete(u._id, 'user')} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3>Lady Profiles 👩</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Location</th>
              <th>User ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ladyProfiles.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.location}</td>
                <td>{p.userId}</td>
                <td>
                  <button onClick={() => handleDelete(p._id, 'lady-profile')} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <button onClick={() => navigate('/')} className="back-btn">Back to Home 🏠</button>
    </div>
  );
}

export default Admin;