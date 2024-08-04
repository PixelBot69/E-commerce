
import Ad from "../Components/Ad/Ad";
import Products from "../Components/FeatureCard/FeatureCard";
import Slider from "../Components/Slider/Slider";
import Detail from "./Detail";
function Home() {
    return ( 
        <div>
        <Slider/>
        <Products/>
        <Ad/>
        

        </div>
       
     );
}

export default Home;