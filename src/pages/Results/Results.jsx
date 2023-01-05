import {useEffect, useState, useRef} from 'react';
import {
    IonContent,
    IonPage,
    IonButton, useIonAlert
} from '@ionic/react';



import {useHistory} from "react-router";

import frame1 from 'images/resultCards/Type=Front, State=Take photo.svg'
import frame2 from 'images/resultCards/Type=Right, State=Take photo.svg'
import frame3 from 'images/resultCards/Type=Back, State=Take photo.svg'
import frame4 from 'images/resultCards/Type=Left, State=Take photo.svg'

import goodPhotoFront from 'images/resultCards/Type=Front, State=View.svg'
import goodPhotoRight from 'images/resultCards/Type=Right, State=View.svg'
import goodPhotoBack from 'images/resultCards/Type=Back, State=View.svg'
import goodPhotoLeft from 'images/resultCards/Type=Left, State=View.svg'

import badPhotoFront from 'images/resultCards/Type=Front, State=Retake photo.svg'
import badPhotoRight from 'images/resultCards/Type=Right, State=Retake photo.svg'
import badPhotoBack from 'images/resultCards/Type=Back, State=Retake photo.svg'
import badPhotoLeft from 'images/resultCards/Type=Left, State=Retake photo.svg'

import {setResultSideNumber, setIsLoading,setIsRetakeOnePhoto, startCamera, stopCamera} from "store/slices/app";
import { saveSessionToLocal } from "store/slices/sessions";
import './Results.scss'
import { useDispatch, useSelector} from 'react-redux';


const Results = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const images = useSelector((state) => state.sessions.session.images)
    const sides = ['front', 'right', 'back', 'left']
    const client = useSelector((state) => state.clients.client)


    const emptyFrames = [frame1, frame2, frame3, frame4]
    const goodFrames = [goodPhotoFront, goodPhotoRight, goodPhotoBack, goodPhotoLeft]
    const badFrames = [badPhotoFront, badPhotoRight, badPhotoBack, badPhotoLeft]

    const [presentAlert] = useIonAlert();

    const stupidSorting = (n) => {
        //0-1-2-3 to 0-2-1-3
        if(n === 2) return 1
        else if (n === 1) return 2
        else return n
    }

    const selectResult = async (id) => {
        if(images && images[sides[id]] && images[sides[id]].path && images[sides[id]].status) {

            dispatch(setResultSideNumber(stupidSorting(id)))
            history.push("/result")

        }else{
            console.log(`image ${id} is empty`);
        }
    
    }

    return (
        <IonPage>
            <IonContent fullscreen className='content'>
                <div className='content-inner'>
                    <h3 className='results-text'>My patient</h3>
                </div>

                <ul className='frameList'>
                    {sides.map((name, index)=>(
                        <li 
                            className='frameList-li'
                            key={stupidSorting(index)} 
                            onClick={()=> {
                                if (images[sides[stupidSorting(index)]].status) {
                                    selectResult(stupidSorting(index))
                                    //stop capture
                                    dispatch(setResultSideNumber(stupidSorting(index)))
                                    dispatch(setIsLoading(false))
                                    // dispatch(stopCamera())
                                }else{
                                    history.push("/camera");
                                    dispatch(setResultSideNumber(stupidSorting(index)))
                                    dispatch(setIsRetakeOnePhoto(true))
                                    //start capture
                                    dispatch(setIsLoading(true))
                                }
                            }}
                        >   
                            {images[sides[stupidSorting(index)]].status === true && <img className='frameList-li-image good' src={goodFrames[stupidSorting(index)]}></img>}
                            {images[sides[stupidSorting(index)]].status === false && <img className='frameList-li-image bad' src={badFrames[stupidSorting(index)]}></img>}
                            {images[sides[stupidSorting(index)]].status === null && <img className='frameList-li-image empty' src={emptyFrames[stupidSorting(index)]}></img>}
                        </li>
                    ))}
                </ul>

                <div className='results-bottom'>
                    
                    <IonButton
                        fill="clear" expand="block" shape="round"
                        className='results-button save'
                        onClick={() => {
                            dispatch(saveSessionToLocal({clientId:client.id, data:images}))
                            dispatch(setResultSideNumber(0))
                            dispatch(setIsLoading(true))
                            history.push("/home")
                        }}
                    >
                        <p className='results-button-text'>SAVE AND BACK</p>
                    </IonButton>
                    <IonButton
                        fill="clear" expand="block" shape="round"
                        className='results-button clear'
                        
                        onClick={() =>
                            {
                                dispatch(setResultSideNumber(0))
                                dispatch(setIsLoading(true))
                                history.push("/home")
                            }
                            // presentAlert({
                            //     header: 'Clear photo',
                            //     message: "This will not save photo. Are you sure?",
                            //     buttons: [
                            //     {
                            //         text: 'CANCEL',
                            //         role: 'cancel',
                            //     },
                            //     {
                            //         text: 'CLEAR',
                            //         role: 'confirm',
                            //         handler: () => {
                            //             dispatch(setResultSideNumber(0))
                            //             dispatch(setIsLoading(true))
                            //             history.push("/home")
                            //         },
                            //     },
                            //     ]
                            // })
                        }
                    >
                        <p className='results-button-text'>EXIT WITHOUT SAVE</p>
                    </IonButton>

                </div>


            </IonContent>
        </IonPage>
    );
};

export default Results;


