import React, { useEffect, useState } from 'react';
import {
    IonContent,
    IonPage
} from '@ionic/react';
import {useDispatch, useSelector} from "react-redux"
import './Redactor.scss'

import {GridForRedactoring} from "components/Grid/GridForRedactoring";

import back from "images/backGreen.svg";
import newClient from "images/Component 17.svg";
import retakePhoto from "images/Component 16.svg";
import editPoints from "images/Component 15.svg";

import {useHistory} from "react-router";
import { RootState } from '../../store/store';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { rerenderResults, setResultSideNumber } from 'store/slices/app';
import save from 'images/icons/log-in.svg'


const Redactor: React.FC = () => {

    const history = useHistory()
    const dispatch = useDispatch()
    const resultSideNumber = useSelector((state: RootState) => state.app.resultSideNumber)//0-front, 1-right, 2-back, 3-left
    const sideNames = ['Front', 'Right' ,'Back', 'Left']

    const ImageFront = useSelector((state: RootState) => state.sessions.session.images.front)
    const ImageRight = useSelector((state: RootState) => state.sessions.session.images.right)
    const ImageBack = useSelector((state: RootState) => state.sessions.session.images.back)
    const ImageLeft = useSelector((state: RootState) => state.sessions.session.images.left)

    return (
        <IonPage>
            <IonContent fullscreen className='redactor-container'>
                <div className='redactor-header' onClick={() => {
                        history.goBack()
                    }}>
                    
                    <div className='buttBack' >
                        <img src={back} alt=""/>
                    </div>

                    {!!(resultSideNumber >= 0) && <p className='result-header__text'>{sideNames[resultSideNumber]}</p>}

                    {/* <div className='buttSave' >
                        <img src={save} alt=""/>
                    </div> */}
                </div>

                {resultSideNumber === 0 && <GridForRedactoring resultSideNumber={resultSideNumber} image={ImageFront}/>}
                {resultSideNumber === 1 && <GridForRedactoring resultSideNumber={resultSideNumber} image={ImageRight}/>}
                {resultSideNumber === 2 && <GridForRedactoring resultSideNumber={resultSideNumber} image={ImageBack}/>}
                {resultSideNumber === 3 && <GridForRedactoring resultSideNumber={resultSideNumber} image={ImageLeft}/>}

                <div id='lens'>
                    <div id='crosshair'></div>
                </div>

                <div className='redactor-bottom'>
                    <button onClick={() => dispatch(rerenderResults(true))}>SAVE POINTS</button>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Redactor;


