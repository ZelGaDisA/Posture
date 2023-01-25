//import
import './Onboarding.scss';

import { useEffect, useState, useRef } from "react";
import { IonContent, IonPage, IonButton, useIonAlert } from "@ionic/react";
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';


//REDUX
import { useDispatch, useSelector } from "react-redux";
import { disableOnboarding, setIsLoading, setIsReading, setIsRetakeOnePhoto, setResultSideNumber } from "store/slices/app";
import { addImage } from "store/slices/sessions";

import Slide1 from "images/slides/slideX2_1.png";
import Slide2 from "images/slides/slideX2_2.png";
import Slide3 from "images/slides/slideX2_3.png";

//IMAGES
import {ReactComponent as CircleButton} from "images/roundGreenButton.svg";
import { useHistory } from 'react-router';
import { RootState } from 'store/store';



export default function Onboarding() {
    const history = useHistory()
    const dispatch = useDispatch()
    const nextSlideRef = useRef(null)
    const swiper = useSwiper()
    const [slide, setSlide] = useState(0)
    const clients = useSelector((state:RootState) => state.clients.clients)

    useEffect(()=>{        
        let onboarding = localStorage.getItem("onboarding")
        if(onboarding || onboarding === "true"){
            history?.push('/home')
        }else {
           console.log('====================================');
           console.log(onboarding);
           console.log('====================================');
        }
    },[clients])

    return (
        <IonPage>
            <IonContent fullscreen id="content">
                <Swiper
                    className='onboard'
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    spaceBetween={1}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    navigation={{ nextEl: ".next"}}
                    rewind = {true}
                    initialSlide={0}
                    onSlideChange={(swiper) => {
                        setSlide(swiper.realIndex)
                    }}
                    >   
                        [
                            <SwiperSlide key={0} virtualIndex={1} className="onboard__slide first">
                                <img src={Slide1}/>
                            </SwiperSlide>,

                            <SwiperSlide key={1} virtualIndex={2} className="onboard__slide second">
                                <img src={Slide2}/>
                            </SwiperSlide>,

                            <SwiperSlide key={2} virtualIndex={3} className="onboard__slide third">
                                <img src={Slide3}/>
                            </SwiperSlide>
                        ]
                </Swiper>

                <div  className='home-bottom__onboarding'>
                    {slide < 3 &&  <button className='next popup' ref={nextSlideRef}>
                                <p className='text'>NEXT</p>
                            </button>
                    }
                    {slide === 3 && <button className='home-button__onboarding popup' ref={nextSlideRef} onClick={()=>{
                        history.push("/home")
                        localStorage.setItem('onboarding',"true")
                    }}>
                                <p className='text'>START</p>
                            </button>}
                </div>
            </IonContent>
        </IonPage>
    )
}



