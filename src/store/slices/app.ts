import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Image, Accel, CGPoint } from 'store/types'


import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';



export interface AppState {
    accel: Accel;
    resultSideNumber: number;
    isRetakeOnePhoto: boolean;
    isLoading: boolean;
    cameraUpdate: boolean
    rerenderCounter: number;
}

const initialState: AppState = {
    accel: { x: 0, y: 0, z: 0 },
    resultSideNumber: 0,
    isLoading: true,
    isRetakeOnePhoto: false,
    cameraUpdate: false,
    rerenderCounter: 0,

};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setResultSideNumber: (state, action: PayloadAction<number>) => {
            state.resultSideNumber = action.payload
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setAccel: (state, action: PayloadAction<Accel>) => {
            state.accel = {
                x: (state.accel.x + action.payload.x) / 2,
                y: (state.accel.y + action.payload.y) / 2,
                z: (state.accel.z + action.payload.z) / 2,
            }
        },
        setIsRetakeOnePhoto: (state, action: PayloadAction<boolean>) => {
            state.isRetakeOnePhoto = action.payload
        },
        cameraUpdate: (state) => {
            state.cameraUpdate = state.cameraUpdate ? false : true;
        },
        rerenderResults: (state,action: PayloadAction<boolean>) => {
            if(action.payload) {
                state.rerenderCounter += 1;
            }else{
                state.rerenderCounter = 0
            }
            
        },

    },
})


// Action creators are generated for each case reducer function
export const { setResultSideNumber ,setIsLoading, setAccel, setIsRetakeOnePhoto, cameraUpdate,rerenderResults} = appSlice.actions

export default appSlice.reducer