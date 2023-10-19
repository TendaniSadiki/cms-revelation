import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { NavLink } from "react-router-dom";
import { auth, db } from "../../config/firebase";
import {  collection, doc, setDoc } from "firebase/firestore";
import "./SignUp.css";
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [taxInfo, setTaxInfo] = useState({
    taxId: "",
    taxJurisdiction: "",
  });
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [securityQuestion1, setSecurityQuestion1] = useState("");
  const [securityQuestion2, setSecurityQuestion2] = useState("");
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
        // Create user account with email and password
        await createUserWithEmailAndPassword(auth, email, password);
  
        // Send email verification
        sendEmailVerification(auth.currentUser);
  
        setStep(4); // Skip steps 2 and 3
      } else if (step === 4) {
        const businessData = {
          businessName,
          businessAddress,
          role: "admin",
        };
  
        const taxData = {
          taxId: taxInfo.taxId,
          taxJurisdiction: taxInfo.taxJurisdiction,
        };
  
        const userData = {
          fullName,
          phoneNumber,
          dateOfBirth,
          profilePicture,
          securityQuestion1,
          securityQuestion2,
          termsAgreed,
          role:"admin",
          taxInfo: taxData, // Save tax information
          businessInfo: businessData, // Save business information
        };
  
        const userCollectionRef = collection(db, "admins");
        const userUid = auth.currentUser.uid;
        const userDocRef = doc(userCollectionRef, userUid);
        await setDoc(userDocRef, userData);
  
        setStep(5);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  
  


  return (
    <div className="signup-container">
      {step === 0 && (
        <div className="getStaarted">
          <h2>Welcome! Let's get started.</h2>
          <div className="leftSignUp">
            <h2>left</h2>
            <div className="Titles">
              <div className="titleWrapper">
                <div className="titleItem">Fast service</div>
                <div className="titleItem">Secured</div>
                <div className="titleItem">Easy to use</div>
                <div className="titleItem">Earn more</div>
              </div>
            </div>
          </div>
          <div className="rightSignUp">
            <div className="getStartedBtn">
              <h2>right</h2>
              <button type="button" onClick={handleGetStarted}>
                Get Started
              </button>
            </div>
            <p>
              Already have an account? <NavLink to="/signin">Sign In</NavLink>
            </p>
          </div>
        </div>
      )}
      {step === 1 && (
        <div>
          <h2>Step 1: Provide Email and Password</h2>
          <div className="signin-container">
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
            <button type="button" onClick={handleSignUp}>
              Next
            </button>
          </form>

          <p>
            Already have an account? <NavLink to="/signin">Sign In</NavLink>
          </p>
          </div>
        </div>
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
              onChange={(e) =>
                setTaxInfo({ ...taxInfo, taxId: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Taxation Jurisdiction"
              value={taxInfo.taxJurisdiction}
              onChange={(e) =>
                setTaxInfo({ ...taxInfo, taxJurisdiction: e.target.value })
              }
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
              placeholder="Date of Birth (YYYY-MM-DD)"
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
          Verification email sent! Please check your inbox and follow the
          instructions to verify your email address.
        </p>
      )}
    </div>
  );
};

export default SignUp;
