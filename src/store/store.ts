import { configureStore } from '@reduxjs/toolkit'
import appReducer from './slices/app'
import sessionReducer from './slices/sessions'
import clientsReducer from './slices/clients'

export const store = configureStore({
  reducer: {
    app: appReducer,
    sessions: sessionReducer,
    clients: clientsReducer 
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch