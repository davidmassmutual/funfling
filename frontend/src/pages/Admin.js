import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

function Admin() {
  const { user, api, adminLogin } = useAuth();
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [ladyProfiles, setLadyProfiles] = useState([]);
  const [error, setError] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [newLadyProfile, setNewLadyProfile] = useState({
    name: '',
    age: '',
    location: '',
    bio: '',
    images: [],
    interests: [],
    userId: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchData = async () => {
        try {
          const [usersRes, profilesRes, ladyProfilesRes] = await Promise.all([
            api.get('/auth/users'),
            api.get('/profiles'),
            api.get('/lady-profiles/ladies')
          ]);
          setUsers(usersRes.data);
          setProfiles(profilesRes.data);
          setLadyProfiles(ladyProfilesRes.data);
        } catch (err) {
          setError('Failed to load data.');
        }
      };
      fetchData();
    }
  }, [user, api]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminLogin(adminEmail, adminPassword);
    } catch (err) {
      setError('Invalid admin credentials.');
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Delete?')) return;
    try {
      await api.delete(type === 'user' ? `/auth/users/${id}` : type === 'profile' ? `/profiles/${id}` : `/lady-profiles/${id}`);
      if (type === 'user') setUsers(users.filter(u => u._id !== id));
      if (type === 'profile') setProfiles(profiles.filter(p => p._id !== id));
      if (type === 'lady-profile') setLadyProfiles(ladyProfiles.filter(p => p._id !== id));
    } catch (err) {
      setError('Delete failed.');
    }
  };

  const handleAddLadyProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/lady-profiles', {
        ...newLadyProfile,
        images: newLadyProfile.images.split(',').map(img => img.trim()),
        interests: newLadyProfile.interests.split(',').map(i => i.trim())
      });
      setLadyProfiles([...ladyProfiles, res.data]);
      setNewLadyProfile({ name: '', age: '', location: '', bio: '', images: [], interests: [], userId: '' });
    } catch (err) {
      setError('Failed to add profile.');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-container">
        <h2>Admin Login 🔧</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleAdminLogin} className="admin-login-form">
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder="Admin Email"
            required
            className="input-field"
          />
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Admin Password"
            required
            className="input-field"
          />
          <button type="submit" className="submit-btn">Login as Admin</button>
        </form>
        <button onClick={() => navigate('/')} className="back-btn">Back to Home 🏠</button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>Admin Panel 🔧</h2>
      {error && <p className="error">{error}</p>}
      <section>
        <h3>Add Lady Profile 👩</h3>
        <form onSubmit={handleAddLadyProfile} className="admin-form">
          <input
            type="text"
            value={newLadyProfile.name}
            onChange={(e) => setNewLadyProfile({ ...newLadyProfile, name: e.target.value })}
            placeholder="Name"
            required
            className="input-field"
          />
          <input
            type="number"
            value={newLadyProfile.age}
            onChange={(e) => setNewLadyProfile({ ...newLadyProfile, age: e.target.value })}
            placeholder="Age"
            required
            className="input-field"
          />
          <input
            type="text"
            value={newLadyProfile.location}
            onChange={(e) => setNewLadyProfile({ ...newLadyProfile, location: e.target.value })}
            placeholder="Location"
            required
            className="input-field"
          />
          <textarea
            value={newLadyProfile.bio}
            onChange={(e) => setNewLadyProfile({ ...newLadyProfile, bio: e.target.value })}
            placeholder="Bio"
            required
            className="input-field"
          />
          <input
            type="text"
            value={newLadyProfile.images}
            onChange={(e) => setNewLadyProfile({ ...newLadyProfile, images: e.target.value })}
            placeholder="Image URLs (comma-separated)"
            className="input-field"
          />
          <input
            type="text"
            value={newLadyProfile.interests}
            onChange={(e) => setNewLadyProfile({ ...newLadyProfile, interests: e.target.value })}
            placeholder="Interests (comma-separated)"
            className="input-field"
          />
          <input
            type="text"
            value={newLadyProfile.userId}
            onChange={(e) => setNewLadyProfile({ ...newLadyProfile, userId: e.target.value })}
            placeholder="Smartsupp User ID (e.g., lady1)"
            required
            className="input-field"
          />
          <button type="submit" className="submit-btn">Add Profile</button>
        </form>
      </section>
      <section>
        <h3>Users 👥</h3>
        <table className="admin-table">
          <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td><button onClick={() => handleDelete(u._id, 'user')} className="delete-btn">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3>User Profiles 📄</h3>
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Age</th><th>Location</th><th>Actions</th></tr></thead>
          <tbody>
            {profiles.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.location}</td>
                <td><button onClick={() => handleDelete(p._id, 'profile')} className="delete-btn">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3>Lady Profiles 👩</h3>
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Age</th><th>Location</th><th>User ID</th><th>Actions</th></tr></thead>
          <tbody>
            {ladyProfiles.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.location}</td>
                <td>{p.userId}</td>
                <td><button onClick={() => handleDelete(p._id, 'lady-profile')} className="delete-btn">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <button onClick={() => navigate('/dashboard')} className="back-btn">Back to Dashboard 👩</button>
    </div>
  );
}

export default Admin;