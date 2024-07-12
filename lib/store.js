import { configureStore, combineReducers } from '@reduxjs/toolkit'
import generalReducer from './generalSlice';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
}

const reducer = combineReducers({
    general: generalReducer
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const makeStore = () => {
    return configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: false,
        })
    });
}