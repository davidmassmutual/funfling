import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

function Admin() {
  const { user, api } = useAuth();
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        const [usersRes, profilesRes] = await Promise.all([
          api.get('/auth/users'),  // Assume backend GET /api/auth/users (add route)
          api.get('/profiles')
        ]);
        setUsers(usersRes.data);
        setProfiles(profilesRes.data);
      } catch (err) {
        setError('Failed to load data.');
      }
    };
    fetchData();
  }, [user, api, navigate]);

  const handleDelete = async (id, type) => {
    if (!window.confirm('Delete?')) return;
    try {
      await api.delete(type === 'user' ? `/auth/users/${id}` : `/profiles/${id}`);
      // Refresh data
      setUsers(users.filter(u => u._id !== id));
      setProfiles(profiles.filter(p => p._id !== id));
    } catch (err) {
      setError('Delete failed.');
    }
  };

  if (!user) return <div>Loading...</div>;

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
      <button onClick={() => navigate('/dashboard')} className="back-btn">Back</button>
    </div>
  );
}

export default Admin;