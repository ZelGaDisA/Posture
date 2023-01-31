import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Images, Image } from 'store/types';



export interface Session {
    id: number,
    clientId: number
}

interface SessionData {
    images: Images,
    session: Session,
    sessions: Session[] | [],
    selectedSessions: Session[] | []
}

const initialState: SessionData = {
    images: {
        sessionId: null,
        front: { path: "", status: null, angle: null, landmarks: null},
        back: { path: "", status: null, angle: null, landmarks: null},
        right: { path: "", status: null, angle: null, landmarks: null},
        left: { path: "", status: null, angle: null, landmarks: null},
    },
    session: {
        id: 0,
        clientId: 0
    },
    sessions: [],
    selectedSessions: []
};

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {        
        pushToLocalNote: (state, action: PayloadAction<{sessionId:number, note: string}>) => {
            localStorage.setItem(`N-${action.payload.sessionId}`, action.payload.note)
        },
        
        clearSessions: (state) => {
                state.images = {
                    sessionId: null,
                    front: { path: "", status: null, angle: null, landmarks: null},
                    back: { path: "", status: null, angle: null, landmarks: null},
                    right: { path: "", status: null, angle: null, landmarks: null},
                    left: { path: "", status: null, angle: null, landmarks: null},
                }
                state.session = {
                    id: 0,
                    clientId: 0
                }
                state.sessions = []
                state.selectedSessions = []
        },

        clearSelectedSessions: (state) => {
            state.selectedSessions = []
        },

        //СОХРАНИТЬ ИЗОБРАЖЕНИЯ ОТДЕЛЬНО ОТ СЕССИЙ
        setSession: (state, action: PayloadAction<Session>) => {
            state.session = action.payload

            try {
                let localImages = localStorage.getItem(String(action.payload.id))
                //@ts-ignore
                state.images = JSON.parse(localImages)
            } catch (error) {
                console.log(error);
            }
            
        },
        setSelectedSession: (state, action: PayloadAction<Session | null>) => {
            if(action.payload === null){
                state.selectedSessions = []
                return
            }
            
            if(state.selectedSessions.length === 0){
                state.selectedSessions = [...state.selectedSessions, action.payload]
                return
            }
            
            const newList = state.selectedSessions.map(s => s.id)
            const findedIndex = newList.indexOf(action.payload.id)

            if(typeof findedIndex === 'number' && findedIndex >= 0) {
                state.selectedSessions.splice(findedIndex, 1)
            }
            else {state.selectedSessions = [...state.selectedSessions, action.payload]}
        },
        addImage: (state, action: PayloadAction<{sessionId?:number, front?: Image, left?: Image, right?: Image, back?: Image}>) => {
            if(action.payload?.sessionId){
                state.images.sessionId = action.payload.sessionId
            }
            if(action.payload?.left){
                state.images.left = action.payload.left
            }
            if(action.payload?.right){
                state.images.right = action.payload.right
            }
            if(action.payload?.back){
                state.images.back = action.payload.back
            }
            if(action.payload?.front){
                state.images.front = action.payload.front
            }
        },
        saveSessionToLocal:  (state) => {
            let sessions = localStorage.getItem('sessions')
            let newSession = state.session
            let newImage = state.images
            
            if(sessions && state.session &&  state.images && JSON.parse(sessions).length > 0){
                try {

                    let newSessions = JSON.parse(sessions)

                    newSessions.push(newSession)

                    let newImagesString = JSON.stringify(newImage)
                    let newSessionsString = JSON.stringify(newSessions)

                    if(newSessionsString.length > 0 && newImagesString.length > 0){
                        localStorage.setItem(String(newSession.id), newImagesString)
                        localStorage.setItem('sessions', newSessionsString)
                    }else{
                        console.log('====================================');
                        console.log('stringify error');
                        console.log('====================================');
                    }

                } catch (error) {
                    console.log('====================================');
                    console.log(String(error));
                    console.log(localStorage)
                    console.log('====================================');
                }
            }else{
                localStorage.setItem('sessions', JSON.stringify([newSession]));
                localStorage.setItem(String(newSession.id), JSON.stringify(newImage));
            }  

        },
        addNewSession: (state, action: PayloadAction<{clientId: number}> ) => {
            let sessionId = Date.now()
            state.session.id = sessionId
            state.session.clientId = action.payload.clientId   
            state.images = {
                sessionId: sessionId,
                front: { path: "", status: null, angle: null, landmarks: null},
                back: { path: "", status: null, angle: null, landmarks: null},
                right: { path: "", status: null, angle: null, landmarks: null},
                left: { path: "", status: null, angle: null, landmarks: null},
            }
        },
        createSessions: () => {
            let sessions = localStorage.getItem('sessions')

            if(!sessions){
                localStorage.setItem('sessions','[]')
            }
        },

        filterSessionsByClient: (state, action: PayloadAction<number | null> ) => {
            let sessions = localStorage.getItem('sessions')

            if(sessions){
                let newSessions = JSON.parse(sessions)

                newSessions = newSessions.filter((s:Session) => {
                    if(s && s.clientId && action.payload && action.payload){
                        if(+s.clientId === +action.payload){
                            return s
                        }
                    }
                })

                state.sessions = newSessions
            }else{
                localStorage.setItem('sessions',`[]`)
            }
        },

    },
})

export const { 
    setSession,
    clearSessions,
    setSelectedSession,
    clearSelectedSessions,
    saveSessionToLocal ,
    addNewSession,
    createSessions,
    filterSessionsByClient,
    addImage,
    pushToLocalNote
} = sessionSlice.actions

export default sessionSlice.reducer