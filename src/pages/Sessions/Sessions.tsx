import './Sessions.scss'
import {IonContent,IonPage,useIonAlert,IonButton,IonFab,IonToolbar,IonTitle,IonList,IonCheckbox,IonItem,IonLabel,IonItemSliding,IonItemOption,IonItemOptions
} from '@ionic/react';
import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { RootState } from 'store/store';
import { Client, updateClients } from 'store/slices/clients';
import { Session,addNewSession, setSelectedSession, setSession, clearSessions} from 'store/slices/sessions';
import { setResultSideNumber, setIsReading } from "store/slices/app";
import { Images,CGPoint } from 'store/types';
import { findAngle } from 'functions/findAngle';

import back from "images/backGreen.svg";
import trash from 'images/icons/trash-2.svg'
import whiteTrash from 'images/whiteTrash.svg'


interface visibleCard {
    session: Session,
    images: Images[]
}

const Sessions = () => {
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
    const [selectedCardIndex, setSelectedCardIndex] = useState(-1)
    const [comparisonResult, setComparisonResults] = useState<any>(null)
    const [visibleCards, setVisibleCards] = useState<visibleCard[] | null>(null)

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
            setComparisonResults(findAngle(selectedSessions, sessions, selectedCardIndex))
        }
    },[selectedSessions])

    const deleteSession = (s:Session) => presentAlert({
        header: 'Warning!',
        message: "Are you sure you want to delete<br/> this session?",
        buttons: [
            {
                text: 'CANCEL',
                role: 'cancel',
                handler: () => {
                },
            },
            {
                text: 'REMOVE',
                role: 'confirm',
                cssClass: 'removeClientBtn',
                handler: () => {

                    let localSessions = localStorage.getItem('sessions')
                    let parsedSessions = localSessions && JSON.parse(localSessions)

                    if(localSessions && localSessions.length > 2){
                        localStorage.removeItem(String(s.id))
                        let newSessions = parsedSessions.filter((session:Session) => session.id !== s.id)
                        let string = JSON.stringify(newSessions)
                        localStorage.setItem('sessions', string)
                        setUpdater(updater + 1)
                        dispatch(updateClients())
                    }
                },
            },
        ]
    })

    const goToSession = (s:Session) => {
        dispatch(setSession(s))
        dispatch(setIsReading(true))
        dispatch(setResultSideNumber(selectedCardIndex > 0 ? selectedCardIndex + 1 : 0))

        console.log(selectedCardIndex);

        history.push('/results')
        history.push('/result')
    }

    const getDateTime = (time: number) => {
        let date = new Date(time)
        return `${date.toLocaleDateString("en-US")}`
    }

    const selectSession = (session:Session) => {
        dispatch(setSelectedSession(session))
    }
    
    const deleteClient = () => presentAlert({
        header: 'Warning!',
        message: "Are you sure you want to delete this client?",
        buttons: [
            {
                text: 'CANCEL',
                role: 'cancel',
                handler: () => {
                    
                },
            },
            {
                text: 'REMOVE',
                role: 'confirm',
                cssClass: 'removeClientBtn',
                handler: () => {
                    let newClients = clients.clients.slice().map((c:Client)=> c.id !== clientInfo.id ? c : {})
                    let localSessions = localStorage.getItem('sessions')
                    let localParsed = localSessions ? JSON.parse(localSessions) : []
                    let newSessions = localParsed.slice().filter((session:Session) => session.clientId !== clientInfo.id)
                    
                    sessions.slice().forEach((s:Session)=>{
                        if(s.clientId === clientInfo.id){
                            localStorage.removeItem(String(s.id))
                        }
                    })

                    if(newSessions.length >= 0){
                        let c = JSON.stringify(newSessions)
                        localStorage.setItem('sessions', c)
                    }
                    if(newClients.length >= 0){
                        let c = JSON.stringify(newClients)
                        localStorage.setItem('clients', c)
                        dispatch(updateClients())
                        dispatch(clearSessions())
                        history.push('/home')
                    } else{
                        console.log('====================================');
                        console.log('error');
                        console.log('====================================');
                    }
                },
            },
        ]
    })

    const renderVisibleCards = () => {
        return visibleCards?.map((visCard:visibleCard, i:number)=>{
            if(!visCard?.session){return} //visibility of empty session

            const s = visCard.session
            const images = visCard.images
            
            return  <IonItemSliding key={i} className='sessionsPageBox-list__el'>
                        <IonItem className='sessionsPageBox-list__el-Item'>
                            <IonLabel className='sessionsPageBox-list__el-Label'>
                                <p>{s.id ? getDateTime(s.id) : 0}</p>
                            </IonLabel>
                            <button className='sessionsPageBox-list__el-Discription'
                                onClick={()=>{
                                    history.push("/discriptions")
                                    dispatch(setSession(s))
                                }}
                            >Discription</button>
                        </IonItem>

                        <IonItemOptions side="end" className='sessionsPageBox-list__el-Options' >
                            <IonItemOption className='sessionsPageBox-list__el-Options_option' onClick={() => {
                                deleteSession(s)
                            }}>
                                <img className='blackTrashIcon' src={whiteTrash} alt="" />
                            </IonItemOption>
                        </IonItemOptions>
                </IonItemSliding>
        })
    }

    return (
        <IonPage>
            <IonContent fullscreen className='client-IonContent'>

                <div className='client-header' >
                    <button className='buttBack' onClick={() => {
                        history.push("/")
                        dispatch(clearSessions())
                    }}>
                        <img src={back} alt=""/>
                    </button>

                    <h3 className='client-header-text'>{clientInfo.name}</h3>
                    <div className='client-header-more' onClick={() => deleteClient()}>
                        <img src={trash} alt="" />
                    </div>
                </div>
                

                <IonList className='sessionsPageBox-list' lines="none">
                    {visibleCards && visibleCards?.length > 0 
                        ?   <>  
                                {renderVisibleCards()}
                                {visibleCards?.length < 2 && <li className='sessionsPageBox-list__button'>
                                    <IonLabel className='sessionsPageBox-list__button-Label'
                                        onClick={()=>{
                                            clientInfo?.id && dispatch(addNewSession({clientId: clientInfo.id}))
                                            history.push('/camera')
                                        }}
                                    > +Add new session to compare</IonLabel>
                                </li>}
                            </>
                        :  <li className='sessionsPageBox-list__button'>discription
                                <IonLabel className='sessionsPageBox-list__button-Label'
                                    onClick={()=>{
                                        clientInfo?.id && dispatch(addNewSession({clientId: clientInfo.id}))
                                        history.push('/camera')
                                    }}
                                > +Add new session to compare</IonLabel>
                            </li>
                    }
                </IonList>

            </IonContent>
        </IonPage>
    );
};

export default Sessions;