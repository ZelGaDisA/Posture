import './Discriptions.scss'
import {IonContent,IonPage,useIonAlert} from '@ionic/react';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { RootState } from 'store/store';
import { findAngle } from 'functions/findAngle';

import back from "images/backGreen.svg";
import textIcon from "images/textIcon.svg";

import trash from 'images/icons/trash-2.svg'
import { useEffect, useState } from 'react';
import { Image,Images} from 'store/types';



const DIscriptions = () => {
    //HOOKS
    const history = useHistory();

    //SLICES
    const clientInfo = useSelector((state:RootState) => state.clients.client)
    const session = useSelector((state:RootState) => state.sessions.session)
    const sessions = useSelector((state:RootState) => state.sessions.sessions)
    const [result, setResult] = useState<any| null>(null)
    
    useEffect(() => {
        if(session && sessions) {
            let angles = [0,1,2,3].map((i) => findAngle([session], sessions, i));

            let newResult = {
                //@ts-ignore
                ears: getMax(angles[0].ears.before, angles[2].ears.before),
                //@ts-ignore
                ankles: getMax(angles[0].ankles.before, angles[2].ankles.before),
                //@ts-ignore
                shoulders: getMax(angles[0].shoulders.before, angles[2].shoulders.before),
                //@ts-ignore
                hips: getMax(angles[0].hips.before, angles[2].hips.before),
            }


            setResult(newResult)
        }
    }, [session, sessions])

    const getMax = (a:any,b:any) =>{
        return a > b ? a : b
    }

    const getDiscription = (angle: any) => {
        
        const soBadText = (a: number) => {
            if(a > 5) {
                if(a > 7 && a < 15){
                    return "A little bad."
                }else 
                if(a >= 15){
                    return "Are you alive?"
                }
            } else {
                return "No deviations detected."
            }
        }
        if(typeof angle === 'number'){
            return <p><span className={angle > 5 ? "bad" : "good"}>{angle}°</span> : {soBadText(Math.abs(angle))}</p>
        }
        return <p>error angle</p>
    }
    return (
        <IonPage>
            <IonContent fullscreen className='client-IonContent'>

                <div className='client-header' >
                    <button className='buttBack' onClick={() => {
                        history.goBack()
                    }}>
                        <img src={back} alt=""/>
                    </button>

                    <h3 className='client-header-text'>Discription</h3>
                    <div className='client-header-more' onClick={() => {}}>
                        <img src={textIcon} alt="" />
                    </div>
                </div>

                {result !== null && <div className='discription'>
                    <div className='discription-part'>
                        <p>Ears:</p>
                        {getDiscription(result.ears)}
                    </div>
                    <div className='discription-part'>
                        <p>Ankles:</p>
                        {getDiscription(result.ankles)}
                    </div>
                    <div className='discription-part'>
                        <p>Shoulders:</p>
                        {getDiscription(result.shoulders)}
                    </div>
                    <div className='discription-part'>
                        <p>Hips:</p>
                        {getDiscription(result.hips)}
                    </div>
                </div>}

                <p className='disclamer'>*These recommendations are not a diagnosis and should be correctly interpreted by your doctor according to clinical and laboratory data and other diagnostic procedures.</p>

            </IonContent>
        </IonPage>
    );
};

export default DIscriptions;