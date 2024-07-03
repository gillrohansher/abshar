import { api_config } from "../apis";
import { showNotification } from "@mantine/notifications";
import { APIClientPOST, APIClientPUT } from "./APIClient";
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

export async function EmailVerificationPut(data, res) {
  await APIClientPUT({
    url: api_config.authorization.signup.email_verification_put+`/${data}`
  })
    .then(response => {
        console.log('response.result: EmailVerificationPut: ', response);
        res(response.data);
    })
    .catch(e => {
        console.log('error: ', e);
        if(e.response.data.code ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e.response.data);
          console.log('error response.result: EmailVerificationPut: ', e.response.data.message);
          showNotification({
            title: 'Failed',
            color: 'red',
            message: e.response.data.message
          });
        }
        
    });
}

export async function ResendEmailVerificationPut(data, res) {
  await APIClientPUT({
    url: api_config.authorization.signup.resend_email_verification_put+`/${data}`
  })
    .then(response => {
        console.log('response.result: ResendEmailVerificationPut: ', response);
        res(response.data);
    })
    .catch(e => {
        console.log('error: ', e);
        if(e.response.data.code ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e.response.data);
          console.log('error response.result: ResendEmailVerificationPut: ', e.response.data.message);
          showNotification({
            title: 'Failed',
            color: 'red',
            message: e.response.data.message
          });
        }
        
    });
}

export async function ResetPasswordPost(data, res) {
  await APIClientPOST({
    url: api_config.authorization.forget_password.reset_password,
    data: data
  })
    .then(response => {
        console.log('response.result: ResetPasswordPost: ', response);
        res(response.data);
    })
    .catch(e => {
        console.log('error: ', e);
        if(e.response.data.code ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e.response.data);
          console.log('error response.result: ResetPasswordPost: ', e.response.data.message);
          showNotification({
            title: 'Failed',
            color: 'red',
            message: e.response.data.message
          });
        }
        
    });
}

export async function ResetPasswordConfirmPost(data, res) {
  await APIClientPOST({
    url: api_config.authorization.forget_password.reset_password_confirm,
    data: data
  })
    .then(response => {
        console.log('response.result: ResetPasswordConfirmPost: ', response);
        res(response.data);
    })
    .catch(e => {
        console.log('error: ', e);
        if(e.response.data.code ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e.response.data);
          console.log('error response.result: ResetPasswordConfirmPost: ', e.response.data.message);
          showNotification({
            title: 'Failed',
            color: 'red',
            message: e.response.data.message
          });
        }
        
    });
}