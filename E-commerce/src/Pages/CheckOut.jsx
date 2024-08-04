import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function CheckOut() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0); 
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zip_code: ''
    });
    const { isLoggedIn, user } = useContext(AuthContext);
    const navigate = useNavigate();

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

                const subtotal = response.data[0].items.reduce((total, item) => 
                    total + (item.product?.product_price || 0) * item.quantity, 0
                );
                const totalAmount = subtotal * 1.05; 
                
                setSubtotal(subtotal);
                setTotal(totalAmount);

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

    const handleChange = (e) => {
        const { id, value } = e.target;
        setAddress({ ...address, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoggedIn) {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/addresses/', {
                    ...address,
                    user: user.id
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.status === 201) {
                    console.log('Address submitted successfully!');
                    const addressId = response.data.id;
                
                   
                    setAddress({
                        street: '',
                        city: '',
                        state: '',
                        zip_code: ''
                    });
                    const cartItems = (cart[0]?.items || []).map(item => ({
                        product_id: item.product.id,
                        quantity: item.quantity
                    }));
    
                   
                    console.log('Cart items:', cartItems);

                    const order = {
                        user: user.id,
                        total_amount: total,
                        address_id: addressId
                        ,cart_items: cartItems
                    };

                    navigate('/payments', { state: { order: order } });
                }
            } catch (error) {
                console.error('Error submitting address:', error);
            }
        }
    };

    if (!isLoggedIn) {
        return <div>Please log in to view your cart.</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-row justify-evenly">
            <div>
                <div className="bg-white mt-20">
                    <div className="w-full max-w-3xl mx-auto p-8">
                        <div className="bg-white text-black p-8 rounded-lg">
                            <h1 className="text-2xl font-bold text-black mb-4">Checkout</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Shipping Address</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="street" className="block text-gray-700 mb-1">Street</label>
                                            <input type="text" id="street" value={address.street} onChange={handleChange} className="w-full rounded-lg border border-slate-200 py-2 px-3"/>
                                        </div>
                                        <div>
                                            <label htmlFor="city" className="block text-gray-700 mb-1">City</label>
                                            <input type="text" id="city" value={address.city} onChange={handleChange} className="w-full rounded-lg border py-2 px-3"/>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="state" className="block text-gray-700 mb-1">State</label>
                                        <input type="text" id="state" value={address.state} onChange={handleChange} className="w-full rounded-lg border py-2 px-3"/>
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="zip_code" className="block text-gray-700 mb-1">ZIP Code</label>
                                        <input type="text" id="zip_code" value={address.zip_code} onChange={handleChange} className="w-full rounded-lg border py-2 px-3"/>
                                    </div>
                                </div>
                                <button type="submit" className="flex items-center justify-center border border-transparent bg-black px-4 py-2 text-base font-small text-white shadow-sm">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="inline-block h-[58rem] min-h-[6em] w-0.5 self-stretch dark:bg-gray-300"></div>
            <div>
                {cart && cart.length > 0 && (
                    <ul role="list" className="-my-6 divide-y divide-gray-200 mt-[10rem] mr-8">
                        {cart[0].items.map(item => (
                            <li className="flex py-6" key={item.id}>
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                                    <img src={item.product?.product_image} alt={item.product?.product_name} className="h-full w-full object-cover object-center"/>
                                </div>
                                <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                        <div className="flex justify-between text-xs font-light text-black">
                                            <h3>
                                                <a href="#">{item.product?.product_name}</a>
                                            </h3>
                                            <p className="ml-4">${item.product?.product_price}</p>
                                        </div>
                                        <form className="max-w-xs mx-auto border mt-2">
                                            <div className="relative flex items-center max-w-[7.7rem]">
                                                <button type="button" id="decrement-button" data-input-counter-decrement="quantity-input" className="bg-white rounded-s-lg pl-3 h-11">
                                                    -
                                                </button>
                                                <input type="text" id="quantity-input" data-input-counter aria-describedby="helper-text-explanation" className="border-x-0 border-gray-300 h-11 text-center text-black text-sm block w-full py-2.5" value={item.quantity} readOnly/>
                                                <button type="button" id="increment-button" data-input-counter-increment="quantity-input" className="bg-white rounded-e-lg p-0 h-11 focus:outline-none">
                                                    +
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="flex flex-col justify-center gap-5 mt-8 text-sm">
                    <span className="flex flex-row justify-between"><h1>Subtotal</h1><h1>${subtotal.toFixed(2)}</h1></span>
                    <span className="flex flex-row justify-between text-lg font-bold"><h1>Total</h1> <h1>${total.toFixed(2)} (After Taxes)</h1></span>
                </div>
            </div>
        </div>
    );
}

export default CheckOut;
