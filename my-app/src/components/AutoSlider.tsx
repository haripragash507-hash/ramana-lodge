import React, { useState, useEffect } from 'react';

import { AutoSliderProps } from '../interfaces';

const AutoSlider: React.FC<AutoSliderProps> = ({ images }) => {
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, 2500); // Slides every 2.5 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
      <div 
        style={{ 
          display: 'flex', 
          height: '100%', 
          width: '100%',
          transform: `translateX(-${index * 100}%)`, 
          transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' 
        }}
      >
        {images.map((img, i) => (
          <img key={i} src={img} alt="room slide" style={{ minWidth: '100%', height: '100%', objectFit: 'cover' }} />
        ))}
      </div>
    </div>
  );
};

export default AutoSlider;
