import {makeStore} from '../lib/store';

export function clearStorageRedirectLogin(){
    localStorage.clear();
    window.location.reload();
}

export function getAuthToken() {
    // grab current state
    const state = makeStore();
    // get the token out of it
    const authToken = state.getState().general.token;
    console.log('getAuthToken()::', state.getState().general);
    // return the token 
    return authToken;
}