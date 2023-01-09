import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Images } from 'store/types';



export interface Session {
    id: number,
    images: Images
    clientId: number
}

interface SessionData {
    session: Session,
    sessions: Session[] | [],
    selectedSessions: Session[] | []
}

const initialState: SessionData = {
    session: {
        id: 0,
        images: {
            front: { path: "", status: null, angle: null, landmarks: null},
            back: { path: "", status: null, angle: null, landmarks: null},
            right: { path: "", status: null, angle: null, landmarks: null},
            left: { path: "", status: null, angle: null, landmarks: null},
        },
        clientId: 0
    },
    sessions: [],
    selectedSessions: []
};

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        clearSessions: (state) => {
                state.session = {
                    id: 0,
                    images: {
                        front: { path: "", status: null, angle: null, landmarks: null},
                        back: { path: "", status: null, angle: null, landmarks: null},
                        right: { path: "", status: null, angle: null, landmarks: null},
                        left: { path: "", status: null, angle: null, landmarks: null},
                    },
                    clientId: 0
                }
                state.sessions = []
                state.selectedSessions = []
        },
        setSession: (state, action: PayloadAction<Session>) => {
            state.session = action.payload
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
        addImagesPath: (state, action: PayloadAction<Images>) => {
            if(action.payload?.left){
                state.session.images.left.path = action.payload.left.path
            }
            if(action.payload?.right){
                state.session.images.right.path = action.payload.right.path
            }
            if(action.payload?.back){
                state.session.images.back.path = action.payload.back.path
            }
            if(action.payload?.front){
                state.session.images.front.path = action.payload.front.path
            }
        },
        addImagesStatus: (state, action: PayloadAction<Images>) => {
            if(action.payload?.left){
                state.session.images.left.status = action.payload.left.status
            }
            if(action.payload?.right){
                state.session.images.right.status = action.payload.right.status
            }
            if(action.payload?.back){
                state.session.images.back.status = action.payload.back.status
            }
            if(action.payload?.front){
                state.session.images.front.status = action.payload.front.status
            }
        },
        addImagesAngle: (state, action: PayloadAction<Images>) => {
            if(action.payload?.left){
                state.session.images.left.angle = action.payload.left.angle
            }
            if(action.payload?.right){
                state.session.images.right.angle = action.payload.right.angle
            }
            if(action.payload?.back){
                state.session.images.back.angle = action.payload.back.angle
            }
            if(action.payload?.front){
                state.session.images.front.angle = action.payload.front.angle
            }
        },
        addImagesLandmarks: (state, action: PayloadAction<Images>) => {
            if(action.payload?.left){
                state.session.images.left.landmarks = action.payload.left.landmarks
            }
            if(action.payload?.right){
                state.session.images.right.landmarks = action.payload.right.landmarks
            }
            if(action.payload?.back){
                state.session.images.back.landmarks = action.payload.back.landmarks
            }
            if(action.payload?.front){
                state.session.images.front.landmarks = action.payload.front.landmarks
            }
        },
        saveSessionToLocal:  (state) => {
            let sessions = localStorage.getItem('sessions')
            let newSession = state.session

            if(sessions && JSON.parse(sessions).length > 0){
                let newSessions = JSON.parse(sessions)
                newSessions.push(newSession)
                localStorage.setItem('sessions', JSON.stringify(newSessions))
            }else{
                localStorage.setItem('sessions', JSON.stringify([newSession]));
            }  

        },
        addNewSession: (state, action: PayloadAction<{clientId: number}> ) => {
            state.session.id = Date.now()
            state.session.clientId = action.payload.clientId   
            state.session.images = {
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
        filterSessionsByUser: (state, action: PayloadAction<number | null> ) => {
            let sessions = localStorage.getItem('sessions')

            if(sessions){
                let newSessions = JSON.parse(sessions)

                newSessions = newSessions.filter((s:Session) => {
                    if(s && s.clientId && action.payload && action.payload){
                        if(+s.clientId === +action.payload){
                            if(s.images && 
                                (s.images.front.status !== null ||
                                s.images.back.status !== null ||
                                s.images.left.status !== null ||
                                s.images.right.status)
                            ) {
                                return s
                            }
                            
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
    saveSessionToLocal ,
    addNewSession, createSessions,
    filterSessionsByUser,
    addImagesPath, addImagesStatus,
    addImagesAngle, addImagesLandmarks
} = sessionSlice.actions

export default sessionSlice.reducer