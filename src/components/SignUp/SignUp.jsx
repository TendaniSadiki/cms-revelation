// SignUp.jsx
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import "./SignUp.css";
import Steps from "./steps";

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
          role: "admin",
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
      <Steps
        step={step}
        handleGetStarted={handleGetStarted}
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        businessName={businessName}
        setBusinessName={setBusinessName}
        businessAddress={businessAddress}
        setBusinessAddress={setBusinessAddress}
        taxInfo={taxInfo}
        setTaxInfo={setTaxInfo}
        fullName={fullName}
        phoneNumber={phoneNumber}
        dateOfBirth={dateOfBirth}
        profilePicture={profilePicture}
        securityQuestion1={securityQuestion1}
        securityQuestion2={securityQuestion2}
        termsAgreed={termsAgreed}
        setFullName={setFullName}
        setPhoneNumber={setPhoneNumber}
        setDateOfBirth={setDateOfBirth}
        setProfilePicture={setProfilePicture}
        setSecurityQuestion1={setSecurityQuestion1}
        setSecurityQuestion2={setSecurityQuestion2}
        setTermsAgreed={setTermsAgreed}
        handleSignUp={handleSignUp}
        error={error}
      />
    </div>
  );
};

export default SignUp;
