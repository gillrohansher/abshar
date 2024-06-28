import { configureStore } from '@reduxjs/toolkit'
import { generalReducer } from './generalReducer/generalReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
  }
   
const persistedReducer = persistReducer(persistConfig, generalReducer)

export const makeStore = () => {
    let store= configureStore({
        reducer: persistedReducer
    })

    store.__persistor = persistStore(store);
    return store;
}