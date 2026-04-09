import React, { useState } from 'react';
import '../../styles/Booking.css';

const Booking: React.FC = () => {
  const [roomType, setRoomType] = useState('Deluxe');
  const [dates, setDates] = useState('');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Redirecting to payment gateway for ${roomType} room on ${dates}...`);
  };

  return (
    <div className="booking-container">
      <h2>Book Your Stay at Renga Inn</h2>
      
      <form onSubmit={handlePayment} className="booking-form">
        <label>
          Select Date:
          <input 
            type="date" 
            required 
            value={dates} 
            onChange={(e) => setDates(e.target.value)} 
            className="form-input"
          />
        </label>

        <label>
          Room Type:
          <select 
            value={roomType} 
            onChange={(e) => setRoomType(e.target.value)}
            className="form-input"
          >
            <option value="Deluxe">Deluxe Room - ₹1,500</option>
            <option value="Super Deluxe">Super Deluxe A/C - ₹2,000</option>
            <option value="Suite">Suite Room - ₹3,500</option>
          </select>
        </label>

        <button type="submit" className="pay-btn">
          Pay Online Now
        </button>
      </form>
    </div>
  );
};

export default Booking;