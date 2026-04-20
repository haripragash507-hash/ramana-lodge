import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>Renga Inn</h2>
      </div>
      
      <div className="nav-links-center">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/about" className="nav-item">About Us</Link>
        <Link to="/location" className="nav-item">Location</Link>
        <Link to="/gallery" className="nav-item">Gallery</Link>
        <Link to="/offers" className="nav-item">Offers</Link>
      </div>

      <div className="nav-actions">
        <Link to="/login" className="login-link">Login</Link>
        <Link to="/book" className="book-now-btn">Book Now</Link>
      </div>
    </nav>
  );
};

export default Navbar;