import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">💖 FunFling</Link>
      <button className="hamburger" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? '✖' : '☰'}
      </button>
      <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
        <li>
          <Link to={user ? '/dashboard' : '/'} onClick={() => setIsMobileMenuOpen(false)}>
            🏠 {user ? 'Dashboard' : 'Home'}
          </Link>
        </li>
        <li>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
            ℹ️ About
          </Link>
        </li>
        <li>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
            📞 Contact
          </Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                😊 Profile
              </Link>
            </li>
            <li>
              <Link to="/chats" onClick={() => setIsMobileMenuOpen(false)}>
                💬 Chats
              </Link>
            </li>
            <li>
              <Link to="/payment" onClick={() => setIsMobileMenuOpen(false)}>
                💎 Premium
              </Link>
            </li>
            {user.role === 'admin' && (
              <li>
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                  ⚙️ Admin
                </Link>
              </li>
            )}
            <li>
              <button onClick={handleLogout} className="logout-btn">
                🚪 Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                🔑 Login
              </Link>
            </li>
            <li>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                ✍️ Signup
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;