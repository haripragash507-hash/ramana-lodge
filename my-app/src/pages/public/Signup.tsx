import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';

const signupBg = "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem('current_user', JSON.stringify({ email, name }));
    navigate('/book');
  };

  const handleGoogleLogin = () => {
    setShowGoogleModal(true);
  };

  const handleAccountSelect = (email: string, name: string) => {
    sessionStorage.setItem('current_user', JSON.stringify({ email, name }));
    setShowGoogleModal(false);
    navigate('/book');
  };

  return (
    <div className="login-split-container">
      
      {showGoogleModal && (
        <div className="google-modal-overlay" onClick={() => setShowGoogleModal(false)}>
          <div className="google-modal" onClick={e => e.stopPropagation()}>
            <div className="google-modal-header">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
              <h2>Choose an account</h2>
              <p>to continue to Renga Inn</p>
            </div>
            <ul className="google-account-list">
              <li className="google-account-item" onClick={() => handleAccountSelect('haripragash714@gmail.com', 'Hari Pragash')}>
                <div className="google-avatar">H</div>
                <div className="google-account-info">
                  <span className="google-account-name">Hari Pragash</span>
                  <span className="google-account-email">haripragash714@gmail.com</span>
                </div>
              </li>
              <li className="google-account-item" onClick={() => handleAccountSelect('haripragash507@gmail.com', 'hari pragash')}>
                <div className="google-avatar" style={{backgroundColor: '#673ab7'}}>h</div>
                <div className="google-account-info">
                  <span className="google-account-name">hari pragash</span>
                  <span className="google-account-email">haripragash507@gmail.com</span>
                </div>
              </li>
              <li className="google-account-item" onClick={() => {
                 const mail = prompt('Enter your new email:');
                 if (mail) handleAccountSelect(mail, 'New User');
              }}>
                <div className="google-avatar" style={{backgroundColor: '#fff', color: '#5f6368', border: '1px solid #dadce0'}}>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                </div>
                <div className="google-account-info">
                  <span className="google-account-name" style={{fontWeight: 'normal'}}>Use another account</span>
                </div>
              </li>
            </ul>
            <div className="google-modal-footer">
              To continue, Google will share your name, email address, and profile picture with Renga Inn. Before using this app, you can review Renga Inn's <a href="#">privacy policy</a> and <a href="#">terms of service</a>.
            </div>
          </div>
        </div>
      )}
      
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
