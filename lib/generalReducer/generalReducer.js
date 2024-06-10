import * as ActionTypes from '../types/general';
const initialState = {
  profileData: {},
  profilePic: null,
  accountData: {},
  token: null,
  loader: false,
};

export const generalReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_TOKEN:
      return { ...state, token: action.payload };

    case ActionTypes.SET_ACCOUNT_DATA:
      return { ...state, accountData: action.payload };

    case ActionTypes.SET_PROFILE_DATA:
      return { ...state, profileData: action.payload };

    case ActionTypes.SET_PROFILE_PIC:
      return { ...state, profilePic: action.payload };

    case ActionTypes.SET_LOADER:
      return { ...state, loader: action.payload };
    
    default:
      return state;
  }
};
