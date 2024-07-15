import { api_config } from "../apis";
import { showNotification } from "@mantine/notifications";
import { APIClientDELETE, APIClientGET, APIClientPOST, APIClientPUT } from "./APIClient";
import { clearStorageRedirectLogin, getAuthToken } from "../../helpers/helpers";


export async function PropertiesGet(data, token, res) {
    await APIClientGET({
      url: api_config.properties.property_get,
      headers: {
        Authorization: token,
        Accept: 'application/json, text/plain, */*'
      }
    })
      .then(response => {
          console.log('response.result: PropertiesGet: ', response);
          res(response.data);
      })
      .catch(e => {
          if(e?.response?.data?.code ===  401){
            //clearStorageRedirectLogin();
          }else{
            res(e?.response?.data);
            console.log('response.result: PropertiesGet: ', e?.response?.data?.message);
            showNotification({
              title: 'Failed',
              color: 'red',
              message: e?.response?.data?.message,
              id: 'PropertiesGetError'
            });
          }
      });
}

export async function PropertiesPost(data, token, res) {
    await APIClientPOST({
      url: api_config.properties.property_post,
      data: data,
      headers: {
        Authorization: token,
      }
    })
      .then(response => {
          console.log('response.result: PropertiesPost: ', response);
          res(response.data);
      })
      .catch(e => {
          if(e.response.data.code ===  401){
            clearStorageRedirectLogin();
          }else{
            res(e.response.data);
            console.log('response.result: PropertiesPost: ', e.response.data.message);
            showNotification({
              title: 'Failed',
              color: 'red',
              message: e.response.data.message,
              id: 'PropertiesPostError'
            });
          }
      });
}

export async function PropertyUploadImagePost(data, token, res) {
  await APIClientPOST({
    url: api_config.properties.property_upload_image,
    data: data,
    headers: {
      Authorization: token,
    }
  })
    .then(response => {
        console.log('response.result: PropertyUploadImagePost: ', response);
        res(response.data);
    })
    .catch(e => {
        if(e.response.data.code ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e.response.data);
          console.log('response.result: PropertyUploadImagePost: ', e.response.data.message);
          showNotification({
            title: 'Failed',
            color: 'red',
            message: e.response.data.message,
            id: 'PropertyUploadImagePostError'
          });
        }
    });
}

export async function PropertyUploadFeatureImagePost(data, token, res) {
  await APIClientPOST({
    url: api_config.properties.property_upload_feature_image,
    data: data,
    headers: {
      Authorization: token,
    }
  })
    .then(response => {
        console.log('response.result: PropertyUploadFeatureImagePost: ', response);
        res(response.data);
    })
    .catch(e => {
        if(e.response.data.code ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e.response.data);
          console.log('response.result: PropertyUploadFeatureImagePost: ', e.response.data.message);
          showNotification({
            title: 'Failed',
            color: 'red',
            message: e.response.data.message,
            id: 'PropertyUploadFeatureImagePostError'
          });
        }
    });
}

export async function PropertyChangeStatusPut(ids, status, token, res) {
  let data = new FormData();
  data.append('ids', ids);
  data.append('status', status);
    await APIClientPUT({
      url: api_config.properties.property_change_status,//+`?${ids.map((id, index)=> `${index > 0 ? '&' : ''}ids=${id}`)}&status=${status}`,
      data,
      headers: {
        Authorization: token,
      }
    })
      .then(response => {
          console.log('response.result: PropertyChangeStatusPut: ', response);
          res(response.data);
      })
      .catch(e => {
          if(e.response.data.code ===  401){
            clearStorageRedirectLogin();
          }else{
            res(e.response.data);
            console.log('response.result: PropertyChangeStatusPut: ', e.response.data.message);
            showNotification({
              title: 'Failed',
              color: 'red',
              message: e.response.data.message,
              id: 'PropertyChangeStatusPutError'
            });
          }
      });
}

export async function PropertiesDelete(data, token, res) {
    await APIClientDELETE({
      url: api_config.properties.property_delete+`${data}`,
      headers: {
        Authorization: token,
      }
    })
      .then(response => {
          console.log('response.result: PropertiesDelete: ', response);
          res(response.data);
      })
      .catch(e => {
          if(e.response.data.code ===  401){
            clearStorageRedirectLogin();
          }else{
            res(e.response.data);
            console.log('response.result: PropertiesDelete: ', e.response.data.message);
            showNotification({
              title: 'Failed',
              color: 'red',
              message: e.response.data.message,
              id: 'PropertiesDeleteError'
            });
          }
      });
}