import * as Actiontypes from '../types/general';

export const set_token =(data)=>{
  return {
    type: Actiontypes.SET_TOKEN,
    payload: data,
  };
}

export const set_account_data =(data)=>{
  return {
    type: Actiontypes.SET_ACCOUNT_DATA,
    payload: data,
  };
}

export const set_profile_data = (data) => {
  return {
    type: Actiontypes.SET_PROFILE_DATA,
    payload: data,
  };
};

export const set_profile_pic = (data) => {
  return {
    type: Actiontypes.SET_PROFILE_PIC,
    payload: data,
  };
};

export const set_loader = (data) => {
  return {
    type: Actiontypes.SET_LOADER,
    payload: data,
  };
};