import { createSlice } from '@reduxjs/toolkit'

const generalSlice = createSlice({
  name: 'general',
  initialState: {
    profileData: {},
    profilePic: null,
    accountData: {},
    token: null,
    loader: false,
  },
  reducers: {
    setToken(state, action) {
        return {
            ...state,
            token: action.payload
        }
    },
    setProfileData(state, action) {
        return {
            ...state,
            profileData: action.payload
        }
    },
    setAccountData(state, action) {
        return {
            ...state,
            accountData: action.payload
        }
    },
    setLoader(state, action) {
        return {
            ...state,
            loader: action.payload
        }
    },
    setProfilePic(state, action) {
        return {
            ...state,
            profilePic: action.payload
        }
    }
  }
})

export const { setToken, setProfileData, setProfilePic, setAccountData, setLoader } = generalSlice.actions
export default generalSlice.reducer