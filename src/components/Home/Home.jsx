import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Inventory from '../Inventory/Inventory';
import PendingOrders from '../PendingOrders/PendingOrders';
import OrderHistory from '../OrderHistory/OrderHistory';
import AddProductForm from '../AddProduct/AddProduct';

function Home() {
  return (
    <div>
      <h2>Welcome to the Home Page</h2>
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
            <Link to="/add-product">Add Product</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/pending-orders" element={<PendingOrders />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/add-product" element={<AddProductForm />} />
      </Routes>
    </div>
  );
}

export default Home;
