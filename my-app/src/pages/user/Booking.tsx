import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../styles/Booking.css';
import { RoomContext } from '../../context/RoomContext';
import { OfferContext } from '../../context/OfferContext';
import { BookingHistoryContext } from '../../context/BookingHistoryContext';
import AutoSlider from '../../components/AutoSlider';

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const roomContext = useContext(RoomContext);
  const availableRooms = roomContext ? roomContext.rooms : [];
  const offerContext = useContext(OfferContext);
  const offers = offerContext ? offerContext.offers : [];

  const bookingHistoryContext = useContext(BookingHistoryContext);
  const bookings = bookingHistoryContext ? bookingHistoryContext.bookings : [];

  const currentUser = JSON.parse(sessionStorage.getItem('current_user') || 'null');
  const userBookings = currentUser ? bookings.filter((b: any) => b.userEmail === currentUser.email) : [];

  useEffect(() => {
    if (!currentUser) {
      alert("Please login to proceed with booking.");
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'rooms';

  const [selectedRoom, setSelectedRoom] = useState<any | null>(() => {
    const saved = sessionStorage.getItem('user_selected_room');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (selectedRoom) {
      sessionStorage.setItem('user_selected_room', JSON.stringify(selectedRoom));
    } else {
      sessionStorage.removeItem('user_selected_room');
    }
  }, [selectedRoom]);

  const [showOffersModal, setShowOffersModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('user_booking_form');
    return saved ? JSON.parse(saved) : {
      fullName: '',
      phone: '',
      aadhar: '',
      guests: 1,
      checkIn: '',
      checkOut: ''
    };
  });

  useEffect(() => {
    sessionStorage.setItem('user_booking_form', JSON.stringify(formData));
  }, [formData]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = () => {
    if (!formData.fullName || !formData.phone || !formData.checkIn || !formData.checkOut) {
      setValidationError("Please fill in all required fields (Name, Phone, Check-in, Check-out).");
      return;
    }

    navigate('/payment', {
      state: {
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        guestName: formData.fullName,
        phone: formData.phone,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        totalPrice: selectedRoom.price,
        aadhar: formData.aadhar
      }
    });
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="user-dashboard-container">

      {/* --- DARK SIDEBAR --- */}
      <aside className="dashboard-sidebar dark-theme">
        <div className="sidebar-brand">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="brand-logo-icon">
            <path d="M12 3L4 15h5v6h6v-6h5L12 3z" />
          </svg>
          <h2>The Lodge</h2>
        </div>

        <div className="user-profile">
          <p className="logged-in-text">LOGGED IN AS</p>
          <p className="user-name" style={{ fontSize: '12px', wordBreak: 'break-all' }}>{currentUser?.email || 'Guest User'}</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item-btn ${activeTab === 'rooms' && !selectedRoom ? 'active' : ''}`}
            onClick={() => { setSelectedRoom(null); setSearchParams({ tab: 'rooms' }); }}
          >
            <span className="icon-wrapper">&#8962;</span> Available Rooms
          </button>
          <button
            className={`nav-item-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => { setSelectedRoom(null); setSearchParams({ tab: 'history' }); }}
          >
            <span className="icon-wrapper">&#128197;</span> My Bookings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => navigate('/')} className="back-website-btn">&larr; Back to Website</button>
          <button onClick={handleLogout} className="logout-text-btn">&#10162; Sign out</button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="dashboard-main">

        {/* OFFERS MODAL POPUP */}
        {showOffersModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 9999
          }}>
            <div style={{
              background: 'white', padding: '40px', borderRadius: '12px',
              width: '90%', maxWidth: '600px', position: 'relative'
            }}>
              <button
                onClick={() => setShowOffersModal(false)}
                style={{
                  position: 'absolute', top: '16px', right: '16px', border: 'none',
                  background: 'none', fontSize: '24px', cursor: 'pointer', color: '#666'
                }}
              >
                &times;
              </button>
              <h2 style={{ fontFamily: 'Georgia, serif', color: '#111', marginTop: 0 }}>Special Offers</h2>

              {offers.length === 0 ? (
                <p style={{ color: '#888' }}>No active offers at the moment.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                  {offers.map((offer: any) => (
                    <div key={offer.id} style={{
                      display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                      border: '1px solid #eaeaea', borderRadius: '8px', background: '#fafafa'
                    }}>
                      <span style={{
                        background: '#10b981', color: 'white', padding: '4px 12px',
                        borderRadius: '20px', fontSize: '14px', fontWeight: 'bold'
                      }}>
                        {offer.badge}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '18px', color: '#222' }}>{offer.title}</h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VALIDATION MODAL POPUP */}
        {validationError && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 9999
          }}>
            <div style={{
              background: 'white', padding: '30px', borderRadius: '12px',
              width: '90%', maxWidth: '400px', position: 'relative', textAlign: 'center'
            }}>
              <h2 style={{ color: '#ef4444', marginTop: 0, fontSize: '20px' }}>Missing Information</h2>
              <p style={{ color: '#444', marginBottom: '24px' }}>{validationError}</p>
              <button
                onClick={() => setValidationError(null)}
                style={{
                  background: '#10b981', color: 'white', border: 'none', padding: '10px 24px',
                  borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                Okay
              </button>
            </div>
          </div>
        )}

        {/* Top Header Row */}
        <header className="dashboard-header">
          <div className="search-bar-container">
            <span className="search-icon">&#128269;</span>
            <input type="text" placeholder="Search..." className="search-input" />
          </div>
          <div className="header-actions">
            <button
              onClick={() => setShowOffersModal(true)}
              style={{
                background: '#ffbe76', color: '#8b4513', border: 'none', padding: '8px 16px',
                borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px', marginRight: '15px'
              }}
            >
              &#127873; Special Offers
            </button>
            <span className="notification-bell">&#128276;</span>
            <div className="header-profile-icon">G</div>
          </div>
        </header>

        {/* CONDITIONAL RENDERING: List View vs Form View vs History View */}
        {activeTab === 'history' ? (

          /* VIEW: MY BOOKINGS */
          <div className="view-rooms-list">
            <div className="page-title-area">
              <h1>My Bookings</h1>
              <p>View your past and upcoming reservations.</p>
            </div>

            <div className="rooms-grid">
              {userBookings.length === 0 ? (
                <div style={{ padding: '40px', background: 'white', borderRadius: '12px', border: '1px solid #eaeaea', textAlign: 'center' }}>
                  <h3 style={{ color: '#666' }}>No bookings found</h3>
                  <button onClick={() => setSearchParams({ tab: 'rooms' })} style={{ marginTop: '20px', padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Browse Rooms</button>
                </div>
              ) : (
                userBookings.map((booking: any) => (
                  <div key={booking.id} style={{ display: 'flex', flexDirection: 'column', padding: '24px', background: 'white', border: '1px solid #eaeaea', borderRadius: '12px', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '20px' }}>{booking.roomName}</h3>
                      <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: booking.status === 'Confirmed' ? '#ecfdf5' : '#fef2f2', color: booking.status === 'Confirmed' ? '#065f46' : '#991b1b' }}>
                        {booking.status}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Booking ID: <strong>{booking.id}</strong></p>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Guest: {booking.guestName}</p>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Dates: {booking.checkIn.replace('T', ' ')} &rarr; {booking.checkOut.replace('T', ' ')}</p>
                    <hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '10px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Total Paid: ₹{booking.totalPrice.toFixed(2)}</span>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>Booked on: {new Date(booking.dateBooked).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        ) : !selectedRoom ? (

          /* VIEW 1: AVAILABLE ROOMS LIST */
          <div className="view-rooms-list">
            <div className="page-title-area">
              <h1>Available Rooms</h1>
              <p>Select a room for your upcoming stay.</p>
            </div>

            <div className="accommodations-header">
              <h2>All Accommodations</h2>
              <button className="filter-btn">&#9881; Filter Options</button>
            </div>

            <div className="rooms-grid">
              {availableRooms.map((room) => (
                <div key={room.id} className="user-room-card">
                  <div className="room-image-wrapper">
                    <span className="room-badge">{room.badge}</span>
                    <AutoSlider images={room.imageUrls && room.imageUrls.length > 0 ? room.imageUrls : ['']} />
                  </div>

                  <div className="room-info">
                    <div className="room-info-top">
                      <h3>{room.name}</h3>
                      <div className="price-block">
                        <span className="price">₹{room.price}</span>
                        <span className="per-night">/ day</span>
                      </div>
                    </div>

                    <div className="room-perks">
                      <span className="guest-count">&#128101; Up to {room.capacity} guests</span>
                      {room.isFreeCancellation !== false ? (
                        <span className="free-cancel" style={{ color: '#10b981' }}>&#10003; Free cancellation</span>
                      ) : (
                        <span className="free-cancel" style={{ color: '#ef4444' }}>&#10007; Charged for cancellation</span>
                      )}
                    </div>

                    <p className="room-desc">{room.description}</p>

                    <button
                      className="book-this-room-btn"
                      onClick={() => setSelectedRoom(room)}
                    >
                      Book this room &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        ) : (

          /* VIEW 2: GUEST DETAILS & BOOKING FORM */
          <div className="view-booking-form">
            <button className="back-to-list-btn" onClick={() => setSelectedRoom(null)}>
              &larr; Back to Rooms
            </button>

            <div className="booking-split-layout">

              {/* LEFT SIDE: The Form */}
              <div className="guest-details-section">
                <form className="checkout-form">
                  <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', margin: '0 0 8px 0', fontWeight: 'normal', color: '#111' }}>Guest Details</h1>
                  <p style={{ color: '#666', margin: '0 0 32px 0', fontSize: '15px' }}>Please provide your details to confirm the booking.</p>
                  <div className="input-group full-width">
                    <label>&#128100; Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleFormChange} placeholder="Enter primary guest's full name" required />
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label>&#128222; Phone Number</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="10-digit mobile number" required />
                    </div>
                    <div className="input-group">
                      <label>&#128179; Aadhar Number</label>
                      <input type="text" name="aadhar" value={formData.aadhar} onChange={handleFormChange} placeholder="12-digit Aadhar number" />
                    </div>
                  </div>

                  <div className="input-group full-width">
                    <label>&#128101; Number of Persons</label>
                    <select name="guests" value={formData.guests} onChange={handleFormChange}>
                      <option value="">Select number of guests</option>
                      {Array.from({ length: selectedRoom.capacity }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label>&#128197; Check-in Date & Time</label>
                      <input type="datetime-local" name="checkIn" value={formData.checkIn} onChange={handleFormChange} required />
                    </div>
                    <div className="input-group">
                      <label>&#128197; Check-out Date & Time</label>
                      <input type="datetime-local" name="checkOut" value={formData.checkOut} onChange={handleFormChange} required />
                    </div>
                  </div>

                  <div className="payment-action-area">
                    <button type="button" className="proceed-payment-btn" onClick={handleProceedToPayment}>
                      Proceed to Payment &rarr;
                    </button>
                    <p className="no-charge-text">You won't be charged yet.</p>
                  </div>
                </form>
              </div>

              {/* RIGHT SIDE: The Summary Card */}
              <div className="booking-summary-section">
                <h2>Booking Summary</h2>
                <div className="summary-card">
                  <div className="summary-room-info">
                    <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                      <AutoSlider images={selectedRoom.imageUrls && selectedRoom.imageUrls.length > 0 ? selectedRoom.imageUrls : ['']} />
                    </div>
                    <div>
                      <h3>{selectedRoom.name}</h3>
                      <span className="summary-badge">{selectedRoom.badge}</span>
                    </div>
                  </div>

                  <div className="summary-line-items">
                    <div className="line-item">
                      <span>Price per day</span>
                      <span>₹{selectedRoom.price.toFixed(2)}</span>
                    </div>
                    <div className="line-item">
                      <span>Lodge Service Fee</span>
                      <span className="waived-text">Waived</span>
                    </div>
                  </div>

                  <div className="summary-total">
                    <span>Total (INR)</span>
                    <span>₹{selectedRoom.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Booking;