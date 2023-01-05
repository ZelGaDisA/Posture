import {
    IonContent,
    IonPage,
    useIonAlert,
    IonButton,
    IonFab,
    IonToolbar,
    IonTitle
} from '@ionic/react';

import { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IonItem, IonList, IonSearchbar } from '@ionic/react';


import homeFrame from 'images/homeInstruction.svg'
import {useHistory} from "react-router";

import './Home.scss'
import { chooseClient,addNewClient,Client,updateClients } from 'store/slices/clients';
import { Session,addNewSession,createSessions,filterSessionsByUser } from "store/slices/sessions";
import { RootState } from 'store/store';


const Home = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [presentAlert] = useIonAlert();
    const clientsData = useSelector((state:RootState) => state.clients)

    const [results, setResults] = useState(clientsData.clients);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const savedSessions = localStorage.getItem('sessions')

    const handleChange = (e: Event) => {
        let query = "";
        const target = e.target as HTMLIonSearchbarElement;
        if (target) query = target.value!.toLowerCase();
        setResults(clientsData.clients.filter((client: Client) => client.name ? client.name.toLowerCase().indexOf(query) > -1 : ''));
    }

    useEffect(()=>{
        //@ts-ignore
        clientsData && clientsData.clients && setResults(clientsData.clients)
        updateClients()
    },[clientsData , clientsData.client.id])

    const resultsInfo = (client:Client) =>{
        let sessions = savedSessions && JSON.parse(savedSessions)
        let findedSessions = sessions.filter((i:Session) => i.clientId === client.id)
        let lastSessionId = findedSessions.sort((a:Session, b:Session) => a.id - b.id)[0]?.id || false
        let lastSessionTime = lastSessionId ? (new Date(lastSessionId)).toLocaleDateString("en-US") : false
        
        return({
            number: findedSessions.length,
            lastSessionTime: lastSessionTime
        })
    }

    return (
        <IonPage>

            <IonContent fullscreen className='home-IonContent'>
                <div className='home-contentInner'>
                    <h3 className='header-text'>My clients</h3>
                </div>

                <IonSearchbar placeholder='Find a client' debounce={1000} onIonChange={(e: Event) => handleChange(e)}></IonSearchbar>

                <IonList className='client-List'>
                    {results && results.length > 0 && results.map((result: Client, index: number) => (
                        <li className='client-List__item' key={index}>
                            <div className='client-List__item-text' onClick={()=>{
                                dispatch(chooseClient(result))
                                dispatch(filterSessionsByUser(result.id))
                                history.push('/client')
                            }}>
                                <p className='client-List__item-text_name'>{result.name}</p>
                                {resultsInfo(result).number > 0 && <p className='client-List__item-text_number'>{`sessions: ${resultsInfo(result).number}`}</p>}
                                {resultsInfo(result).lastSessionTime && <p className='client-List__item-text_lastTime'>{`last scan ${resultsInfo(result).lastSessionTime}`}</p>}
                            </div>
                            <button className='client-List__item-button' onClick={()=>{
                                dispatch(chooseClient(result))
                                result.id && dispatch(addNewSession({clientId: result.id}))
                                history.push('/camera')
                            }}>new scan</button>
                        </li>
                    ))}
                </IonList>

                <div id="newPatient__form" className='home-bottom'>
                        <button className='home-button' onClick={() =>
                                presentAlert({
                                header: "Enter the client's name",
                                buttons: [{
                                    text: 'SAVE AND START',
                                    handler: (value) => {

                                        const newClientId = Date.now()
                                        const clients = localStorage.getItem('clients')
                                        const allClientsNumber = clients ? JSON.parse(clients).length + 1 : 1
                                        let clientName = value[0]
                                        
                                        if(clientName.length === 0) clientName = `Client #${allClientsNumber}`

                                        dispatch(addNewClient({name: clientName, id: +newClientId}))
                                        dispatch(addNewSession({clientId: +newClientId}))
                                        setResults(clientsData.clients);

                                        history.push("/camera")
                                    },
                                },],
                                inputs: [
                                    {
                                        placeholder: `Client #${clientsData.clients ? clientsData.clients.length + 1 : 1}`,
                                        id: 'alert-input_name',
                                        
                                    },
                                ],
                                })}>
                            <p className='home-button-text'>Start with new client</p>
                        </button>
                </div>
            </IonContent>
            
        </IonPage>
    );
};

export default Home;


