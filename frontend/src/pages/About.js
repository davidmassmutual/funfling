import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/About.css';

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <h2>About FunFling</h2>
      <p>FunFling is your go-to platform for exciting connections and casual fun. Discover profiles, chat securely, and unlock premium features with ease.</p>
      <ul>
        <li>Safe & discreet</li>
        <li>Real-time chats</li>
        <li>Verified profiles</li>
      </ul>
      <button onClick={() => navigate('/')} className="back-btn">Explore Now</button>
    </div>
  );
}

export default About;