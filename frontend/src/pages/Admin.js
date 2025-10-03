import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

function Admin() {
  const { user, api, adminLogin } = useAuth();
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchData = async () => {
        try {
          const [usersRes, profilesRes] = await Promise.all([
            api.get('/auth/users'),
            api.get('/profiles')
          ]);
          setUsers(usersRes.data);
          setProfiles(profilesRes.data);
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
      // No navigation needed; useEffect will trigger data fetch on user change
    } catch (err) {
      setError('Invalid admin credentials.');
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Delete?')) return;
    try {
      await api.delete(type === 'user' ? `/auth/users/${id}` : `/profiles/${id}`);
      setUsers(users.filter(u => u._id !== id));
      setProfiles(profiles.filter(p => p._id !== id));
    } catch (err) {
      setError('Delete failed.');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-container">
        <h2>Admin Login</h2>
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
        <button onClick={() => navigate('/')} className="back-btn">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      {error && <p className="error">{error}</p>}
      <section>
        <h3>Users</h3>
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
        <h3>Profiles</h3>
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
      <button onClick={() => navigate('/')} className="back-btn">Back to Home</button>
    </div>
  );
}

export default Admin;