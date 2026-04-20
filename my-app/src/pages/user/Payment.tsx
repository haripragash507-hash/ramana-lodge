import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookingHistoryContext } from '../../context/BookingHistoryContext';

import { PaymentState } from '../../interfaces';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingContext = useContext(BookingHistoryContext);
  const [state, setState] = useState<PaymentState | null>(() => {
    if (location.state) {
      sessionStorage.setItem('user_payment_state', JSON.stringify(location.state));
      return location.state as PaymentState;
    }
    const saved = sessionStorage.getItem('user_payment_state');
    return saved ? JSON.parse(saved) : null;
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'spot'>(() => {
    return (sessionStorage.getItem('user_payment_method') as any) || 'card';
  });

  React.useEffect(() => {
    sessionStorage.setItem('user_payment_method', paymentMethod);
  }, [paymentMethod]);

  const [isProcessing, setIsProcessing] = useState(false);

  // If someone manually goes to /payment without data, send them back
  if (!state || !state.roomId) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Inter, sans-serif' }}>
        <h2>Invalid Payment Session</h2>
        <button onClick={() => navigate('/book')} style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate real payment delay
    setTimeout(() => {
      if (bookingContext && state) {
        
        // Generate random Booking ID mock mapping for the SMS
        const tempId = `BK-${Math.floor(Math.random() * 1000000)}`;
        
        bookingContext.addBooking({
          roomId: state.roomId,
          roomName: state.roomName,
          guestName: state.guestName,
          phone: state.phone,
          checkIn: state.checkIn,
          checkOut: state.checkOut,
          totalPrice: state.totalPrice,
          status: 'Confirmed'
        });

        // Dispatch actual SMS via backend proxy
        fetch('http://localhost:5000/api/send-sms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            guestPhone: state.phone,
            guestName: state.guestName,
            roomName: state.roomName,
            bookingId: tempId
          })
        })
        .then(res => res.json())
        .then(data => {
          if(data.success) {
            alert('Booking successful! SMS notifications have been delivered.');
          } else {
            console.error('Twilio Error:', data.error);
            alert('Booking successful! However, SMS delivery failed: ' + data.error);
          }
        })
        .catch(err => {
          console.error(err);
          alert('Booking successful! (SMS backend is currently offline)');
        });
        
        // Push notification logic for Admin Dashboard
        const currentNotifications = JSON.parse(localStorage.getItem('lodge_admin_notifications') || '[]');
        currentNotifications.push({
          id: tempId,
          text: `New Booking: ${state.guestName} booked ${state.roomName} for ₹${state.totalPrice.toFixed(2)}`,
          time: new Date().toISOString()
        });
        localStorage.setItem('lodge_admin_notifications', JSON.stringify(currentNotifications));
      }
      setIsProcessing(false);
      // clean up session storage after successful payment
      sessionStorage.removeItem('user_payment_state');
      sessionStorage.removeItem('user_booking_form');
      sessionStorage.removeItem('user_selected_room');
      
      navigate('/book?tab=history'); // pass a query param or something to trigger viewing My Bookings
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7f9', fontFamily: 'Inter, sans-serif', padding: '20px' }}>
      <style>{`
        .payment-wrapper {
          background: white;
          max-width: 800px;
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }
        @media (max-width: 768px) {
          .payment-wrapper {
            flex-direction: column;
          }
        }
      `}</style>
      <div className="payment-wrapper">
        
        {/* Left Side - Receipt */}
        <div style={{ flex: 1, background: '#1f2937', color: 'white', padding: '40px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', marginBottom: '30px', padding: 0 }}>&larr; Back to Booking</button>
          
          <h2 style={{ margin: '0 0 30px 0', fontFamily: 'Georgia, serif', fontWeight: 'normal', fontSize: '28px' }}>Order Summary</h2>
          
          <div style={{ borderBottom: '1px solid #374151', paddingBottom: '20px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{state.roomName}</h3>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>Guest: {state.guestName}</p>
            <p style={{ margin: '5px 0 0 0', color: '#9ca3af', fontSize: '14px' }}>{state.checkIn} to {state.checkOut}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
            <span>Total Payable</span>
            <span>₹{state.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Right Side - Payment Form */}
        <div style={{ flex: 1.2, padding: '40px' }}>
          <h2 style={{ margin: '0 0 30px 0', fontSize: '24px', color: '#111' }}>Payment Details</h2>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <button 
              type="button"
              onClick={() => setPaymentMethod('card')}
              style={{ flex: 1, padding: '12px', background: paymentMethod === 'card' ? '#ecfdf5' : 'white', border: paymentMethod === 'card' ? '2px solid #10b981' : '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: paymentMethod === 'card' ? '#065f46' : '#6b7280' }}
            >
              Credit Card
            </button>
            <button 
              type="button"
              onClick={() => setPaymentMethod('upi')}
              style={{ flex: 1, padding: '12px', background: paymentMethod === 'upi' ? '#ecfdf5' : 'white', border: paymentMethod === 'upi' ? '2px solid #10b981' : '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: paymentMethod === 'upi' ? '#065f46' : '#6b7280' }}
            >
              UPI / Wallets
            </button>
            <button 
              type="button"
              onClick={() => setPaymentMethod('spot')}
              style={{ flex: 1, padding: '12px', background: paymentMethod === 'spot' ? '#ecfdf5' : 'white', border: paymentMethod === 'spot' ? '2px solid #10b981' : '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: paymentMethod === 'spot' ? '#065f46' : '#6b7280' }}
            >
              Pay at Spot
            </button>
          </div>

          <form onSubmit={handlePayment}>
            {paymentMethod === 'card' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4b5563', fontWeight: 500 }}>Cardholder Name</label>
                  <input type="text" required placeholder="Name on card" style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4b5563', fontWeight: 500 }}>Card Number</label>
                  <input type="text" required placeholder="0000 0000 0000 0000" style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4b5563', fontWeight: 500 }}>Expiry</label>
                    <input type="text" required placeholder="MM/YY" style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4b5563', fontWeight: 500 }}>CVC</label>
                    <input type="text" required placeholder="123" style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                  </div>
                </div>
              </div>
            ) : paymentMethod === 'upi' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4b5563', fontWeight: 500 }}>Enter UPI ID</label>
                  <input type="text" required placeholder="example@okbank" style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: 0, color: '#334155', lineHeight: '1.5', fontSize: '15px' }}>
                  <strong>Pay at Spot Selected.</strong> You will complete your payment at the receptionist desk during check-in. Our room manager will contact you shortly to confirm your arrival time!
                </p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isProcessing}
              style={{ width: '100%', padding: '16px', background: isProcessing ? '#9ca3af' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', marginTop: '30px', cursor: isProcessing ? 'not-allowed' : 'pointer' }}
            >
              {isProcessing ? 'Processing...' : paymentMethod === 'spot' ? `Confirm Reservation (₹${state.totalPrice.toFixed(2)})` : `Pay ₹${state.totalPrice.toFixed(2)}`}
            </button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              &#128274; Secured by SSL Checkout
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Payment;
