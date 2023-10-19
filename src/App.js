import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth, db } from "./config/firebase";
import Signup from "./components/SignUp/SignUp";
import Home from "./components/Home/Home";
import SignIn from "./components/SignIn/SignIn";
import { collection, doc, getDoc } from "firebase/firestore";
import "./App.css"

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin role

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
  
        // Fetch user role from Firestore and check if it's admin
        const userDocRef = doc(collection(db, "admins"), authUser.uid);
  
        try {
          const userDocSnapshot = await getDoc(userDocRef);
  
          if (userDocSnapshot.exists() && userDocSnapshot.data().role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          // Handle error state here, e.g., set isAdmin to false or show an error message
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false); // Reset admin status if not authenticated
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isEmailVerified = user && user.emailVerified;

  return (
    <Router>
      <div className="App">
        {isEmailVerified && isAdmin && (
          <nav>
            <ul>
              <li>
                <button onClick={handleLogout} className="btn">Logout</button>
              </li>
            </ul>
          </nav>
        )}

        <Routes>
          {isEmailVerified && isAdmin ? (
            <>
            <Route path="/home" element={<Home />} />
            <Route path="/*" element={<Home />} />
            </>
          ) : (
            <>
            <Route path="/signup" element={<Signup/>} />
            <Route path="/signin" element={<SignIn/>} />
            <Route path="/*" element={<Navigate to="/signup" />} />
            </>
          )}

         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
