import './Descriptions.scss'
import {IonContent,IonPage,IonCard, IonTextarea} from '@ionic/react';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { RootState } from 'store/store';
import { findAngle } from 'functions/findAngle';

import back from "images/backGreen.svg";
import textIcon from "images/textIcon.svg";

import trash from 'images/icons/trash-2.svg'
import { useEffect, useState } from 'react';
import {pushToLocalNote} from "store/slices/sessions"
import {setDeviationAngles} from "store/slices/app"



const Descriptions = () => {
    //HOOKS
    const history = useHistory();
    const dispatch = useDispatch();

    //SLICES

    const session = useSelector((state:RootState) => state.sessions.session)
    const sessions = useSelector((state:RootState) => state.sessions.sessions)
    const [result, setResult] = useState<any| null>(null)
    const [isOpenForm, setIsOpenForm] = useState<boolean>(false)
    const [note, setNote] = useState<null|undefined|string>("")

    useEffect(() => {
        if(session && sessions) {
            let angles = [0,1,2,3].map((i) => findAngle([session], sessions, i));
            
            let newResult = {
                //@ts-ignore
                ears: getMax(angles[0].ears.before, angles[2].ears.before),
                //@ts-ignore
                ankles: getMax(angles[1].ankles.before, angles[3].ankles.before),
                //@ts-ignore
                shoulders: getMax(angles[0].shoulders.before, angles[2].shoulders.before),
                //@ts-ignore
                hips: getMax(angles[0].hips.before, angles[2].hips.before),
            }
            
            console.log(angles[1]?.ankles.before);
            console.log(angles[3]?.ankles.before);
            
            setResult(newResult)
            dispatch(setDeviationAngles(newResult))
        }

    }, [session, sessions])

    const getMax = (a:any,b:any) =>{
        return Math.abs(a) > Math.abs(b) ? a : b
    }

    const getDescription = (angle: any, position: number) => {
        let text = ""

        if(Math.abs(angle) < 6){
            text = "No diviations detected"
        }else if (Math.abs(angle) < 9) {
            if(position === 0) text = "You have a slight tilt of the head to the side (incorrect head position)."
            if(position === 1) text = "You have a slight tilt of the head forward (\"computer neck\")."
            if(position === 2) text = "You have a slight asymmetry of the shoulder (incorrect position of the shoulders)."
            if(position === 3) text = "You have a slight pelvic asymmetry (incorrect pelvic position)."
        }else if (Math.abs(angle) < 14) {
            if(position === 0) text = " You have a moderate tilt of the head to the side (incorrect head position)."
            if(position === 1) text = "You have a moderate tilt of the head forward (\"computer neck\")."
            if(position === 2) text = "You have a moderate  asymmetry of the shoulder (incorrect position of the shoulders)."
            if(position === 3) text = "You have a moderate pelvic asymmetry (incorrect pelvic position)."
        }else {
            if(position === 0) text = "You have a significant tilt of the head to the side (incorrect head position)."
            if(position === 1) text = "You have a significant tilt of the head forward (\"computer neck\")."
            if(position === 2) text = "You have a  significane asymmetry of the shoulder (incorrect position of the shoulders)."
            if(position === 3) text = "You have a significant pelvic asymmetry (incorrect pelvic position)."
        }

        if(typeof angle === 'number'){
            return <p className='paragraph'><span className={Math.abs(angle) > 6 ? "bad" : "good"}>{angle}°</span> : {text}</p>
        }
        return <p>error angle</p>
    }

    const saveNote = () => {
        let newNote = note
        if(typeof note === "string" && note.length > 0) {
            newNote && dispatch(pushToLocalNote({sessionId: session.id, note: newNote}))
            setNote("")
            history.push('/notes')
        }
        setIsOpenForm(false);
    }
    const removeNote = () => {
        localStorage.removeItem(`N-${session.id}`)
        setIsOpenForm(false)
        setNote('')
    }
    return (
        <IonPage>
            <IonContent className='descriptions-IonContent'>
                <div className='description-header' >
                    <button className='buttBack' onClick={() => {
                        history.goBack()
                    }}>
                        <img src={back} alt=""/>
                    </button>

                    <h3 className='description-header-text'>Description</h3>
                    <div className='description-header-more'>
                        <button className='description-header-more__button' onClick={() => {history.push("/notes")}}>
                            <img src={textIcon} alt="" />
                        </button>
                    </div>
                </div>
                <div className='descriptions-IonContent__ScrollBox'>
                    {result && <div className='description'>
                        <div className='description-part'>
                            <p className='angleName'>Ears:</p>
                            {getDescription(result.ears, 0)}
                        </div>
                        <div className='description-part'>
                            <p className='angleName'>Angle of incidence:</p>
                            {getDescription(result.ankles, 1)}
                        </div>
                        <div className='description-part'>
                            <p className='angleName'>Shoulders:</p>
                            {getDescription(result.shoulders, 2)}
                        </div>
                        <div className='description-part'>
                            <p className='angleName'>Hips:</p>
                            {getDescription(result.hips, 3)}
                        </div>
                    </div>}

                    <p className='disclamer'>*These recommendations are not a diagnosis and should be correctly interpreted by your doctor according to clinical and laboratory data and other diagnostic procedures.</p>

                    {!isOpenForm && <div className='description_buttons'>
                        <button className='add' onClick={()=> {
                            setIsOpenForm(true)
                            let oldNote = localStorage.getItem(`N-${session.id}`)
                            oldNote && setNote(oldNote)
                        }}>{localStorage.getItem(`N-${session.id}`) ? "SHOW NOTE" : "ADD NOTE"}</button>
                        <button className='how' onClick={()=>{history.push("/set")}}>HOW TO IMPROVE</button>
                    </div>}

                </div>
            </IonContent>

            {!!isOpenForm && 
                <div className='description__ion-card' >
                    <div className='description__ion-card-back' onClick={()=>{setIsOpenForm(false)}}/>
                    <IonCard className="description__ion-card-form">
                        <div className='description__ion-card-form__iconBox'>
                            <button onClick={()=> {
                                removeNote()
                            }}>
                                <img className='description__ion-card-form__iconBox-icon'src={trash}></img>
                            </button>
                            {note && note.length> 0 && note.length < 2414 &&  <p className='description__ion-card-form__iconBox-lengtgh-text'>Length: {note.length} of 2414</p>}
                            {note && note.length >= 2414 && <p className='description__ion-card-form__iconBox-text'>Max length is 2414</p>}
                        </div>
                        
                        <IonTextarea
                            placeholder="Type Note here"
                            autoGrow={true}
                            value={note}
                            maxlength={2414}
                            wrap="hard"
                            className='custom-textarea'
                            onIonChange={(e)=>{
                                setNote(e.detail.value)
                            }}
                        ></IonTextarea>

                        <button onClick={()=>{
                            saveNote()
                        }}  className="email-button">
                            SAVE
                        </button>
                    </IonCard>
                </div>
            }
        </IonPage>
    );
};

export default Descriptions;