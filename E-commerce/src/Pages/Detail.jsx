import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CiHeart } from 'react-icons/ci';
import axios from 'axios';
import img1 from './lo1.jpg';
import img2 from './icon1.jpg';
import img3 from './idea2.jpg';
import { AuthContext } from '../AuthContext';

function Detail() {
    const { isLoggedIn } = useContext(AuthContext);
    const [imga, setImga] = useState(img1);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/details/${id}/`)
            .then(response => {
                setProduct(response.data);
                console.log(response.data)
                setLoading(false);
            })
            .catch(error => console.error('Error fetching product:', error));
    }, [id]);

    const addToCart = () => {
        if (isLoggedIn) {
            axios.post('http://127.0.0.1:8000/api/cart-items/', {
                product_id: id, 
                quantity: 1
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                navigate('/checkout');
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
                if (error.response && error.response.status === 401) {
                    alert('Authentication required. Please log in.');
                }
            });
        } else {
            alert('You need to be logged in to add items to the cart.');
        }
    };
    const addToWishlist = () => {
        if (isLoggedIn) {
            axios.post('http://127.0.0.1:8000/api/wish-items/', {
                product_id: id
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                navigate('/wishlist');
            })
            .catch(error => {
                console.error('Error adding to wishlist:', error);
                if (error.response && error.response.status === 401) {
                    alert('Authentication required. Please log in.');
                }
            });
        } else {
            alert('You need to be logged in to add items to the wishlist.');
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex gap-[50px] p-[20px 50px] mt-[13rem] mb-20">
            <div className="flex flex-1 gap-7 ml-6">
                <div>
                    <img src={img1} onClick={() => setImga(img1)} className="w-[80%] h-[150px] object-cover cursor-pointer mb-[10px]" alt="img1" />
                    <img src={img3} onClick={() => setImga(img3)} className="w-[80%] h-[150px] object-cover cursor-pointer mb-[10px]" alt="img3" />
                    <img src={img2} onClick={() => setImga(img2)} className="w-[80%] h-[150px] object-cover cursor-pointer mb-[10px]" alt="img2" />
                </div>
                <div className="flex-5 flex">
                    <img src={product.product_image} className="w-[100%] h-[700px] object-cover cursor-pointer mb-[10px]" alt="product" />
                </div>
            </div>
            <div className="flex flex-1">
                <div className="flex flex-col">
                    <span className="text-md font-light">{product.product_name}</span>
                    <span className="text-md font-light">${product.product_price}</span>
                    <span className="text-xs mt-2 font-light">Tax Included</span>
                    <hr className="mt-10 w-[40rem] mb-6" />
                    <button onClick={addToCart} className="flex items-center justify-center border border-transparent bg-black px-6 py-3 text-base font-small text-white shadow-sm mb-5">
                        ADD TO CART
                    </button>
                    <a onClick={addToWishlist} className="flex items-center justify-center border border-black bg-white px-6 py-3 text-light font-small text-black shadow-sm cursor-pointer">
                        WISH LIST <span className="ml-[0.3rem]"><CiHeart /></span>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Detail;
