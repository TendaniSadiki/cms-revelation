import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddProductForm from "./components/AddProduct/AddProduct";
import { auth } from "./config/firebase";
import Signup from "./components/SignUp/SignUp";
import Home from "./components/Home/Home";
import SignIn from "./components/SignIn/SignIn";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isEmailVerified = user && user.emailVerified;

  return (
    <Router>
      <div className="App">
        {isEmailVerified && (
          <nav>
            <ul>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </nav>
        )}

        <Routes>
          {isEmailVerified && user ? (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/*" element={<Home />} />
            </>
          ) : (
            <>
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/*" element={<Signup />} />
            </>
          )}
        </Routes>

        {isEmailVerified && user && <AddProductForm />}
      </div>
    </Router>
  );
}
export default App;
