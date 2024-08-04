import { useState } from "react";
import { slide } from "../../Data/Data";
import "./Slider.css";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";

function Slider() {
    const [slides,setSlides]=useState(0)

    function PrevButton(){
        setSlides(slides===0?2:(prev)=>prev-1 )
    }
    function NextButton(){
        setSlides(slides===2?0:(next)=> next+1)
    }
    return (
        <div className="slider">
           
                {slide.images.map((item, index) => (
                   
                     <div className="container" style={{transform:`translateX(-${slides * 70}vw)`}} key={index}>
                        <img src={item.image}  alt={`Slide ${index}` } className="slide-image" />
                     </div>
                       
                ))}
                <div className="w-[fit-content] flex absolute left-0 right-0 bottom-[10px] gap-[10px] m-auto">
                <button onClick={PrevButton} class="bg-[transparent]  text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                <GrFormPrevious />
                </button>
                <button onClick={NextButton} class="bg-[transparent]  text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                <GrFormNext />
                 </button>
                </div>
                
            
        </div>
    );
}

export default Slider;
