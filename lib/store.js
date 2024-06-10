import { configureStore } from '@reduxjs/toolkit'
import { generalReducer } from './GeneralReducer/generalReducer'

export const makeStore = () => {
  return configureStore({
    reducer: generalReducer
  })
}