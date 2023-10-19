import React, { useState} from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NavLink } from 'react-router-dom';
import { auth } from '../../config/firebase';
import './SignIn.css'
import Loader from '../Loader/Loader';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSignIn = async () => {
    try {
      setIsLoading(true); // Start loading
      await signInWithEmailAndPassword(auth, email, password);
      // Handle successful sign-in (e.g., redirect user to dashboard)
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false); // Stop loading, whether the sign-in was successful or not
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      {isLoading ? ( // Show loader when loading is true
        <Loader />
      ) : (
        <>
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
            Don't have an account? <NavLink to="/signup">Sign Up</NavLink>
          </p>
        </>
      )}
    </div>
  );
};

export default SignIn;
