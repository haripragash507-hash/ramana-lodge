import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home.css';

// REMOVE the import heroBg line completely!

const Home: React.FC = () => {
  return (
    <div className="home-container">
      
      {/* Update the background image URL to just point directly to the file name.
        Because it is in the public folder, React automatically knows to look for it at the root "/"
      */}
      <header 
        className="hero-section" 
        style={{ backgroundImage: `url('/hero-image.avif')` }}
      >
        <h1>Grand Comfort at Renga Inn</h1>
        <p>Your comfortable and affordable stay right in the heart of the temple city.</p>
        <Link to="/book">
          <button className="hero-btn">Book A Stay</button>
        </Link>
      </header>

      {/* About Hotel */}
      <section className="info-section">
        <h2>About Our Hotel</h2>
        <p>
          At Renga Inn, we provide clean, well-maintained A/C and Non-A/C rooms perfect for families, 
          solo travelers, and pilgrims. We offer 24/7 hot water, high-speed Wi-Fi, and secure car parking.
        </p>
      </section>

      {/* Area Specials */}
      <section className="area-section">
        <h2>Explore the Area</h2>
        <ul>
          <li><strong>Proximity to Temples:</strong> Just a 5-minute walk to the main historic temples.</li>
          <li><strong>Local Food:</strong> Surrounded by authentic South Indian vegetarian restaurants.</li>
          <li><strong>Transport:</strong> Easy access to the railway station and main bus stands.</li>
        </ul>
      </section>
      
    </div>
  );
};

export default Home;