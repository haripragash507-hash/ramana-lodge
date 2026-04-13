import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Booking from './pages/user/Booking';
import AdminDashboard from './pages/admin/Dashboard';

import { useLocation } from 'react-router-dom';
import { RoomProvider } from './context/RoomContext';
import { OfferProvider } from './context/OfferContext';
import { BookingHistoryProvider } from './context/BookingHistoryContext';
import Payment from './pages/user/Payment';

const AppContent = () => {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/book') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/payment');

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard Routes */}
        <Route path="/book" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
};

function App() {
  return (
    <BookingHistoryProvider>
      <RoomProvider>
        <OfferProvider>
          <Router>
            <AppContent />
          </Router>
        </OfferProvider>
      </RoomProvider>
    </BookingHistoryProvider>
  );
}

export default App;