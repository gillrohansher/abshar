import { api_config } from "../apis";
import { showNotification } from "@mantine/notifications";
import { APIClientDELETE, APIClientGET, APIClientPOST, APIClientPUT } from "./APIClient";
import { clearStorageRedirectLogin, errorMessage, getAuthToken } from "../../helpers/helpers";


export async function UsersGet(data, token, res) {
    await APIClientGET({
      url: api_config.users.user_get,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json, text/plain, */*'
      }
    })
      .then(response => {
          console.log('response.result: UsersGet: ', response);
          if(response.data.code === 200){
            res(response.data);
          }else{
            errorMessage(response.data, 'UsersGet');
          };
      })
      .catch(e => {
        if(e?.response?.status ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e?.response?.data);
          console.log('response.result: UsersGet: ', e?.response?.data?.message);
          errorMessage(e?.response?.data, 'UsersGet');
        }
      });
}

export async function UserPost(data, token, res) {
    await APIClientPOST({
      url: api_config.users.user_post,
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
          console.log('response.result: UserPost: ', response);
          if(response.data.code === 200){
            res(response.data);
          }else{
            errorMessage(response.data, 'UserPost');
          };
      })
      .catch(e => {
        if(e?.response?.status ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e?.response?.data);
          console.log('response.result: UserPost: ', e?.response?.data?.message);
          errorMessage(e?.response?.data, 'UserPost');
        }
      });
}

export async function UserPut(data, token, res) {
    await APIClientPUT({
      url: api_config.users.user_put,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
          console.log('response.result: UserPut: ', response);
          if(response.data.code === 200){
            res(response.data);
          }else{
            errorMessage(response.data, 'UserPut');
          };
      })
      .catch(e => {
        if(e?.response?.status ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e?.response?.data);
          console.log('response.result: UserPut: ', e?.response?.data?.message);
          errorMessage(e?.response?.data, 'UserPut');
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
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
          console.log('response.result: UserChangeRolePut: ', response);
          if(response.data.code === 200){
            res(response.data);
          }else{
            errorMessage(response.data, 'UserChangeRolePut');
          };
      })
      .catch(e => {
        if(e?.response?.status ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e?.response?.data);
          console.log('response.result: UserChangeRolePut: ', e?.response?.data?.message);
          errorMessage(e?.response?.data, 'UserChangeRolePut');
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
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
          console.log('response.result: UserChangeAccountStatusPut: ', response);
          if(response.data.code === 200){
            res(response.data);
          }else{
            errorMessage(response.data, 'UserChangeAccountStatusPut');
          };
      })
      .catch(e => {
        if(e?.response?.status ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e?.response?.data);
          console.log('response.result: UserChangeAccountStatusPut: ', e?.response?.data?.message);
          errorMessage(e?.response?.data, 'UserChangeAccountStatusPut');
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
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
          console.log('response.result: UserDelete: ', response);
          if(response.data.code === 200){
            res(response.data);
          }else{
            errorMessage(response.data, 'UserDelete');
          };
      })
      .catch(e => {
        if(e?.response?.status ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e?.response?.data);
          console.log('response.result: UserDelete: ', e?.response?.data?.message);
          errorMessage(e?.response?.data, 'UserDelete');
        }
      });
}