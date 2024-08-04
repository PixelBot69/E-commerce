import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('token');
      axios.get('http://127.0.0.1:8000/api/cart/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Cart data:', response.data);
        setCart(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the cart!', error);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const updateQuantity = (item, newQuantity) => {
    const token = localStorage.getItem('token');
    axios.put(`http://127.0.0.1:8000/api/cart-items/${item.id}/`, {
      product: item.product.id,  
      quantity: newQuantity
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      setCart(prevCart => {
        const updatedItems = prevCart[0].items.map(cartItem => 
          cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
        );
        return [{ ...prevCart[0], items: updatedItems }];
      });
    })
    .catch(error => {
      console.error('There was an error updating the quantity!', error);
    });
  };

  const handleIncrement = (item) => {
    updateQuantity(item, item.quantity + 1);
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item, item.quantity - 1);
    }
  };

  if (!isLoggedIn) {
    return <div>Please log in to view your cart.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cart || cart.length === 0 || !cart[0].items || cart[0].items.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div>
      <ul role="list" className="-my-6 divide-y divide-gray-200">
        {cart[0].items.map(item => (
          <li key={item.id} className="flex py-6">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
              <img src={item.product?.product_image || 'default_image_url'} alt={item.product?.product_name || 'Product'} className="h-full w-full object-cover object-center" />
            </div>
            <div className="ml-4 flex flex-1 flex-col">
              <div>
                <div className="flex justify-between text-xs font-light text-black">
                  <h3>
                    <a href="#">{item.product?.product_name || 'Product Name'}</a>
                  </h3>
                  <p className="ml-4">${item.product?.product_price || '0.00'}</p>
                </div>
                
                <form className="max-w-xs mx-auto">
                  <label htmlFor={`quantity-${item.id}`} className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Choose quantity:</label>
                  <div className="relative flex items-center">
                    <button type="button" onClick={() => handleDecrement(item)} className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-8 w-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                      <svg className="w-4 h-4 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                      </svg>
                    </button>
                    <input type="text" id={`quantity-${item.id}`} value={item.quantity} onChange={(e) => updateQuantity(item, parseInt(e.target.value))} className="flex-shrink-0 text-black border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[3rem] text-center" required />
                    <button type="button" onClick={() => handleIncrement(item)} className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-8 w-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                      <svg className="w-4 h-4 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                      </svg>
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div className="flex justify-between text-xs font-light text-gray-900">
          <p>SUBTOTAL</p>
          <p>${cart[0].items.reduce((total, item) => total + (item.product?.product_price || 0) * item.quantity, 0).toFixed(2)}</p>
        </div>
        <p className="mt-[1.25rem] text-xs text-center text-black">Shipping and taxes calculated</p>
        <div className="mt-6">
          <Link to="/checkout" className="flex items-center justify-center border border-transparent bg-black px-6 py-3 text-base font-small text-white shadow-sm">CHECK OUT</Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
