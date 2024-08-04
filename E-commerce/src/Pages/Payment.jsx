import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';


function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('COD'); 

    const { order } = location.state || {};

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Authentication token is missing');
                return;
            }

            const response = await axios.post('http://127.0.0.1:8000/api/create-order/', {
                ...order,
                payment_method: paymentMethod
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (paymentMethod === 'RAZORPAY') {
                const { order_id } = response.data;

                const razorpayKeyId = import.meta.env.VITE_REACT_APP_RAZORPAY_KEY_ID;

                if (!window.Razorpay) {
                    console.error('Razorpay script not loaded');
                    return;
                }

                const options = {
                    key: razorpayKeyId,
                    amount: order.total_amount * 100,
                    currency: 'INR',
                    name: 'Ecommerce',
                    description: 'Test Transaction',
                    order_id: order_id,
                    handler: async (response) => {
                        try {
                            await axios.post('http://127.0.0.1:8000/api/verify-payment/', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            }, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                }
                            });
                            navigate(`/order-status/${order_id}`);
                        } catch (error) {
                            console.error('Error verifying payment:', error);
                        }
                    },
                    prefill: {
                        name: order.user?.username || '',
                        email: order.user?.email || '',
                        contact: '884893'
                    },
                    notes: {
                        address: 'Razorpay Corporate Office'
                    },
                    theme: {
                        color: '#F37254'
                    }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
            } else {
                navigate(`/orderPlaced`)
            }
        } catch (error) {
            console.error('Payment failed:', error);
        }
    };

    return (
<div className="max-w-sm w-full lg:max-w-full lg:flex mt-[16rem] mb-[16rem] ml-[48rem]">
            <div className="border-r border-b border-l border-gray-400 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                <div className="mb-8">
                    <label className="block mb-2 text-gray-700">
                        Payment Method:
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="block w-full mt-1 border border-gray-300 rounded-md"
                        >
                            <option value="COD">Cash on Delivery</option>
                            <option value="RAZORPAY">Razorpay</option>
                        </select>
                    </label>
                    <p className="text-sm text-gray-600 flex items-center">
                        <svg className="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
                        </svg>
                        Members only
                    </p>
                    <div className="text-gray-900 font-bold text-xl mb-2">
                        {paymentMethod === 'RAZORPAY' ? 'Pay here through Razorpay' : 'Pay through COD'}
                    </div>
                    <button
                        className='font-bold py-2 px-4 rounded bg-blue-500 text-white'
                        onClick={handlePayment}
                    >
                        {paymentMethod === 'RAZORPAY' ? 'Pay Now' : 'Place Order'}
                    </button>
                </div>
                <div className="flex items-center">
                    <div className="text-sm">
                        <p className="text-gray-900 leading-none">Payment Method</p>
                        <p className="text-gray-600">{paymentMethod}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;
