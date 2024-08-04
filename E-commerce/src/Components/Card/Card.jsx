import React from 'react';
import { MdFavoriteBorder } from "react-icons/md";

function Card({ product }) {
  const { product_name, product_price, product_description, product_quantity, product_image } = product;

  return (
    <div className="card w-[250px] h-[400px] flex flex-col overflow-hidden round-[8px] border-[1px solid #ddd] bg-[#fff]">
      <a
        className="relative mx-3 mt-3 flex h-full overflow-hidden rounded-xl hover:scale-105 transition duration-300 ease-in-out"
        href="#"
      >
        {product_image && (
          <img
            className="object-cover peer absolute top-0 right-0 h-full w-full duration-300 ease-in-out transition-transform group-hover:scale-110"
            src={product_image}
            alt={product_name} 
          />
        )}
        {!product_image && (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500 text-lg font-medium">No Image Available</p>
          </div>
        )}
      </a>
      <div className="mt-4 px-5 pb-5 flex-grow">
        <a href="#">
          <h5 className="tracking-tight text-center text-black text-xs">{product_name}</h5>
        </a>
        <p className='text-center'>  
          <span className="text-xs text-black">${product_price}</span>
        </p>
        <span
          className="flex items-center justify-center rounded-md px-5 py-2.5 text-center text-sm font-medium"
        >
          <MdFavoriteBorder style={{cursor:'pointer'}}/>
        </span>
      </div>
    </div>
  );
}

export default Card;
