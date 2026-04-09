import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. IMPORT YOUR NAVBAR AND FOOTER HERE
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Booking from './pages/user/Booking';
import AdminDashboard from './pages/admin/Dashboard';

const currentUser = { role: 'user' };

function App() {
  return (
    <Router>
      {/* 2. PUT NAVBAR ABOVE ROUTES SO IT SHOWS AT THE TOP */}
      <Navbar /> 

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* User Protected Routes */}
        <Route 
          path="/book" 
          element={currentUser.role === 'user' ? <Booking /> : <Navigate to="/login" />} 
        />

        {/* Admin Protected Routes */}
        <Route 
          path="/admin" 
          element={currentUser.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
      </Routes>

      {/* 3. PUT FOOTER BELOW ROUTES SO IT SHOWS AT THE BOTTOM */}
      <Footer />
    </Router>
  );
}

export default App;