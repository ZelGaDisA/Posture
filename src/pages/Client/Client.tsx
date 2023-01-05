import './Client.scss'
import {IonContent,IonPage,useIonAlert,IonButton,IonFab,IonToolbar,IonTitle,IonList,IonCheckbox,IonItem,IonLabel
} from '@ionic/react';
import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { RootState } from 'store/store';
import { Client } from 'store/slices/clients';
import { Session, setSelectedSession, setSession,clearSessions} from 'store/slices/sessions';
import { setResultSideNumber } from "store/slices/app";
import { Images,CGPoint } from 'store/types';

import back from "images/backGreen.svg";
import save from 'images/icons/log-in.svg'
import trash from 'images/icons/trash-2.svg'

import greenFrontMan from 'images/greenFrontMan.svg';
import greenLeftMan from 'images/greenLeftMan.svg';
import greenRightMan from 'images/greenRightMan.svg';

import blackFrontMan from 'images/frontSVG.svg';
import blackLeftMan from 'images/leftSVG.svg';
import blackRightMan from 'images/rightSVG.svg';

import alertTriangle from '../../images/alert-triangle.svg';
import checkCircle from '../../images/check-circle.svg';
import { getCoords } from 'functions/getCoords';

const ClientPage = () => {
    //HOOKS
    const history = useHistory();
    const dispatch = useDispatch();

    //SLICES
    const clientInfo = useSelector((state:RootState) => state.clients.client)
    const sessions = useSelector((state:RootState) => state.sessions.sessions)
    const images = useSelector((state:RootState) => state.sessions.session.images)
    const selectedSessions = useSelector((state:RootState) => state.sessions.selectedSessions)

    //STATES
    const [selectedCardIndex, setSelectedCardIndex] = useState(-1)
    const [comparisonResult, setComparisonResults] = useState<any>(null)

    //CONSTANTES
    const sides = ['front', 'right', 'back', 'left']
    const blackMan = [blackFrontMan,  blackRightMan, blackFrontMan, blackLeftMan]
    const greenMan = [greenFrontMan,  greenRightMan, greenFrontMan, greenLeftMan]

    //FUNCTIONS
    const deleteSession = (s:Session) => {
        console.log(s);
    }
    useEffect(()=>{
        selectedSessions.length === 2 
        ? findAngle(selectedSessions, selectedCardIndex)
        : setComparisonResults(null)
    },[selectedSessions])

    const findAngle = (selectedSessions: Session[], sideNumber:number)=>{
        
        let images:Images[] = selectedSessions.slice().sort((a,b) => a.id - b.id).map(s => s.images)
        let coords: any;
        
        switch (sideNumber) {
            case 0:
                coords = images.map(i => !!(i && i.front && i.front.landmarks) && getCoords(i.front.landmarks, 0))
                break;
            case 1:
                coords = images.map(i => !!(i && i.right && i.right.landmarks) && getCoords(i.right.landmarks, 1))
                break;
            case 2:
                coords = images.map(i => !!(i && i.back && i.back.landmarks) && getCoords(i.back.landmarks, 2))
                break;
            case 3:
                coords = images.map(i => !!(i && i.left && i.left.landmarks) && getCoords(i.left.landmarks, 3))
                break;
            default:
                break;
        }

        if(coords && coords.length === 2){
            let a = coords[0]
            let b = coords[1]
            
            const toGradus = (radian: number) => {
                return Math.floor((radian * (180/Math.PI)) * 100) / 100
            }

            let result = {
                ears: {
                    before: toGradus(a.ears.angle),
                    after: toGradus(b.ears.angle),
                    comparison: toGradus(a.ears.angle - b.ears.angle)
                },
                shoulders: {
                    before: toGradus(a.shoulders.angle),
                    after: toGradus(b.shoulders.angle),
                    comparison: toGradus(a.shoulders.angle - b.shoulders.angle)
                },
                hips: {
                    before: toGradus(a.hips.angle),
                    after: toGradus(b.hips.angle),
                    comparison: toGradus(a.hips.angle - b.hips.angle)
                },
                ankles: {
                    before: toGradus(a.ankles.angle),
                    after: toGradus(b.ankles.angle),
                    comparison: toGradus(a.ankles.angle - b.ankles.angle)
                }
            }

            setComparisonResults(result)
        }
        
    }

    const goToSession = (s:Session) => {
        dispatch(setSession(s))

        if(selectedCardIndex >= 0){
            dispatch(setResultSideNumber(selectedCardIndex))
            history.push('/result')
        }else{
            dispatch(setResultSideNumber(0))
            history.push('/results')
        }
    }

    const getDateTime = (time: number) => {
        let date = new Date(time)
        return `${date.toLocaleDateString("en-US")}, ${date.toLocaleTimeString()}`
    }

    const selectSession = (session:Session) => {
        dispatch(setSelectedSession(session))
    }

    return (
        <IonPage>
            <IonContent fullscreen className='client-IonContent'>
                <div className='client-header' >

                    <div className='buttBack' onClick={() => {
                        history.goBack()
                        dispatch(clearSessions())
                    }}>
                        <img src={back} alt=""/>
                    </div>

                    <h3 className='client-Header-text'>{clientInfo.name}</h3>
                </div>

                <div className='cardsBox'>
                    <ul className='cardsBox-list'>
                            <li  
                                className={"cardsBox-list-el" + (selectedCardIndex === -1 ? " selected" : "")}
                                onClick={ ()=> {
                                    setSelectedCardIndex(-1);
                                    dispatch(setSelectedSession(null))
                                    setComparisonResults(null)
                                }}
                            >   
                                <div className='blackPeople'>
                                    {blackMan.map((svg, key) => <img key={key} className="cardsBox-list-el-manIcon"src={svg} alt="" />)}
                                </div>
                                
                                <p className='blackText'>All</p>
                            </li>
                        {blackMan.map((svg,index)=>{
                            return (
                                <li
                                    key={index} 
                                    className={"cardsBox-list-el" + (selectedCardIndex === index ? " selected" : "")}
                                    onClick={ ()=> {
                                        setSelectedCardIndex(index)
                                        dispatch(setSelectedSession(null))
                                        setComparisonResults(null)
                                    }}
                                >   
                                    <img className="cardsBox-list-el-manIcon"src={svg} alt="" />
                                    <p className='blackText'>{sides[index][0].toUpperCase() + sides[index].slice(1)}</p>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className='sessionsBox'>
                    <IonList className='sessionsBox-list'>
                        {sessions.length > 0 ? sessions.map((s:Session,i)=>{
                                if (selectedCardIndex === -1){//all results
                                    //@ts-ignore
                                    if(s && s.images){
                                        return <div className='sessionsBox-list__el' key={i}>
                                            <IonLabel className='sessionsBox-list__el-Label all'
                                                onClick={()=>goToSession(s)}
                                            >{s.id ? getDateTime(s.id) : 0}</IonLabel>
                                            <div className='deleteSession-Button'>
                                                <img src={trash} alt="" onClick={()=> deleteSession(s)}/>
                                            </div>
                                        </div>
                                    }
                                } else {
                                    if (selectedSessions.length < 2) {
                                        //@ts-ignore
                                        if((s && s.images &&  s.images[sides[selectedCardIndex]].status)){
                                            return <div key={i} className='sessionsBox-list__el'>
                                            <IonCheckbox 
                                                className='sessionsBox-list__el-Checkbox'
                                                slot="start"
                                                onClick={() => selectSession(s)}
                                                checked={selectedSessions.map(i => i.id).indexOf(s.id) >= 0}
                                            ></IonCheckbox>
                                            <IonLabel className='sessionsBox-list__el-Label'
                                                onClick={()=>goToSession(s)}
                                            >{s.id ? getDateTime(s.id) : 0}</IonLabel>
                                            <div className='deleteSession-Button'>
                                                <img src={trash} alt="" onClick={()=> deleteSession(s)}/>
                                            </div>
                                            </div>
                                        }
                                    } else {
                                        if(s && selectedSessions && selectedSessions.map(i => i.id).indexOf(s.id) !== -1){
                                            return <div key={i} className='sessionsBox-list__el'>
                                                <IonCheckbox 
                                                    className='sessionsBox-list__el-Checkbox'
                                                    slot="start"
                                                    onClick={() => selectSession(s)}
                                                    checked={true}
                                                ></IonCheckbox>
                                                <IonLabel className='sessionsBox-list__el-Label'
                                                    onClick={()=>goToSession(s)}
                                                >{s.id ? getDateTime(s.id) : 0}</IonLabel>
                                                <div className='deleteSession-Button'>
                                                    <img src={trash} alt="" onClick={()=> deleteSession(s)}/>
                                                </div>
                                                </div>
                                        }
                                    }
                                }
                            })

                            : <div className='emptySessions'>
                                <p>Sessions is not found...</p>
                            </div>
                        }
                    </IonList>
                </div>

                { selectedSessions?.length === 2 && <div className="comparisonBox">
                    <div className="comparisonBox-el">
                        <p className='before'>Name</p>
                        <p className='before'>Before</p>
                        <p className='after'>After</p>
                        <p className='comparison'>Comparison</p>
                    </div>
                    <div className="comparisonBox-el">
                        <p className='name'>Ears</p>
                        <p className='before'>{comparisonResult?.ears.before}°</p>
                        <p className='after'>{comparisonResult?.ears.after}°</p>
                        <p className='comparison'>{comparisonResult?.ears.comparison}°</p>
                    </div>
                    <div className="comparisonBox-el">
                        <p className='name'>Shoulders</p>
                        <p className='before'>{comparisonResult?.shoulders.before}°</p>
                        <p className='after'>{comparisonResult?.shoulders.after}°</p>
                        <p className='comparison'>{comparisonResult?.shoulders.comparison}°</p>
                    </div>
                    <div className="comparisonBox-el">
                        <p className='name'>Hips</p>
                        <p className='before'>{comparisonResult?.hips.before}°</p>
                        <p className='after'>{comparisonResult?.hips.after}°</p>
                        <p className='comparison'>{comparisonResult?.hips.comparison}°</p>
                    </div>
                    <div className="comparisonBox-el">
                        <p className='name'>Ankles</p>
                        <p className='before'>{comparisonResult?.ankles.before}°</p>
                        <p className='after'>{comparisonResult?.ankles.after}°</p>
                        <p className='comparison'>{comparisonResult?.ankles.comparison}°</p>
                    </div>
                </div>}

            </IonContent>
        </IonPage>
    );
};

export default ClientPage;

