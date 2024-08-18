import { api_config } from "../apis";
import { showNotification } from "@mantine/notifications";
import { APIClientDELETE, APIClientGET, APIClientPOST, APIClientPUT } from "./APIClient";
import { clearStorageRedirectLogin, getAuthToken } from "../../helpers/helpers";


export async function ProductGet(data, token, res) {
    await APIClientGET({
      url: api_config.products.product_get,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json, text/plain, */*'
      }
    })
      .then(response => {
          console.log('response.result: ProductGet: ', response);
          res(response.data);
      })
      .catch(e => {
          if(e?.response?.data?.code ===  401){
            clearStorageRedirectLogin();
          }else{
            res(e?.response?.data);
            console.log('response.result: ProductGet: ', e?.response?.data?.message);
            showNotification({
              title: 'Failed',
              color: 'red',
              message: e?.response?.data?.message,
              id: 'ProductGetError'
            });
          }
      });
}

export async function ProductPost(data, token, res) {
    await APIClientPOST({
      url: api_config.products.product_post,
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
          console.log('response.result: ProductPost: ', response);
          res(response.data);
      })
      .catch(e => {
          if(e.response.data.code ===  401){
            clearStorageRedirectLogin();
          }else{
            res(e.response.data);
            console.log('response.result: ProductPost: ', e.response.data.message);
            showNotification({
              title: 'Failed',
              color: 'red',
              message: e.response.data.message,
              id: 'ProductPostError'
            });
          }
      });
}

export async function ProductPut(data, token, res) {
    await APIClientPUT({
      url: api_config.products.product_put,
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
          console.log('response.result: ProductPut: ', response);
          res(response.data);
      })
      .catch(e => {
          if(e.response.data.code ===  401){
            clearStorageRedirectLogin();
          }else{
            res(e.response.data);
            console.log('response.result: ProductPut: ', e.response.data.message);
            showNotification({
              title: 'Failed',
              color: 'red',
              message: e.response.data.message,
              id: 'ProductPutError'
            });
          }
      });
}

export async function ProductDelete(data, token, res) {
    await APIClientDELETE({
      url: api_config.products.product_delete+`${data}`,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
          console.log('response.result: ProductDelete: ', response);
          res(response.data);
      })
      .catch(e => {
          if(e.response.data.code ===  401){
            clearStorageRedirectLogin();
          }else{
            res(e.response.data);
            console.log('response.result: ProductDelete: ', e.response.data.message);
            showNotification({
              title: 'Failed',
              color: 'red',
              message: e.response.data.message,
              id: 'ProductDeleteError'
            });
          }
      });
}