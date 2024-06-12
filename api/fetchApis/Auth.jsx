import { api_config } from "../apis";
import { showNotification } from "@mantine/notifications";
import { APIClientPOST } from "./APIClient";
import { clearStorageRedirectLogin } from "../../helpers/helpers";

export async function SignInPost(data, res) {
      await APIClientPOST({
        url: api_config.authorization.signin.signin_post,
        data: data
      })
        .then(response => {
            console.log('response.result: SignInPost: ', response);
            res(response.data);
        })
        .catch(e => {
            if(e.response.data.code ===  401){
              clearStorageRedirectLogin();
            }else{
              res(e.response.data);
              console.log('response.result: SignInPost: ', e.response.data.message);
              showNotification({
                title: 'Failed',
                color: 'red',
                message: e.response.data.message
              });
            }
        });
}

export async function SignUpPost(data, res) {
  await APIClientPOST({
    url: api_config.authorization.signup.signup_post,
    data: data
  })
    .then(response => {
        console.log('response.result: SignUpPost: ', response);
        res(response.data);
    })
    .catch(e => {
        console.log('error: ', e);
        if(e.response.data.code ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e.response.data);
          console.log('error response.result: SignUpPost: ', e.response.data.message);
          showNotification({
            title: 'Failed',
            color: 'red',
            message: e.response.data.message
          });
        }
        
    });
}