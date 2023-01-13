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

            if(clients && JSON.parse(clients).length > 0){
                state.client = newClient
                
                let newClients = JSON.parse(clients)
                newClients.push(newClient)
                console.log(newClients);
                localStorage.setItem('clients', JSON.stringify(newClients))
            }else{
                localStorage.setItem('clients', JSON.stringify([newClient]));
            }

        },

        updateClients: (state) => {
            let clients = localStorage.getItem('clients')
            if(clients && clients.length > 0){
                state.clients = JSON.parse(clients)
            }else{
                localStorage.setItem('clients','[]')
            }
        },
    },
})

export const { chooseClient, addNewClient, updateClients } = clientSlice.actions

export default clientSlice.reducer