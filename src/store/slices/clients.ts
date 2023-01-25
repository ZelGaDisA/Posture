import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface Client {
    id: number | null,
    name: string | null
}

interface ClientsData {
    client: Client,
    clients: Client[] | []
}

const initialState: ClientsData = {
    client: {id: null, name: null},
    clients: []
};

export const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        chooseClient: (state, action: PayloadAction<Client>) => {
            state.client = action.payload
        },

        addNewClient: (state, action: PayloadAction<{name:string, id:number}>) => {
            let newClient = {
                id: action.payload.id,
                name: action.payload.name
            }

            state.clients = [...state.clients,  newClient]

            let clients = localStorage.getItem('clients')
            state.client = newClient

            if(clients && JSON.parse(clients).length > 0){
                let newClients = JSON.parse(clients)
                newClients.push(newClient)
                localStorage.setItem('clients', JSON.stringify(newClients))
            }else{
                localStorage.setItem('clients', JSON.stringify([newClient]));
            }

        },

        updateClients: (state) => {
            let clients = null
            let localSize = JSON.stringify(localStorage).length
            console.log('size: ' + localSize);
            for (let i = 0; i < 15; i++) {
                let cl = localStorage.getItem('clients')
                if(cl && cl.length > 0){
                    clients = cl
                    break
                }
            }
            if(!clients || clients.length <= 2){
                localStorage.setItem('clients','[]')
            } else  {
                state.clients = JSON.parse(clients)
            }

        },
    },
})

export const { chooseClient, addNewClient, updateClients } = clientSlice.actions

export default clientSlice.reducer