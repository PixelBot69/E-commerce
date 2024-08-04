import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Category from './Pages/Category';
import WishList from './Pages/WishList';
import CheckOut from './Pages/CheckOut';
import Detail from './Pages/Detail';
import OrderPlaces from './Pages/OrderPlaced';
import Payment from './Pages/Payment';
import OrderStatus from './Pages/OrderStatus';
import { AuthProvider } from './AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';



function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/category" element={<Category />} />
              <Route path="/wishlist" element={<WishList />} />
              <Route path="/checkout" element={<CheckOut />} />
              <Route path="/detail/:id" element={<Detail />} />
              <Route path="/payments" element={<Payment />} />
              <Route path="/orderPlaced" element={<OrderPlaces />} />
              <Route path="/order-status" element={<OrderStatus />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
