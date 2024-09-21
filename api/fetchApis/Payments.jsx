import { api_config } from "../apis";
import { showNotification } from "@mantine/notifications";
import { APIClientDELETE, APIClientGET, APIClientPOST, APIClientPUT } from "./APIClient";
import { clearStorageRedirectLogin, getAuthToken } from "../../helpers/helpers";

export async function PaymentPost(data, token, res) {
    let formData = new URLSearchParams();
    
    formData.append('totalAmount', data.totalAmount);
    formData.append('paymentMethod', data.paymentMethod);
    formData.append('redirection', data.redirection);
    await APIClientPOST({
      url: api_config.payment.payment_post,//+'?totalAmount='+data.totalAmount+'&paymentMethod='+data.paymentMethod+'&redirection='+data.redirection,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
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
            res(e?.response?.data);
            console.log('response.result: PaymentPost: ', e?.response?.data?.message);
            showNotification({
              title: 'Failed',
              color: 'red',
              message: e?.message,
              id: 'PaymentPostError'
            });
          }
      });
}

export async function PageRedirectionRequestPost(data, token, res) {
  let formData = new URLSearchParams();

  formData.append('AuthToken', data.authToken);
  formData.append('RequestHash', data.hash);
  formData.append('ChannelId', '1001');
  formData.append('Currency', 'PKR');
  formData.append('IsBIN', '0');
  formData.append('ReturnURL', data.returnUrl);
  formData.append('MerchantId', '12086');
  formData.append('StoreId', '018863');
  formData.append('MerchantHash', 'OUU362MB1upz28dqed/v1qBU8zZmj5+u0N/WP+MBePw=');
  formData.append('MerchantUsername', 'lefolu');
  formData.append('MerchantPassword', 'L7gp7NhZ4W5vFzk4yqF7CA==');
  formData.append('TransactionTypeId', '3');
  formData.append('TransactionReferenceNumber', data.refNumber);
  formData.append('TransactionAmount', data.totalAmount);



  await APIClientPOST({
    url: 'https://sandbox.bankalfalah.com/SSO/SSO/SSO',
    data: formData,
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
          res(e);
          console.log('response.result: PageRedirectionRequestPost: ', e);
          showNotification({
            title: 'Failed',
            color: 'red',
            message: e?.message,
            id: 'PageRedirectionRequestPostError'
          });
        }
    });
}