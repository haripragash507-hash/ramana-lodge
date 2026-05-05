import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';

// 1. IMPORT YOUR NEW CREDENTIALS FILE!
import { ADMIN_CREDENTIALS } from '../../config/credentials';

const loginBg = "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 2. USE THE SEPARATE FILE TO CHECK LOGIN
    if (email === ADMIN_CREDENTIALS.email) {
      // It's the admin email, but did they get the password right?
      if (password === ADMIN_CREDENTIALS.password) {
        navigate('/admin'); // Success! Send to Dashboard
      } else {
        alert('Incorrect Admin Password!'); // Failed password
      }
    } else {
      // If it's any other email, treat them as a normal guest
      sessionStorage.setItem('current_user', JSON.stringify({ email }));
      navigate('/book');  
    }
  };

  return (
    <div className="login-split-container">
      
      <div 
        className="login-image-side" 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url('${loginBg}')` }}
      >
        <div className="login-image-text">
          <h1>Escape to Comfort.</h1>
          <p>Experience the tranquility of the temple city with the uncompromised comfort of Renga Inn.</p>
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-form-wrapper">
          
          <div className="brand-logo">
            <h2>Renga Inn</h2>
          </div>

          <h1 className="welcome-text">Welcome back</h1>
          <p className="subtitle-text">Please enter your details to sign in.</p>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
              <label>Email address</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <div className="form-actions-row">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="sign-in-btn">Sign in</button>
          </form>

          <p className="signup-prompt">
            Don't have an account? <a href="#">Sign up</a>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;