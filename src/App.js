  import React, { useState, useEffect } from 'react';
  import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
  import AddProductForm from './components/AddProduct/AddProduct';
  import { auth } from './config/firebase';
  import Signup from './components/SignUp/SignUp';
  import Home from './components/Home/Home';
  import SignIn from './components/SignIn/SignIn';

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
        console.error('Error logging out:', error);
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
                  <Link to="/inventory">Inventory</Link>
                </li>
                <li>
                  <Link to="/pending-orders">Pending Orders</Link>
                </li>
                <li>
                  <Link to="/order-history">Order History</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </nav>
          )}

          <Routes>
            {isEmailVerified && user ? (
              <>
                <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                <Route path="/pending-orders" element={<ProtectedRoute><PendingOrders /></ProtectedRoute>} />
                <Route path="/order-history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
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




  function ProtectedRoute({ children }) {
    const user = auth.currentUser;

    if (!user) {
      return <Navigate to="/signup" />;
    }

    return children;
  }

  function Inventory() {
    return <div>Inventory Page</div>;
  }

  function PendingOrders() {
    return <div>Pending Orders Page</div>;
  }

  function OrderHistory() {
    return <div>Order History Page</div>;
  }

  export default App;
