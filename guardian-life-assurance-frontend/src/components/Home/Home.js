import './Home.css'; 

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Swiper1 from "../../assets/images/swiper1.png"
import Swiper2 from "../../assets/images/swiper.png"
import Swiper3 from "../../assets/images/swiper2.png"
import AboutUs from "../../assets/images/aboutUs.png"


const Home = () => {
    
    return (
        <>
            <div className="home-container">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}       
                    autoplay={{
                        delay: 4000,   
                        disableOnInteraction: false, 
                    }}
                >
                    <SwiperSlide>
                        <img src={Swiper1} alt="Slide 1" className="swiper-image"/>
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={Swiper2} alt="Slide 2" className="swiper-image"/>
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={Swiper3} alt="Slide 3" className="swiper-image"/>
                    </SwiperSlide>
                </Swiper>
            </div>
            <div class="about-us-container">
    <div id="about-us" class="about-us-content">
        <h2>About Us</h2>
        <p>
            At Guardian Life Assurance, we are dedicated to providing you with comprehensive and reliable life insurance solutions. Our team of experienced professionals works tirelessly to ensure the security and peace of mind of our clients. 
            We pride ourselves on our strong values of trust, integrity, and commitment to excellence.
        </p>
    </div>
    <div class="about-us-image">
        <img src={AboutUs} alt="Our Team" class="about-us-img"/>
    </div>
</div>

        </>
    );
};

export default Home;
