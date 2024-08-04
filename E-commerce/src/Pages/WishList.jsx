import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WishList() {
    const [wishItems, setWishItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishItems = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/wish-items/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setWishItems(response.data);
            } catch (error) {
                console.error('Error fetching wishlist items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishItems();
    }, []);

    const removeFromWishlist = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/api/wish-items/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setWishItems(wishItems.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Your Wishlist</h2>
            <div>
                {wishItems.map(item => (
                    <div key={item.id} className="max-w-sm rounded overflow-hidden shadow-lg mt-[1rem]">
                        <img className="w-full" src={item.product.product_image} alt={item.product.product_name} />
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl mb-2">{item.product.product_name}</div>
                            <p className="text-gray-700 text-base">${item.product.product_price}</p>
                        </div>
                        <div className="px-6 pt-4 pb-2">
                            <button onClick={() => removeFromWishlist(item.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WishList;
