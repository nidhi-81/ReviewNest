import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getToken } from '../utils/auth';
import {jwtDecode} from 'jwt-decode';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  let userName = '';
  if (isAuthenticated()) {
    try {
      const token = getToken();
      const decoded = jwtDecode(token);
      userName = decoded.name || '';
    } catch (err) {
      console.error('Invalid token:', err);
    }
  }

  return (
    <nav className="navbar">
        
  <div className="navbar-brand" onClick={() => navigate('/')}>
  <img src="../books.png" alt="logo" className="logo-icon" />
  ReviewNest
</div>


  <div className="navbar-right">
    {isAuthenticated() && <span className="welcome-text">Welcome, {userName} 👋</span>}
    {isAuthenticated() ? (
      <>
        <Link to="/add-book">Add Book</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </>
    ) : (
      <Link to="/login">Login</Link>
    )}
  </div>
</nav>

  );
}
