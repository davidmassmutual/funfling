import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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

function AppContent() {
  const { user } = useAuth();
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={user ? <Profile /> : <Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/chats" element={user ? <Chats /> : <Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/payment" element={user ? <Payment /> : <Login />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

function App() {
  return <AuthProvider><AppContent /></AuthProvider>;
}

export default App;