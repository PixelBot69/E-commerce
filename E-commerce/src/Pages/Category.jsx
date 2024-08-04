import React, { useState, useEffect } from "react";
import Products from "../Components/FeatureCard/FeatureCard";
import { motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import Side from "../Components/SideMenu/Side";


function Category() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories/')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  useEffect(() => {
    if (selectedCategory !== null) {
      fetch(`http://127.0.0.1:8000/api/categories/${selectedCategory}/products/`)
        .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error('Error fetching products:', error));
    } else {
      fetch('http://127.0.0.1:8000/api/Product/')
        .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error('Error fetching products:', error));
    }
  }, [selectedCategory]);
console.log(selectedCategory);
console.log(products)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCategorySelect = (id) => {
    console.log(id)
    setSelectedCategory(id);
    
  };

  return (
    <div>
      <h1 className="font-light mt-[10rem] text-[1.3rem] text-black text-center">CATEGORIES</h1>
      <div className="flex justify-between mt-[9rem]">
        <button
          className="bg-transparent text-black font-light py-2 px-4 border border-grey ml-20"
          onClick={toggleSidebar}
        >
          Filter
        </button>
        <motion.div
          animate={{
            width: isSidebarOpen ? "300px" : "0px",
            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar bg-white shadow-lg fixed left-0 top-0 h-full z-50 ${isSidebarOpen ? 'p-5' : 'p-0'}`}
        >
          {isSidebarOpen && (
            <div>
              <div className="flex justify-between">
                <h2 className="text-black mt-4 font-light text-xl">FILTER</h2>
                <span className="relative top-5" onClick={toggleSidebar}>
                  <RxCross2 />
                </span>
              </div>
              <hr className="mt-7 mb-10" />
              <span ><Side categories={categories} onCategorySelect={handleCategorySelect} />
</span>

              
            </div>
          )}
        </motion.div>
       
      </div>

      <Products categoryId={selectedCategory}  />

    </div>
  );
}

export default Category;
