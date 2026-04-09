import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <h2>Renga Inn</h2>
      
      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/rooms" className="nav-item">Rooms</Link>
        <Link to="/offers" className="nav-item">Offers</Link>
        
        {/* New Login Button */}
        <Link to="/login" className="login-btn-nav">Login</Link>
        
        {/* Primary Action Button */}
        <Link to="/book" className="book-now-btn">Book Rooms Now</Link>
      </div>
    </nav>
  );
};

export default Navbar;