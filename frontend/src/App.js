import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Chats from './pages/Chats';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/about" element={<About />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;