import {
    IonContent,
    IonPage,
    useIonAlert,
    IonButton,
    IonCard,
} from '@ionic/react';

import { useEffect,useState,useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonItem, IonList, IonSearchbar } from '@ionic/react';

import {useHistory} from "react-router";

import './Home.scss'
import { chooseClient,addNewClient,Client,updateClients } from 'store/slices/clients';
import sessions, { Session,addNewSession,filterSessionsByClient } from "store/slices/sessions";
import { RootState } from 'store/store';


const Home = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    //ALERT
    const [presentAlert] = useIonAlert();

    const clientsData = useSelector((state:RootState) => state.clients)
    const [search, setSearch] = useState<string>()
    const [results, setResults] = useState(clientsData.clients);
    const [updater, setUpdater] = useState(0)

    const [isOpenForm, setIsOpenForm] = useState(0)
    const [isOnboarding, setIsOnboarding]= useState(false)
    
    const handleChange = (e: Event) => {
        const target = e.target as HTMLIonSearchbarElement;
        //
        if (target) setSearch(target.value!.toLowerCase())
        
    }

    useEffect(()=>{
        if(search){
            setResults(clientsData.clients.filter((client: Client) => client.name ? client.name.toLowerCase().indexOf(search) > -1 : ''));
        }
    },[search])

    useEffect(()=>{
        dispatch(updateClients())

        if(!search || search?.length === 0){
            let t = setTimeout(()=>{
                setUpdater(updater + 1)
                clearTimeout(t)
            },500)
        }
    },[updater, search?.length])

    useEffect(()=>{
        //@ts-ignore
        clientsData && clientsData.clients  && setResults(clientsData.clients)
    },[updater, clientsData])


    const resultsInfo = (client:Client) =>{
        try {
            let stringsSessions = localStorage.getItem('sessions')
            if(!stringsSessions || stringsSessions.length <= 0) return
            //@ts-ignore
            let sessions = JSON.parse(localStorage.getItem('sessions'))
            let findedSessions = sessions.filter((i:Session) => i.clientId === client.id)
            let lastSessionId = findedSessions.sort((a:Session, b:Session) => a.id - b.id)[0]?.id || false
            let lastSessionTime = lastSessionId ? (new Date(lastSessionId)).toLocaleDateString("en-US") : false
            
            return({
                number: findedSessions.length,
                lastSessionTime: lastSessionTime,
            })
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
    }

    return (
        <IonPage>

            <IonContent fullscreen className='home-IonContent'>
                <div className='home-contentInner'>
                    {(results && results.length > 0) && <h3 className='header-text'>List of results</h3>}
                </div>

                {/* <div className='home-betaLabel'>
                    <p className='home-betaLabel-text'>v1.0.3 [BETA]</p>
                </div> */}

                {/* <IonSearchbar placeholder='Find a client' debounce={1000} onIonChange={(e: Event) => handleChange(e)}></IonSearchbar> */}

                <IonList className='client-List'>
                    {(results && results.length > 0) 
                        ? results.map((result: Client, index: number) => (
                                result.id && <li className='client-List__item' key={index}>
                                    <div className='client-List__item-text' onClick={()=>{
                                        dispatch(chooseClient(result))
                                        dispatch(filterSessionsByClient(result.id))
                                        history.push('/sessions')
                                    }}>
                                        <p className='client-List__item-text_name'>{result.name}</p>
                                        {resultsInfo(result)?.number > 0 && <p className='client-List__item-text_number'>{`Sessions ${resultsInfo(result)?.number}`}</p>}
                                        {resultsInfo(result)?.lastSessionTime && <p className='client-List__item-text_lastTime'>{`Last scan ${resultsInfo(result)?.lastSessionTime}`}</p>}
                                    </div>
                                    {resultsInfo(result)?.number >= 2 
                                        ?  <button className='client-List__item-button popup' onClick={(e) => setIsOpenForm(1)}>New scan</button>
                                        :   <button className={'client-List__item-button' + (!!(resultsInfo(result)?.number === 2) ? ' popup' : '')} onClick={()=>{
                                                dispatch(chooseClient(result))
                                                result.id && dispatch(addNewSession({clientId: result.id}))
                                                history.push('/camera')
                                            }}>New scan</button>
                                    }
                                </li>
                            ))
                        : <p className='noresults'>You have no saved results. It's <br/> time to start!</p>
                    }
                </IonList>


                <div id="newPatient__form" className='home-bottom'>
                    {   clientsData.clients.filter(c => c.id).length === 3 
                        ?   <button className='home-button popup' onClick={(e) => setIsOpenForm(2)}>
                                <p className='home-button-text'>Start with new client</p>
                            </button>
                        :   <button className='home-button' onClick={() =>{
                                presentAlert({
                                    header: "Person's name",
                                    message: "Enter the person's name",
                                    buttons: [{
                                        text: 'SAVE AND START',
                                        handler: (value) => {
                                            const newClientId = Date.now()
                                            const clients = localStorage.getItem('clients')
                                            const allClientsNumber = clients ? JSON.parse(clients).length + 1 : 1
                                            
                                            let clientName = value[0]

                                            if(clientName.length === 0) clientName = `Person #${allClientsNumber}`

                                            dispatch(addNewClient({name: clientName, id: +newClientId}))
                                            dispatch(addNewSession({clientId: +newClientId}))
                                            setResults(clientsData.clients);

                                            history.push("/camera")
                                            console.log('clicked');
                                        },
                                    },],

                                    inputs: [
                                        {
                                            placeholder: `Person #${clientsData.clients ? clientsData.clients.length + 1 : 1}`,
                                            id: 'alert-input_name',
                                            attributes: {
                                                maxlength: 18,
                                            }
                                        } 
                                    ],
                                    })}}>
                                <p className='home-button-text'>Start new scan</p>
                            </button>
                    }
                </div>

                
                {!!isOpenForm && 
                    <div className='ion-card' >
                        <div className='ion-card-back' onClick={()=>{setIsOpenForm(0)}}/>
                        <IonCard className="ion-card-form">
                            <div className='ion-card-form-box'>
                                {isOpenForm === 1 
                                    ?   <p className='ion-card-form-box-header'>The number of <br/> saved sessions is 2</p>
                                    :   <p className='ion-card-form-box-header'>The number of <br/> persons is 3</p>
                                }
                            </div>
                            <div className='ion-card-form-box'>
                                {isOpenForm === 1 
                                    ?   <p className='ion-card-form-box-text'>If you want to save another <br/> session, you must delete any of the previously saved</p>
                                    :   <p className='ion-card-form-box-text'>If you want to save another <br/> person, you must delete any of the previously saved</p>
                                }
                            </div>

                            <button onClick={()=>{
                                setIsOpenForm(0)
                            }}  className="email-button">
                                OK
                            </button>
                        </IonCard>
                    </div>
                }
            </IonContent>
        </IonPage>
    );
};

export default Home;


