import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home.css';
import HorizontalCarousel from '../../components/HorizontalCarousel';
import heroBg from '../../assets/images/download (2).jpg';

// 1. Define your online image URLs here
const images = {
  hero: heroBg,
  story: "https://images.unsplash.com/photo-1449156001934-0691b582863a?auto=format&fit=crop&w=800&q=80",
  location: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
};

const Home: React.FC = () => {
  return (
    <div className="home-container">
      
      {/* HERO SECTION */}
      <header 
        className="hero-section" 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${images.hero}')` }}
      >
        <div className="hero-content">
          <span className="hero-subtitle">WELCOME TO THE WILDERNESS</span>
          <h1>Find your peace<br/>at The Lodge</h1>
          <p>Unwind in luxury cabins surrounded by pristine nature.</p>
          <div className="hero-buttons">
            <Link to="/book" className="btn-primary">Book Your Stay</Link>
            <Link to="/about" className="btn-outline">Explore Lodge</Link>
          </div>
        </div>
      </header>

      {/* OUR STORY (Split Section) */}
      <section className="split-section">
        <div 
          className="split-image" 
          style={{ backgroundImage: `url('${images.story}')` }}
        ></div>
        <div className="split-content">
          <span className="section-label">OUR STORY</span>
          <h2>A Legacy of Comfort and Nature</h2>
          <p>Established in 1985, The Lodge has been a sanctuary for those seeking to reconnect with nature without compromising on luxury.</p>
          <button className="btn-dark">Read More</button>
        </div>
      </section>

      {/* LOCATION (Split Section - Image on Right) */}
      <section className="split-section reverse">
        <div className="split-content">
          <span className="section-label">HOW TO REACH US</span>
          <h2>Hidden in the Peaks</h2>
          <p>Located just 45 minutes from the central valley, accessible via the scenic Mountain Ridge Route.</p>
          <button className="btn-dark">Get Directions</button>
        </div>
        <div 
          className="split-image" 
          style={{ backgroundImage: `url('${images.location}')` }}
        ></div>
      </section>
      
      {/* HORIZONTAL CAROUSEL SECTION */}
      <HorizontalCarousel />
      
    </div>
  );
};

export default Home;