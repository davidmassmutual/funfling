import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Contact.css';

function Contact() {
  const navigate = useNavigate();

  useEffect(() => {
    // Load SmartSupp script (replace with your widget ID from smartsupp.com)
    if (!window.smartsupp) {
      (function(d, s, id) {
        var js, sjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://www.smartsuppchat.com/loader.js?id=YOUR_SMARTSUPP_ID';
        sjs.parentNode.insertBefore(js, sjs);
      })(document, 'script', 'smartsupp-script');
    }
  }, []);

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <p>Have questions? Chat with our admin team directly!</p>
      <p>The chat widget will appear below. We're here to help with FunFling.</p>
      <div id="smartsupp-widget-container"></div>  {/* Widget auto-renders */}
      <button onClick={() => navigate('/')} className="back-btn">Back to Dashboard</button>
    </div>
  );
}

export default Contact;