import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (user) return null; // Prevent rendering while redirecting

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>💖 Welcome to FunFling</h1>
        <p>Find your match, chat, and start your adventure!</p>
        <div className="hero-cta">
          <Link to="/signup" className="cta-btn primary">Join Now ✍️</Link>
          <Link to="/login" className="cta-btn secondary">Login 🔑</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why FunFling? 🌟</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔒 Secure Chats</h3>
            <p>Chat safely with our encrypted messaging.</p>
          </div>
          <div className="feature-card">
            <h3>👥 Verified Profiles</h3>
            <p>Connect with real, verified users.</p>
          </div>
          <div className="feature-card">
            <h3>💎 Premium Benefits</h3>
            <p>Unlock exclusive features with Premium.</p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews">
        <h2>User Reviews 🗣️</h2>
        <div className="reviews-grid">
          <div className="review-card">
            <p>"FunFling is amazing! Met so many great people!"</p>
            <span>— Sarah, 27</span>
          </div>
          <div className="review-card">
            <p>"The best dating app I’ve used. Love the chats!"</p>
            <span>— John, 32</span>
          </div>
          <div className="review-card">
            <p>"Premium is worth every penny. Highly recommend!"</p>
            <span>— Emma, 25</span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Connect? 🚀</h2>
        <Link to="/signup" className="cta-btn primary">Start Now ✍️</Link>
      </section>
    </div>
  );
}

export default Home;