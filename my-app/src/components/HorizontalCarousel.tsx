import React, { useState, useEffect } from 'react';
import '../styles/HorizontalCarousel.css';

// Import the new user images
// Handling spaces in the filenames seamlessly
import image1 from '../assets/images/Indian temple.jpg';
import image2 from '../assets/images/indian temple 2.jpg';

// Duplicating slightly to allow an endless carousel feel if there are only 2 source images.
const carouselData = [
  {
    id: 1,
    image: image1,
    title: "Yanai Malai Hill - 15.8 km",
    description: "The hill hosts Jain sculptures, a Shaivite temple and a Vaishnavite shrine, exemplifying its rich cultural significance."
  },
  {
    id: 2,
    image: image2,
    title: "Thirumalai Nayakkar Mahal - 4.9 km",
    description: "A stunning 17th-century palace noted for its massive pillars and spectacular blend of Dravidian and Rajput architectural styles."
  },
  {
    id: 3,
    image: image1,
    title: "Meenakshi Amman Temple - 2.5 km",
    description: "The crown jewel of the city, featuring towering gopurams completely covered in vibrant, meticulously carved statues."
  },
  {
    id: 4,
    image: image2,
    title: "Alagar Koyil - 21.0 km",
    description: "A serene temple complex situated in the lush green foothills, dedicated to Lord Vishnu with stunning natural scenery."
  }
];

const HorizontalCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll logic
  useEffect(() => {
    const intervalTime = 5000; // 5 seconds for visual testing, change to 300000 for 5 minutes

    const timer = setInterval(() => {
      // If we are at the end (showing exactly the number of cards that fit, or near it), reset.
      // We know there are 4 items. If we slide 1 by 1:
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (carouselData.length - 1));
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="horizontal-carousel-section">
      <div className="section-header-center">
        <span className="section-label">ATTRACTIONS NEARBY</span>
        <h2>Explore The Heritage</h2>
      </div>

      <div className="horizontal-carousel-wrapper">
        <div 
          className="horizontal-carousel-container" 
          /* We slide horizontally by 33.33% roughly + gap per index so it smoothly scrolls cards */
          style={{ transform: `translateX(calc(-${currentIndex * 35}%))` }}
        >
          {carouselData.map((item) => (
            <div key={item.id} className="carousel-slide">
               {/* 1. Full size image filling the card */}
               <img src={item.image} alt={item.title} className="slide-image" />
               
               {/* 2. Content overlay that appears on hover */}
               <div className="slide-content-overlay">
                 <h3>{item.title}</h3>
                 <p>{item.description}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HorizontalCarousel;
