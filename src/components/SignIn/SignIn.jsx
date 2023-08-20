import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NavLink } from 'react-router-dom';
import { auth } from '../../config/firebase';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Handle successful sign-in (e.g., redirect user to dashboard)
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      {error && <div className="error-message">{error}</div>}
      <form>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleSignIn}>
          Sign In
        </button>
      </form>
      <p>
        Don't have an account? <NavLink to="/signup">Sign Up</NavLink>
      </p>
    </div>
  );
};

export default SignIn;
