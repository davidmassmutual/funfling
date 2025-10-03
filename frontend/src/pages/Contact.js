import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Contact.css';

function Contact() {
  const navigate = useNavigate();

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <p>Have questions? Chat with our admin team directly!</p>
      <p>The chat widget will appear below. We're here to help with FunFling.</p>
      <div id="smartsupp-widget-container"></div>
      <button onClick={() => navigate('/')} className="back-btn">Back to Home</button>
    </div>
  );
}

export default Contact;