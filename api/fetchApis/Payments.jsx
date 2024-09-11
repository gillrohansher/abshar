import { api_config } from "../apis";
import { showNotification } from "@mantine/notifications";
import { APIClientDELETE, APIClientGET, APIClientPOST, APIClientPUT } from "./APIClient";
import { clearStorageRedirectLogin, getAuthToken } from "../../helpers/helpers";

export async function PaymentPost(data, token, res) {
    await APIClientPOST({
      url: api_config.payment.payment_post+'?totalAmount='+data.totalAmount+'&paymentMethod='+data.paymentMethod+'&redirection='+data.redirection,
      // data: data,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
          console.log('response.result: PaymentPost: ', response);
          res(response.data);
      })
      .catch(e => {
        if(e?.response?.status ===  401){
          clearStorageRedirectLogin();
        }else{
            res(e.response.data);
            console.log('response.result: PaymentPost: ', e.response.data.message);
            showNotification({
              title: 'Failed',
              color: 'red',
              message: e.message,
              id: 'PaymentPostError'
            });
          }
      });
}

export async function PageRedirectionRequestPost(data, token, res) {
  await APIClientPOST({
    url: 'https://sandbox.bankalfalah.com/SSO/SSO/SSO',
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8"
    }
  })
    .then(response => {
        console.log('response.result: PageRedirectionRequestPost: ', response);
        res(response.data);
    })
    .catch(e => {
      if(e?.response?.status ===  401){
        clearStorageRedirectLogin();
      }else{
          res(e.response.data);
          console.log('response.result: PageRedirectionRequestPost: ', e.response.data.message);
          showNotification({
            title: 'Failed',
            color: 'red',
            message: e.message,
            id: 'PageRedirectionRequestPostError'
          });
        }
    });
}