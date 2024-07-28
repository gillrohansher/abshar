import { api_config } from "../apis";
import { showNotification } from "@mantine/notifications";
import { APIClientDELETE, APIClientGET, APIClientPOST, APIClientPUT } from "./APIClient";
import { clearStorageRedirectLogin, getAuthToken } from "../../helpers/helpers";


export async function UsersGet(data, token, res) {
    await APIClientGET({
      url: api_config.users.user_get,
      headers: {
        Authorization: token,
        Accept: 'application/json, text/plain, */*'
      }
    })
      .then(response => {
          console.log('response.result: UsersGet: ', response);
          res(response.data);
      })
      .catch(e => {
          if(e?.response?.data?.code ===  401){
            clearStorageRedirectLogin();
          }else{
            res(e?.response?.data);
            console.log('response.result: UsersGet: ', e?.response?.data?.message);
            showNotification({
              title: 'Failed',
              color: 'red',
              message: e?.response?.data?.message,
              id: 'UsersGetError'
            });
          }
      });
}

export async function UserPost(data, token, res) {
    await APIClientPOST({
      url: api_config.users.user_post,
      data: data,
      headers: {
        Authorization: token,
      }
    })
      .then(response => {
          console.log('response.result: UserPost: ', response);
          res(response.data);
      })
      .catch(e => {
          if(e.response.data.code ===  401){
            clearStorageRedirectLogin();
          }else{
            res(e.response.data);
            console.log('response.result: UserPost: ', e.response.data.message);
            showNotification({
              title: 'Failed',
              color: 'red',
              message: e.response.data.message,
              id: 'UserPostError'
            });
          }
      });
}


export async function UserChangeRolePut(id, userType, token, res) {
  let data = new FormData();
  data.append('id', id);
  data.append('userType', userType);
    await APIClientPUT({
      url: api_config.users.user_change_role,
      data,
      headers: {
        Authorization: token,
      }
    })
      .then(response => {
          console.log('response.result: UserChangeRolePut: ', response);
          res(response.data);
      })
      .catch(e => {
          if(e.response.data.code ===  401){
            clearStorageRedirectLogin();
          }else{
            res(e.response.data);
            console.log('response.result: UserChangeRolePut: ', e.response.data.message);
            showNotification({
              title: 'Failed',
              color: 'red',
              message: e.response.data.message,
              id: 'UserChangeRolePutError'
            });
          }
      });
}

export async function UserChangeAccountStatusPut(id, status, token, res) {
  let data = new FormData();
  data.append('id', id);
  data.append('status', status);
    await APIClientPUT({
      url: api_config.users.user_change_account_status,
      data,
      headers: {
        Authorization: token,
      }
    })
      .then(response => {
          console.log('response.result: UserChangeAccountStatusPut: ', response);
          res(response.data);
      })
      .catch(e => {
          if(e.response.data.code ===  401){
            clearStorageRedirectLogin();
          }else{
            res(e.response.data);
            console.log('response.result: UserChangeAccountStatusPut: ', e.response.data.message);
            showNotification({
              title: 'Failed',
              color: 'red',
              message: e.response.data.message,
              id: 'UserChangeAccountStatusPutError'
            });
          }
      });
}

export async function UserDelete(ids, token, res) {
    let data = new FormData();
    data.append('ids', ids);

    await APIClientDELETE({
      url: api_config.users.user_delete,
      data,
      headers: {
        Authorization: token,
      }
    })
      .then(response => {
          console.log('response.result: UserDelete: ', response);
          res(response.data);
      })
      .catch(e => {
          if(e.response.data.code ===  401){
            clearStorageRedirectLogin();
          }else{
            res(e.response.data);
            console.log('response.result: UserDelete: ', e.response.data.message);
            showNotification({
              title: 'Failed',
              color: 'red',
              message: e.response.data.message,
              id: 'UserDeleteError'
            });
          }
      });
}