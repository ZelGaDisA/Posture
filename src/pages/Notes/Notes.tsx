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

import './Notes.scss'
import { chooseClient,addNewClient,Client,updateClients } from 'store/slices/clients';
import sessions, { Session,addNewSession,filterSessionsByClient,pushToLocalNote } from "store/slices/sessions";
import { RootState } from 'store/store';

import trash from 'images/icons/trash-2.svg'
import back from "images/backGreen.svg";
import editNote from 'images/editMessage.svg'
import textIcon from "images/textIcon.svg";

interface Note {
    sessionId: number,
    message: string | null
}

const Notes = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [notes, setNotes] = useState<Note[]>([])
    const [isOpenForm, setIsOpenForm] = useState<boolean>(false)
    const [editedSessionId, setEditedSessionId] = useState<number>(0)
    const [note, setNote] = useState<null|undefined|string>("")
    const [rerender, setRerender] = useState(0)
    
    const sessions = useSelector((state:RootState)=> state.sessions.sessions)
    console.log(notes);
    
    useEffect(()=>{
        if(sessions) {
            let localNotes = sessions.map((s:Session) => {
                return {sessionId: s.id, message:localStorage.getItem(`N-${s.id}`)}
            }).filter((note: Note) => note.message && note.message.length > 0)

            if(localNotes.length > 0) {
                setNotes(localNotes)
            }
        }

    },[rerender, sessions])

    const getDate = (id:number) => {
        return new Date(id).toLocaleDateString("en-US")
    }

    const saveNote = () => {
        let newNote = note
        if(typeof note === "string") {
            newNote && dispatch(pushToLocalNote({sessionId: editedSessionId, note: newNote}))
            setNote("")
            setRerender(rerender + 1)
        }
    }

    const removeNote = (id:number) => {
        localStorage.removeItem(`N-${id}`)
        setIsOpenForm(false)
        setNote('')
        setNotes([])
        setRerender(rerender + 1)
    }

    return (
        <IonPage>
            <IonHeader>
                <div className='description-header' >
                    <button className='buttBack' onClick={() => {
                        history.goBack()
                    }}>
                        <img src={back} alt=""/>
                    </button>

                    <h3 className='description-header-text'>Notes</h3>
                </div>
            </IonHeader>

            <IonContent className='Notes-IonContent'>
                <div
                    className='scroll'
                >
                    {notes.map((n,i)=>(<li className='note' key={i}>
                        <p className='note__date'>{getDate(n.sessionId)}</p>
                        <p className='note__message'>{n.message}</p>
                        
                        <div className='note__iconBox'>
                            <button onClick={()=>{
                                removeNote(n.sessionId)
                            }} className="note__iconBox-removeButton">
                                <img src={trash}></img>
                            </button>
    
                            <button onClick={()=>{
                                setEditedSessionId(n.sessionId)
                                setIsOpenForm(true)
                                setNote(n.message)
                            }} className="note__iconBox-editButton">
                                <img className=''src={editNote}></img>
                            </button>
                        </div>
                    </li>))}
                </div>
            </IonContent>
            
            {!!isOpenForm && 
                <div className='note__ion-card' >
                    <div className='note__ion-card-back' onClick={()=>{setIsOpenForm(false)}}/>

                    <IonCard className="note__ion-card-form">
                        {note && note.length> 0 && note.length < 2414 &&  <p className='note__ion-card-form__lengtgh-text'>Number of characters: {note.length} of 2414</p>}
                        {note && note.length >= 2414 && <p className='note__ion-card-form__text'>Max length is 2414</p>}

                        <IonTextarea
                            placeholder="Type Note here"
                            autoGrow={true}
                            value={note}
                            className='custom-textarea'
                            wrap="hard"
                            onIonChange={(e)=>{
                                setNote(e.detail.value)
                            }}
                        ></IonTextarea>

                        <button onClick={()=>{
                            setIsOpenForm(false);
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

export default Notes;


