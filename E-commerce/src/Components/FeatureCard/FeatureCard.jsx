import React, { useState, useEffect } from 'react';
import Card from '../Card/Card'; 
import { Link } from 'react-router-dom';

const Products = ({ categoryId }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = categoryId
        ? `http://127.0.0.1:8000/api/categories/${categoryId}/products` 
        : 'http://127.0.0.1:8000/api/details/'; 

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();

      setProducts(data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]); 

  return (
    
    <div className='mt-[7rem] mb-[7rem]'>
      {isLoading && <p>Loading products...</p>}
      {error && <p>Error: {error.message}</p>}
      {products.length > 0 && (
        <ul className='flex flex-wrap justify-evenly'>
          {products.map((product) => (
            <li key={product.id}>
              <Link to={`/detail/${product.id}`}>
                <Card product={product} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Products;
