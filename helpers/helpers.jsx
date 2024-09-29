import {makeStore} from '../lib/store';
import imageCompression from 'browser-image-compression';
import { showNotification } from '@mantine/notifications';

export function clearStorageRedirectLogin(hideNotification=false){
    if(hideNotification === false){
        showNotification({
            title: 'Failed',
            color: 'red',
            message: 'Unauthorized',
            id: 'unauthorizedError'
        });
    }
    
    localStorage.clear();
    setTimeout(() => {
        window.location.reload();    
    }, 600);
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

export const compressImage= async (file)=>{
    const options = {
        maxSizeMB: 0.1,
        //maxWidthOrHeight: 400,
        useWebWorker: true
    }
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
}

export const errorMessage=(error, id)=> {
    showNotification({
        title: 'Failed',
        color: 'red',
        message: error?.message ? error?.message : 'Please contact support team.',
        id
      });
}