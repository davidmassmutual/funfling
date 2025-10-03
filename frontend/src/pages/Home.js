import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect signed-in users to dashboard
  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>💖 Welcome to FunFling</h1>
        <p>Connect with exciting people and spark new adventures!</p>
        <div className="hero-cta">
          <Link to="/signup" className="cta-btn primary">Join Now ✍️</Link>
          <Link to="/login" className="cta-btn secondary">Login 🔐</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose FunFling? 🌟</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>😊 Safe & Fun</h3>
            <p>Connect securely with verified profiles.</p>
          </div>
          <div className="feature">
            <h3>💬 Instant Chats</h3>
            <p>Start chatting in real-time with ease.</p>
          </div>
          <div className="feature">
            <h3>🎉 Premium Perks</h3>
            <p>Unlock exclusive features with Premium.</p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews">
        <h2>What Our Users Say 🗣️</h2>
        <div className="reviews-grid">
          <div className="review">
            <p>"FunFling made meeting new people so easy! Highly recommend!"</p>
            <span>— Sarah, 28</span>
          </div>
          <div className="review">
            <p>"The chat feature is amazing, and I love the community vibe."</p>
            <span>— Mike, 34</span>
          </div>
          <div className="review">
            <p>"Premium is worth it for the extra features. Great experience!"</p>
            <span>— Emma, 25</span>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="cta-footer">
        <h2>Ready to Start? 🚀</h2>
        <Link to="/signup" className="cta-btn primary">Get Started Now ✍️</Link>
      </section>
    </div>
  );
}

export default Home;