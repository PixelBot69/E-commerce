import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

function OrderStatus() {
    const { isLoggedIn } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Authentication token is missing');
                    setError('Authentication token is missing');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://127.0.0.1:8000/api/orders/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Error fetching orders');
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn) {
            fetchOrders();
        } else {
            setLoading(false);
            setError('You need to be logged in to view your orders.');
        }
    }, [isLoggedIn]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-md mx-auto mt-[5rem] mb-[20rem] p-4 border border-gray-300 rounded-lg bg-white">
            <h1 className="text-xl font-bold mb-4">Your Orders</h1>
            {orders.length > 0 ? (
                orders.map((order) => (
                    <div key={order.id} className="mb-4">
                        <table className="table-auto w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Order ID</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2">{order.id}</td>
                                    <td className="border px-4 py-2">{order.status}</td>
                                    <td className="border px-4 py-2">₹{order.total_amount}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <p>No orders found</p>
            )}
        </div>
    );
}

export default OrderStatus;
