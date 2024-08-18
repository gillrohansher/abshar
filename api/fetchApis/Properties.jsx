import { api_config } from "../apis";
import { showNotification } from "@mantine/notifications";
import { APIClientDELETE, APIClientGET, APIClientPOST, APIClientPUT } from "./APIClient";
import { clearStorageRedirectLogin, getAuthToken } from "../../helpers/helpers";


export async function PropertiesGet(data, type, token, res) {
    let baseUrl = api_config.properties.property_get;
    let url = data ? data.requestedId !== undefined ? `${baseUrl}?requestedId=${data.requestedId}` : data.assigneeId ? `${baseUrl}?assigneeId=${data.assigneeId}` : baseUrl : baseUrl;
    url = type ? (url.includes('?') ? url+'&type='+type : url+'?type='+type) : url;

    await APIClientGET({
      url,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json, text/plain, */*'
      }
    })
      .then(response => {
          console.log('response.result: PropertiesGet: ', response);
          res(response.data);
      })
      .catch(e => {
          if(e?.response?.data?.code ===  401){
            clearStorageRedirectLogin();
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

export async function PropertiesCountGet(data, token, res) {
  await APIClientGET({
    url: api_config.properties.property_count_get+'?userId='+data,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json, text/plain, */*'
    }
  })
    .then(response => {
        console.log('response.result: PropertiesGet: ', response);
        res(response.data);
    })
    .catch(e => {
        if(e?.response?.data?.code ===  401){
          clearStorageRedirectLogin();
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

export async function PropertiesBillEstimateGet(data, token, res) {
  let baseUrl= api_config.properties.property_bill_estimate_get+'?percent=85&startDate='+data?.startDate+'&endDate='+data?.endDate;
  let url= data.summarized !== undefined ? (baseUrl+'&summarized='+data.summarized) : data.propertyId !== undefined ? (baseUrl+'&propertyId='+data.propertyId) : baseUrl;
  await APIClientGET({
    
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json, text/plain, */*'
    }
  })
    .then(response => {
        console.log('response.result: PropertiesBillEstimateGet: ', response);
        res(response.data);
    })
    .catch(e => {
        if(e?.response?.data?.code ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e?.response?.data);
          console.log('response.result: PropertiesBillEstimateGet: ', e?.response?.data?.message);
          showNotification({
            title: 'Failed',
            color: 'red',
            message: e?.response?.data?.message,
            id: 'PropertiesBillEstimateGetError'
          });
        }
    });
}

export async function PropertiesPost(data, token, res) {
    await APIClientPOST({
      url: api_config.properties.property_post,
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
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

export async function PropertiesPut(data, token, res) {
  await APIClientPUT({
    url: api_config.properties.property_put,
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
    .then(response => {
        console.log('response.result: PropertiesPut: ', response);
        res(response.data);
    })
    .catch(e => {
        if(e.response.data.code ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e.response.data);
          console.log('response.result: PropertiesPut: ', e.response.data.message);
          showNotification({
            title: 'Failed',
            color: 'red',
            message: e.response.data.message,
            id: 'PropertiesPutError'
          });
        }
    });
}

export async function PropertyUploadImagePost(data, token, res) {
  await APIClientPOST({
    url: api_config.properties.property_upload_image,
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
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
      Authorization: `Bearer ${token}`,
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

export async function PropertyChangeStatusPut(id, status, token, res) {
  let data = new FormData();
  data.append('id', id);
  data.append('status', status);
    await APIClientPUT({
      url: api_config.properties.property_change_status,//+`?${ids.map((id, index)=> `${index > 0 ? '&' : ''}ids=${id}`)}&status=${status}`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
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

export async function PropertyDeleteImages(propertyId, imageId, token, res) {
  let data = new FormData();
  data.append('propertyId', propertyId);
  data.append('imageIds', imageId);
  await APIClientDELETE({
    url: api_config.properties.property_delete+'images',
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
    .then(response => {
        console.log('response.result: PropertyDeleteImages: ', response);
        res(response.data);
    })
    .catch(e => {
        if(e.response.data.code ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e.response.data);
          console.log('response.result: PropertyDeleteImages: ', e.response.data.message);
          showNotification({
            title: 'Failed',
            color: 'red',
            message: e.response.data.message,
            id: 'PropertyDeleteImagesError'
          });
        }
    });
}