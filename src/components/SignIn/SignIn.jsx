import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { NavLink } from 'react-router-dom';
import { auth } from '../../config/firebase';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Handle successful sign-in (e.g., redirect user to dashboard)
    } catch (error) {
      setError(error.message);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      // Inform the user that a password reset email has been sent
      alert('A password reset email has been sent to your email address.');
      setShowForgotPassword(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      {error && <div className="error-message">{error}</div>}
      <form className='form'>
        <div className='formgroup'>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='formgroup'>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='formgroup'>
          <button type="button" onClick={handleSignIn}>
            Sign In
          </button>
        </div>
      </form>
      <p>
        <span onClick={() => setShowForgotPassword(true)} className="forgot-password-link">
          Forgot your password?
        </span>
        <NavLink to="/signup">Sign Up</NavLink>
      </p>

      {showForgotPassword && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowForgotPassword(false)}>
              &times;
            </span>
            <h2>Forgot Password</h2>
            <p>Enter your email to reset your password.</p>
            <div className='formgroup'>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='formgroup'>
              <button type="button" onClick={handleForgotPassword}>
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
