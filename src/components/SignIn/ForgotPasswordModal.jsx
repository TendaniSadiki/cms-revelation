import React, { useRef, useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth'; // Assuming you're using Firebase for authentication
import { auth } from '../../config/firebase'; // Your Firebase configuration

function ForgotPasswordModal({ isOpen, onClose }) {
  const emailRef = useRef(null);
  const [error, setError] = useState(null);

  const handleResetPassword = async () => {
    const email = emailRef.current.value;
    try {
      await sendPasswordResetEmail(auth, email);
      // Handle successful password reset (e.g., show a success message)
      console.log('Password reset email sent');
      setError(null);
      onClose(); // Close the modal
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Forgot Password</h2>
        {error && <div className="error-message">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          ref={emailRef}
        />
        <button type="button" onClick={handleResetPassword}>
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
