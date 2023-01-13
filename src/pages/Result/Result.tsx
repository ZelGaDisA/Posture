import React, { useEffect, useState } from 'react';
import {
    IonContent,
    IonPage,
    IonButton,
    useIonAlert
} from '@ionic/react';
import {useDispatch, useSelector} from "react-redux"
import './Result.scss'

import {GridForResults}from "components/Grid/GridForResults";


import back from "images/backGreen.svg";
import save from 'images/icons/log-in.svg'
import newClient from "images/Component 17.svg";
import retakePhoto from "images/Component 16.svg";
import editPoints from "images/Component 15.svg";

import {useHistory} from "react-router";
import { RootState } from 'store/store';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { setResultSideNumber,setIsRetakeOnePhoto,setIsLoading } from 'store/slices/app';
    

import {Screenshot} from "@ionic-native/screenshot";



const Results: React.FC = () => {

    const history = useHistory()
    const dispatch = useDispatch()

    const resultSideNumber = useSelector((state: RootState) => state.app.resultSideNumber)//0-front, 1-right, 2-back, 3-left
    const sideNames = ['Front side' ,'Back side', 'Right side' , 'Left side']
    const images = useSelector((state: RootState) => state.sessions.images)//0-front, 1-right, 2-back, 3-left
    const isReading = useSelector((state: RootState) => state.app.isReading)
    const [slide,setSlide] = useState(0)
    const rerenderCounter = useSelector((state: RootState) => state.app.rerenderCounter);
    const [presentAlert] = useIonAlert();

    useEffect(()=>{
        if(isReading){
            let bottom = document.getElementsByClassName('swiper-pagination-horizontal')[0]
            bottom.className = bottom.className + 'isReading'
        }
    },[isReading])


    const stupidSorting = (n: number) => {
        //0-1-2-3 to 0-2-1-3
        if(n === 2) return 1
        else if (n === 1) return 2
        else return n
    }
    
    const goToRedactoring = () => {
        history.push("/redactor");
    }
    const goToRetakePhoto = () => {
        dispatch(setIsRetakeOnePhoto(true))
        dispatch(setIsLoading(true))
        history.push("/camera");
    }

    
    return (
        <IonPage>
            <IonContent fullscreen className='result-container'>

                {/* <Grid/>  */}
                <div className='result-header' >

                    <div className='buttBack' onClick={() => {
                        history.goBack()
                    }}>
                        <img src={back} alt=""/>
                    </div>

                    {!!(resultSideNumber >= 0) && <p className='result-header__text'>{sideNames[stupidSorting(resultSideNumber)]}</p>}
                </div>

                {(rerenderCounter >= 0) && <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    rewind = {true}
                    initialSlide={resultSideNumber}
                    onSlideChange={(swiper) => {
                        setSlide(swiper.realIndex)
                        console.log('====================================');
                        console.log(swiper.realIndex);
                        console.log('====================================');
                        dispatch(setResultSideNumber(stupidSorting(swiper.realIndex - 1)))
                    }}
                    >   {
                            Object.entries(images)?.map(([name, image],index) => {
                                return image?.status && <SwiperSlide virtualIndex={index} key={name}>
                                            <div className='safeLayout' />
                                            <GridForResults  rerenderCounter={rerenderCounter} resultSideNumber={resultSideNumber} image={image}/>
                                        </SwiperSlide>
                            })
                        }
                </Swiper>}


                {!isReading && <div className='result-bottom'>
                            <div
                                className="img" 
                                
                                onClick={() =>
                                    presentAlert({
                                        header: 'Scan new client',
                                        message: "This will delete results of scanning.Are you sure?",
                                        buttons: [
                                        {
                                            text: 'CANCEL',
                                            role: 'cancel',
                                            handler: () => {
                                            },
                                        },
                                        {
                                            text: 'CLEAR',
                                            role: 'confirm',
                                            handler: () => {
                                                dispatch(setResultSideNumber(0))
                                                dispatch(setIsLoading(true))
                                                history.push("/home")
                                            },
                                        },
                                        ]
                                    })
                                }
                            >
                                <img src={newClient} alt="" />
                            </div>

                            <div className="img" onClick={goToRetakePhoto}>
                                <img src={retakePhoto} alt="" />
                            </div>
                            
                            <div className="img" onClick={goToRedactoring}>
                                <img src={editPoints} alt="" />
                            </div>

                            
                </div>}
            </IonContent>
        </IonPage>
    );
};

export default Results;


