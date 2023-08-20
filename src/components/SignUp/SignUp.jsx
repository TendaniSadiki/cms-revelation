import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { NavLink } from 'react-router-dom';
import { auth, db } from '../../config/firebase';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [taxInfo, setTaxInfo] = useState({
    taxId: '',
    taxJurisdiction: '',
  });
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [securityQuestion1, setSecurityQuestion1] = useState('');
  const [securityQuestion2, setSecurityQuestion2] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);

  const handleGetStarted = () => {
    setStep(1);
  };

  const handleSignUp = async () => {
    try {
      if (step === 0) {
        handleGetStarted();
      } else if (step === 1) {
        await createUserWithEmailAndPassword(auth, email, password);
        setStep(2);
        // Send email verification
        sendEmailVerification(auth.currentUser).then(() => {
          // Verification email sent
        });
      } else if (step === 2) {
        // Save business info to the "admins" collection in Firestore
        const businessData = {
          businessName,
          businessAddress,
        };
        const businessCollectionRef = collection(db, 'admins');
        await addDoc(businessCollectionRef, businessData);
  
        setStep(3);
        // Redirect or perform the next step as needed
      } else if (step === 3) {
        // Save tax information to the "admins" collection in Firestore
        const taxData = {
          taxId: taxInfo.taxId,
          taxJurisdiction: taxInfo.taxJurisdiction,
        };
        const taxCollectionRef = collection(db, 'admins');
        await addDoc(taxCollectionRef, { taxInfo: taxData }, { merge: true });
  
        setStep(4);
        // Redirect or perform the next step as needed
      } else if (step === 4) {
        // Save additional user information to the "admins" collection in Firestore
        const userData = {
          fullName,
          phoneNumber,
          dateOfBirth,
          profilePicture,
          securityQuestion1,
          securityQuestion2,
          termsAgreed,
        };
        const userCollectionRef = collection(db, 'admins');
  
        // Get the user's UID
        const user = auth.currentUser;
        const userUid = user.uid;
  
        // Use the UID as the document ID
        const userDocRef = doc(userCollectionRef, userUid);
        await setDoc(userDocRef, userData);
  
        // Create a subcollection under the user's document
        const subcollectionRef = collection(userDocRef, 'store');
  
        // Use the UID as the document ID for the subcollection
        const subcollectionDocRef = doc(subcollectionRef, 'products');
  
        // Add data to the subcollection
        await setDoc(subcollectionDocRef, { field1: 'value1', field2: 'value2' });
  
        setStep(5);
        // Redirect or perform the next step as needed
      }
    } catch (error) {
      setError(error.message);
    }
  };
  

  

  return (
    <div className="signup-container">
      {step === 0 && (
        <>
          <h2>Welcome! Let's get started.</h2>
          <button type="button" onClick={handleGetStarted}>
            Get Started
          </button>
        </>
      )}
      {step === 1 && (
        <>
          <h2>Step 1: Provide Email and Password</h2>
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
            <button type="button" onClick={handleSignUp}>
              Next
            </button>
          </form>
          <p>
            Already have an account? <NavLink to="/signin">Sign In</NavLink>
          </p>
        </>
      )}
      {step === 2 && (
        <>
          <h2>Step 2: Provide Business Information</h2>
          <form>
            <input
              type="text"
              placeholder="Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Business Address"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
            />
            <button type="button" onClick={() => setStep(3)}>
              Next
            </button>
          </form>
          <p>
            Already have an account? <NavLink to="/signin">Sign In</NavLink>
          </p>
        </>
      )}
      {step === 3 && (
        <>
          <h2>Step 3: Provide Tax Information</h2>
          {error && <div className="error-message">{error}</div>}
          <form>
            <input
              type="text"
              placeholder="Tax ID or Social Security Number"
              value={taxInfo.taxId}
              onChange={(e) => setTaxInfo({ ...taxInfo, taxId: e.target.value })}
            />
            <input
              type="text"
              placeholder="Taxation Jurisdiction"
              value={taxInfo.taxJurisdiction}
              onChange={(e) => setTaxInfo({ ...taxInfo, taxJurisdiction: e.target.value })}
            />
            <button type="button" onClick={() => setStep(4)}>
              Next
            </button>
          </form>
          <p>
            Already have an account? <NavLink to="/signin">Sign In</NavLink>
          </p>
        </>
      )}

      {step === 4 && (
        <>
          <h2>Step 4: Additional Information</h2>
          {error && <div className="error-message">{error}</div>}
          <form>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              type="text"
              placeholder="Date of Birth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            <input
              type="text"
              placeholder="Profile Picture URL"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
            />
            <input
              type="text"
              placeholder="Security Question 1"
              value={securityQuestion1}
              onChange={(e) => setSecurityQuestion1(e.target.value)}
            />
            <input
              type="text"
              placeholder="Security Question 2"
              value={securityQuestion2}
              onChange={(e) => setSecurityQuestion2(e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={() => setTermsAgreed(!termsAgreed)}
              />
              I agree to the terms and conditions
            </label>
            <button type="button" onClick={handleSignUp}>
              Sign Up
            </button>
          </form>
          <p>
            Already have an account? <NavLink to="/signin">Sign In</NavLink>
          </p>
        </>
      )}

      
      {step === 5 && (
        <p>
          Verification email sent! Please check your inbox and follow the instructions to verify your email address.
        </p>
      )}
    </div>
  );
};

export default SignUp;
