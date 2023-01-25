import {
    IonContent,
    IonPage,
    IonButton, useIonAlert
} from '@ionic/react';

import { useHistory } from "react-router";

import back from "images/back.svg";

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

import { setResultSideNumber, setIsLoading, setIsRetakeOnePhoto, startCamera, stopCamera, setIsReading } from "store/slices/app";
import { filterSessionsByClient, saveSessionToLocal } from "store/slices/sessions";
import './Results.scss'
import { useDispatch, useSelector } from 'react-redux';


const Results = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const images = useSelector((state) => state.sessions.images)
    const isReading = useSelector((state) => state.app.isReading)
    const client = useSelector((state) => state.clients.client)
    const sides = ['front', 'right', 'back', 'left']

    const emptyFrames = [frame1, frame2, frame3, frame4]
    const goodFrames = [goodPhotoFront, goodPhotoRight, goodPhotoBack, goodPhotoLeft]
    const badFrames = [badPhotoFront, badPhotoRight, badPhotoBack, badPhotoLeft]

    const verySmartSorting = (n) => {
        //change order 0-1-2-3 to 0-2-1-3
        if (n === 2) return 1
        else if (n === 1) return 2
        else return n
    }

    return (
        <IonPage>
            <IonContent fullscreen className='content'>
                <div className='results-content-inner'>
                    <h3 className='results-text'>{client.name}</h3>
                    <button className='buttBack' onClick={() => {
                        if (isReading) {
                            history.push("/client")

                        } else {
                            history.goBack()
                        }

                        dispatch(setResultSideNumber(0))
                        dispatch(setIsLoading(true))
                        dispatch(setIsReading(false))
                    }}>
                        <img src={back} alt="" />
                    </button>
                </div>

                <ul className='frameList'>
                    {sides.map((name, index) => (
                        <li
                            className='frameList-li'
                            key={index}
                            onClick={() => {
                                if (!isReading || images[sides[verySmartSorting(index)]].status === true) {
                                    if (images && images[sides[verySmartSorting(index)]]
                                        && images[sides[verySmartSorting(index)]].path
                                        && images[sides[verySmartSorting(index)]].status
                                    ) {
                                        history.push("/result");
                                        dispatch(setResultSideNumber(verySmartSorting(index)))
                                        dispatch(setIsLoading(false))
                                    } else {
                                        history.push("/camera");
                                        dispatch(setResultSideNumber(verySmartSorting(index)))
                                        dispatch(setIsRetakeOnePhoto(true))
                                        dispatch(setIsLoading(true))
                                    }
                                }
                            }}
                        >
                            {images[sides[verySmartSorting(index)]].status === true && <img className='frameList-li-image good' src={goodFrames[verySmartSorting(index)]}></img>}
                            {!isReading && images[sides[verySmartSorting(index)]].status === false && <img className='frameList-li-image bad' src={badFrames[verySmartSorting(index)]}></img>}
                            {!isReading && images[sides[verySmartSorting(index)]].status === null && <img className='frameList-li-image empty' src={emptyFrames[verySmartSorting(index)]}></img>}
                        </li>
                    )
                    )}
                </ul>



                <div className='results-bottom'>
                    {!isReading && <>
                        {(
                            images.front.status ||
                            images.back.status ||
                            images.left.status ||
                            images.right.status
                        ) && <IonButton
                            fill="clear" expand="block" shape="round"
                            className='results-button save'
                            onClick={() => {
                                dispatch(saveSessionToLocal({ clientId: client.id, data: images }))
                                dispatch(setResultSideNumber(0))
                                dispatch(setIsLoading(true))
                                dispatch(filterSessionsByClient(client.id))
                                history.push("/sessions")
                            }}
                        >
                                <p className='results-button-text'>SAVE AND BACK</p>
                            </IonButton>}
                        <IonButton
                            fill="clear" expand="block" shape="round"
                            className='results-button clear'

                            onClick={() => {
                                dispatch(setResultSideNumber(0))
                                dispatch(setIsLoading(true))
                                history.push("/client")
                            }}
                        >
                            <p className='results-button-text'>EXIT WITHOUT SAVE</p>
                        </IonButton>
                    </>}
                </div>
            </IonContent>
        </IonPage >
    );
};

export default Results;


