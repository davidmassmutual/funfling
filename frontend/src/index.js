import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Load Smartsupp script
if (!window.smartsupp) {
  var _smartsupp = window._smartsupp || {};
  _smartsupp.key = '57e6b64be0a10b49d1313a32c39f8ebb7fbafb15';
  window.smartsupp = window.smartsupp || function () {
    window.smartsupp._.push(arguments);
  };
  window.smartsupp._ = [];
  var s = document.getElementsByTagName('script')[0];
  var c = document.createElement('script');
  c.type = 'text/javascript';
  c.charset = 'utf-8';
  c.async = true;
  c.src = 'https://www.smartsuppchat.com/loader.js?';
  s.parentNode.insertBefore(c, s);
}

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);