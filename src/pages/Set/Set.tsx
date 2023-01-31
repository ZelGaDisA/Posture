import {
    IonContent,
    IonPage,
    useIonAlert,
    IonButton,
    IonCard,
    IonVirtualScroll,
} from '@ionic/react';

import { useEffect,useState,useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonItem, IonList, IonSearchbar, IonHeader, IonTextarea}  from '@ionic/react';
import { Virtuoso } from 'react-virtuoso';

import {useHistory} from "react-router";

import './Set.scss'


import time from 'images/time.svg'
import repeat from 'images/repeat.svg'
import back from "images/backGreen.svg";
import editNote from 'images/editMessage.svg'
import textIcon from "images/textIcon.svg";

import { Browser } from '@capacitor/browser';
import { RootState } from 'store/store';

interface exercise {
    part: string,
    names: string[],
    repeats: number
}

const Set = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const deviationAngles = useSelector((state:RootState)=>state.app.deviationAngles)
    const [exercises, setExercises] = useState<exercise[]>([])

    useEffect(()=>{
        let newExercises:exercise[] = []

        if(deviationAngles){
            if(Math.abs(deviationAngles.ears) >= 6 && Math.abs(deviationAngles.ears) < 90){
                newExercises.push({
                    part: "Neck",
                    names : ["Shrugs seated", "Head tilts Ir seated"],
                    repeats: Math.abs(deviationAngles.ears) > 9 ? 2 : 1,
                })
            }
            if(Math.abs(deviationAngles.shoulders) >= 6 && Math.abs(deviationAngles.shoulders) < 90){
                newExercises.push({
                    part: "Shoulders",
                    names : ["Shoulder rotation seated", "Prayer push seated"],
                    repeats: Math.abs(deviationAngles.shoulders) > 9 ? 2 : 1,
                })
                newExercises.push({
                    part: "Arm",
                    names : ["Side arm raises", " Overhead shoulder stretch seated"],
                    repeats: 1,
                })
            }
            if(Math.abs(deviationAngles.hips) >= 6 && Math.abs(deviationAngles.hips) < 90){
                newExercises.push({
                    part: "Legs",
                    names : ["Good morning", "March in place"],
                    repeats: Math.abs(deviationAngles.hips) > 9 ? 2 : 1,
                })
            }
            if(Math.abs(deviationAngles.ankles) >= 6 && Math.abs(deviationAngles.ankles) < 90){
                newExercises.push({
                    part: "Neck",
                    names : ["Shrugs seated", "Head tilts Ir seated"],
                    repeats: Math.abs(deviationAngles.hips) > 9 ? 2 : 1,
                })
            }
            setExercises(newExercises)
        }
    },[deviationAngles])

    const openBrowser = async () => {
        await Browser.open({ url: 'https://healthuapp.com/' });
    };
    


    return (
        <IonPage>
            <IonHeader>
                <div className='set-header' >
                    <button className='buttBack' onClick={() => {
                        history.goBack()
                    }}>
                        <img src={back} alt=""/>
                    </button>

                    <h3 className='set-header-text'>Set of exercises</h3>
                </div>
            </IonHeader>

            <IonContent className='Set-IonContent'>
                <div className='scroll'>
                    {exercises.map((ex:exercise, i)=>(
                        <div className='set'>
                            <h3>{ex.part}</h3>

                            <div>
                                {ex.names.map((name:string)=><p className='set__exerciseName'>{name}</p>)}
                            </div>

                            
                            <div className='set__iconBox'>
                                <div className='set__iconBox-repeat'>
                                    <img src={repeat} alt="" />
                                    <p>Repeats: {ex.repeats}</p>
                                </div>
                                <div className='set__iconBox-time'>
                                    <img src={time} alt="" />
                                    <p>Use a set 2 times a day</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className='browser-box'>
                        {exercises.length > 0 
                        ?   <>
                                <h3 className='text'>To get started, follow the link</h3>
                                <p className='link' onClick={openBrowser}>https://healthuapp.com/</p>
                            </>
                        :
                            <>
                                <h3 className='text'>Do you need medical help</h3>
                                <p className='link' onClick={openBrowser}>https://healthuapp.com/</p>
                            </>}
                    </div>

                    <p className='set__bottomText'>*These recommendations are not a diagnosis and should be correctly interpreted by your doctor according to clinical and laboratory data and other diagnostic procedures.</p>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Set;


