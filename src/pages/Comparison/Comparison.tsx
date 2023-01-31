import './Comparison.scss'
import {IonContent,IonPage,useIonAlert,IonButton,IonFab,IonToolbar,IonTitle,IonList,IonCheckbox,IonItem,IonLabel
} from '@ionic/react';
import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { RootState } from 'store/store';
import { Client, updateClients } from 'store/slices/clients';
import { Session,addNewSession, setSelectedSession, setSession, clearSessions,clearSelectedSessions} from 'store/slices/sessions';
import { setResultSideNumber, setIsReading } from "store/slices/app";
import { Images,CGPoint } from 'store/types';
import { findAngle } from 'functions/findAngle';

import back from "images/backGreen.svg";
import more from "images/icons/more-vertical.svg";
import save from 'images/icons/log-in.svg'
import trash from 'images/icons/trash-2.svg'

import greenFrontMan from 'images/greenFrontMan.svg';
import greenLeftMan from 'images/greenLeftMan.svg';
import greenRightMan from 'images/greenRightMan.svg';

import blackFrontMan from 'images/frontSVG.svg';
import blackLeftMan from 'images/leftSVG.svg';
import blackRightMan from 'images/rightSVG.svg';

interface visibleCard {
    session: Session,
    images: Images[]
}

const Comparison = () => {
    //HOOKS
    const history = useHistory();
    const dispatch = useDispatch();
    const [presentAlert] = useIonAlert();

    //SLICES
    const clients = useSelector((state:RootState) => state.clients)
    const clientInfo = useSelector((state:RootState) => state.clients.client)
    const clientId = useSelector((state:RootState) => state.clients.client.id)
    const sessions = useSelector((state:RootState) => state.sessions.sessions)
    const selectedSessions = useSelector((state:RootState) => state.sessions.selectedSessions)
    
    //STATES
    const [updater, setUpdater]  = useState(0)
    const [selectedCardIndex, setSelectedCardIndex] = useState(0)
    const [comparisonResult, setComparisonResults] = useState<any>(null)
    const [visibleCards, setVisibleCards] = useState<visibleCard[] | null>(null)

    //CONSTANTES
    const sides = ['front', 'back', 'right', 'left']
    const blackMan = [blackFrontMan,  blackFrontMan, blackRightMan, blackLeftMan]
    const greenMan = [greenFrontMan,  greenFrontMan, greenRightMan, greenLeftMan]

    //FUNCTIONS
    useEffect(()=>{
        let localstoreImages = sessions.map((s:Session)=>{
            let image = localStorage.getItem(String(s.id))
            return image && JSON.parse(image)
        })
        
        
        if(!localstoreImages || localstoreImages?.length === 0){
            setVisibleCards(null)
            return
        }

        //@ts-ignore
        const images = localstoreImages

        let imagesIds = images.map((i:Images,ind:number)=>i?.sessionId)

        let visCards = sessions.map((s:Session,i:number)=>{
            if(s && imagesIds.indexOf(s.id) !== -1){
                return {
                    session: s,
                    images: images[imagesIds.indexOf(s.id)]
                }
            }
        })

        let filtredVisCards:any = visCards.filter((vc:visibleCard|undefined) => !!vc)

        setVisibleCards(filtredVisCards)
    },[sessions, updater, selectedSessions, selectedCardIndex])
    

    useEffect(()=>{
        if(visibleCards && visibleCards?.length > 0) {
            if(selectedCardIndex > -1 && (!selectedSessions || selectedSessions.length === 0) && visibleCards && visibleCards.length > 0) {
                visibleCards.forEach((s:visibleCard|undefined) => {s && selectSession(s.session)})
            }
        }
    },[clientId, visibleCards, selectedCardIndex])

    useEffect(()=>{
        if(selectSession && selectSession.length > 0){
            console.log(selectedCardIndex);
            
            setComparisonResults(findAngle(selectedSessions, sessions, selectedCardIndex))
        }
    },[selectedSessions])

    const getDateTime = (time: number) => {
        let date = new Date(time)
        return `${date.toLocaleDateString("en-US")}, ${date.toLocaleTimeString()}`
    }

    const selectSession = (session:Session) => {
        dispatch(setSelectedSession(session))
    }

    const renderVisibleCards = () => {
        return visibleCards?.map((visCard:visibleCard, i:number)=>{
            if(!visCard?.session){return} //visibility of empty session

            const s = visCard.session
            const images = visCard.images

            if (selectedSessions.length < 2) {
                {/* @ts-ignore */}
                return s.id && images[sides[selectedCardIndex]]?.status && <div key={i} className='sessionsBox-list__el'>
                        <IonLabel className='sessionsBox-list__el-Label'>{i < 1? "Before: ": "After: "}{s.id ? getDateTime(s.id) : 0}</IonLabel>
                    </div>
            } else {
                if(s && s.id && selectedSessions && selectedSessions.map(i => i.id).indexOf(s.id) !== -1){
                    return <div key={i} className='sessionsBox-list__el'>
                        <IonLabel className='sessionsBox-list__el-Label'>{i < 1? "Before: ": "After: "}{s.id ? getDateTime(s.id) : 0}</IonLabel>
                    </div>
                }
            }
        })
    }

    return (
        <IonPage>
            <IonContent fullscreen className='client-IonContent'>

                <div className='client-header' >
                    <button className='buttBack' onClick={() => {
                        history.goBack()
                        dispatch(clearSelectedSessions())
                    }}>
                        <img src={back} alt=""/>
                    </button>

                    <h3 className='client-header-text'>{clientInfo.name}</h3>
                </div>

                <div className='cardsBox'>
                    <ul className='cardsBox-list'>
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

                <IonList className='sessionsBox-list'>
                    {visibleCards && visibleCards?.length > 0 
                        ?   <>  
                                {renderVisibleCards()}
                                {visibleCards?.length < 2 && <li className='sessionsBox-list__button'>
                                    <IonLabel className='sessionsBox-list__button-Label'
                                        onClick={()=>{
                                            clientInfo?.id && dispatch(addNewSession({clientId: clientInfo.id}))
                                            history.push('/camera')
                                        }}
                                    > +Add new session to compare</IonLabel>
                                </li>}
                            </>
                        :  <li className='sessionsBox-list__button'>
                                <IonLabel className='sessionsBox-list__button-Label'
                                    onClick={()=>{
                                        clientInfo?.id && dispatch(addNewSession({clientId: clientInfo.id}))
                                        history.push('/camera')
                                    }}
                                > +Add new session to compare</IonLabel>
                            </li>
                    }
                </IonList>

                {comparisonResult && selectedSessions?.length > 0 && <div className={"comparisonBox" + ((selectedCardIndex === 0 || selectedCardIndex === 1) ? "" : " min")}>
                    <div className="comparisonBox-el names">
                        <p className='name'>Name</p>
                        <p className='before'>Before°:</p>
                        <p className='after'>After°:</p>
                        <p className='comparison'>Comparison°:</p>
                    </div>

                    {(selectedCardIndex === 0 || selectedCardIndex === 1) && <>
                        <div className="comparisonBox-el">
                            <p className='name'>Ears</p>
                            <p className='before'>{comparisonResult?.ears.before}°</p>
                            <p className='after'>{comparisonResult?.ears.after}°</p>
                            <p className={'comparison ' + comparisonResult?.ears.color}>{comparisonResult?.ears.comparison}°</p>
                        </div>

                        <div className="comparisonBox-el">
                            <p className='name'>Shoulders</p>
                            <p className='before'>{comparisonResult?.shoulders.before}°</p>
                            <p className='after'>{comparisonResult?.shoulders.after}°</p>
                            <p className={'comparison ' + comparisonResult?.shoulders.color}>{comparisonResult?.shoulders.comparison}°</p>
                        </div>
                        
                        <div className="comparisonBox-el">
                            <p className='name'>Hips</p>
                            <p className='before'>{comparisonResult?.hips.before}°</p>
                            <p className='after'>{comparisonResult?.hips.after}°</p>
                            <p className={'comparison ' + comparisonResult?.hips.color}>{comparisonResult?.hips.comparison}°</p>
                        </div>
                    </>}

                    <div className="comparisonBox-el">
                        <p className='name'>Ankles</p>
                        <p className='before'>{comparisonResult?.ankles.before}°</p>
                        <p className='after'>{comparisonResult?.ankles.after}°</p>
                        <p className={'comparison ' + comparisonResult?.ankles.color}>{comparisonResult?.ankles.comparison}°</p>
                    </div>
                </div>}

            </IonContent>
        </IonPage>
    );
};

export default Comparison;