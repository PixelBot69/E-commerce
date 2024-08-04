import "./Navbar.css";
import { RiArrowDropDownLine } from "react-icons/ri";
import { PiHandbagLight } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { ecommerceProducts, slide } from "../../Data/Data";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import Cart from "../Cart/Cart";
import { CiReceipt } from "react-icons/ci";

function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  
  const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <div className="announcement-bar slider-wrapper bg-black text-white h-[2rem]">
        <div className="announcement-bar__message" id="announcement-slides-container">
          <div className="announcement-bar__item announcement-slide">
            <div className="icon-span-wrapper">
              <span>ENVÍO GRATIS A TODO EL PAÍS</span>
            </div>
          </div>
          <div className="announcement-bar__item announcement-slide">
            <div className="icon-span-wrapper">
              <span>3 Y 6 CUOTAS SIN INTERÉS TODOS LOS DÍAS</span>
            </div>
          </div>
          <div className="announcement-bar__item announcement-slide">
            <a href="mailto:email@email.fi">
              <div className="icon-span-wrapper">
                <span>ENVÍO GRATIS A TODO EL PAÍS</span>
              </div>
            </a>
          </div>
          <div className="announcement-bar__item announcement-slide">
            <a href="#">
              <div className="icon-span-wrapper">
                <span>3 Y 6 CUOTAS SIN INTERÉS TODOS LOS DÍAS</span>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="navbar">
        <div className="navbar-row navbar-top-row">
        <h1 className="navbar-logo font-[300] md:text-[30px] text-[20px] "> <Link to="/"> JACKIE SMITH</Link></h1>
          <ul className="navbar-links">
            <Link to="/Login"> <li><CiUser /></li></Link>
            <li><CiSearch onClick={() => setIsSearchOpen(true)} /></li>
            <Link to="/wishlist"> <li><CiHeart /></li></Link>
            <li onClick={toggleSidebar}><PiHandbagLight /></li>
            <Link to="/order-status"><li><CiReceipt /></li></Link>
            <motion.div
                  animate={{
                      width: isSidebarOpen ? "330px" : "0px", 
                      transition: {
                          duration: 0.5,
                          type: "spring",
                          damping: 10,
                      },
                  }}
                  className={`sidebar bg-white shadow-lg fixed right-0 top-0 h-full z-50 ${isSidebarOpen ? 'p-5' : 'p-0'}`}
              >
                 
                 {isSidebarOpen ? <div><div className="flex justify-between"><h2 className="text-black mt-9 font-light text-xl">CART </h2> <span className="relative   top-11"  onClick={toggleSidebar} > <RxCross2 /></span></div>
                 <hr className="mt-7 mb-10" ></hr>

                 <Cart/>
                 
                 
                 </div> : " "} 
                 
                 
              
              </motion.div>
            
          </ul>
        </div>
      
      </div>

      {isSearchOpen && (
        <div className="search-overlay" onClick={() => setIsSearchOpen(false)}>
          <div className="search-container" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={() => setIsSearchOpen(false)}>✖</button>
            <input type="text" className="search-input" placeholder="Search..." autoFocus />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
