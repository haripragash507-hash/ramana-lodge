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
import AboutUs from './pages/public/AboutUs';
import LocationPage from './pages/public/Location';
import Gallery from './pages/public/Gallery';
import Offers from './pages/public/Offers';
import Signup from './pages/public/Signup';

const AppContent = () => {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/book') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/payment');

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/location" element={<LocationPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

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