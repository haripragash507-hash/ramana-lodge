import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';

const signupBg = "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem('current_user', JSON.stringify({ email, name }));
    navigate('/book');
  };

  const handleGoogleLogin = () => {
    const gmail = prompt('Enter your Gmail address to sign up:');
    if (gmail) {
      sessionStorage.setItem('current_user', JSON.stringify({ email: gmail, name: 'Google User' }));
      navigate('/book');
    }
  };

  return (
    <div className="login-split-container">
      
      <div 
        className="login-image-side" 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url('${signupBg}')` }}
      >
        <div className="login-image-text">
          <h1>Start your journey.</h1>
          <p>Create an account to book your stay and experience true comfort at Renga Inn.</p>
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-form-wrapper">
          
          <div className="brand-logo">
            <h2>Renga Inn</h2>
          </div>

          <h1 className="welcome-text">Create an account</h1>
          <p className="subtitle-text">Please enter your details to sign up.</p>

          <button type="button" className="google-btn" onClick={handleGoogleLogin}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ height: '20px' }} />
            Sign up with Google
          </button>

          <div className="divider">or</div>

          <form onSubmit={handleSignup} className="auth-form">
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>

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

            <button type="submit" className="sign-in-btn">Sign up</button>
          </form>

          <p className="signup-prompt">
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Sign in</a>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Signup;
