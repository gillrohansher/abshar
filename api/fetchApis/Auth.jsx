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
            if(response.data.code === 200){
            res(response.data);
          }else{
            errorMessage(response.data, 'SignInPost');
          };
        })
        .catch(e => {
          if(e?.response?.status ===  401){
            clearStorageRedirectLogin();
          }else{
            res(e?.response?.data);
            console.log('response.result: SignInPost: ', e?.response?.data?.message);
            errorMessage(e?.response?.data, 'SignInPost');
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
        if(response.data.code === 200){
            res(response.data);
          }else{
            errorMessage(response.data, 'SignUpPost');
          };
    })
    .catch(e => {
        console.log('error: ', e);
        if(e?.response?.status ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e?.response?.data);
          console.log('response.result: SignUpPost: ', e?.response?.data?.message);
          errorMessage(e?.response?.data, 'SignUpPost');
        }
        
    });
}

export async function EmailVerificationPut(data, res) {
  await APIClientPUT({
    url: api_config.authorization.signup.email_verification_put+`/${data}`
  })
    .then(response => {
        console.log('response.result: EmailVerificationPut: ', response);
        if(response.data.code === 200){
            res(response.data);
          }else{
            errorMessage(response.data, 'EmailVerificationPut');
          };
    })
    .catch(e => {
        console.log('error: ', e);
        if(e?.response?.status ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e?.response?.data);
          console.log('response.result: EmailVerificationPut: ', e?.response?.data?.message);
          errorMessage(e?.response?.data, 'EmailVerificationPut');
        }
        
    });
}

export async function ResendEmailVerificationPut(data, res) {
  await APIClientPUT({
    url: api_config.authorization.signup.resend_email_verification_put+`/${data}`
  })
    .then(response => {
        console.log('response.result: ResendEmailVerificationPut: ', response);
        if(response.data.code === 200){
            res(response.data);
          }else{
            errorMessage(response.data, 'ResendEmailVerificationPut');
          };
    })
    .catch(e => {
        console.log('error: ', e);
        if(e?.response?.status ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e?.response?.data);
          console.log('response.result: ResendEmailVerificationPut: ', e?.response?.data?.message);
          errorMessage(e?.response?.data, 'ResendEmailVerificationPut');
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
        if(response.data.code === 200){
            res(response.data);
          }else{
            errorMessage(response.data, 'ResetPasswordPost');
          };
    })
    .catch(e => {
        console.log('error: ', e);
        if(e?.response?.status ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e?.response?.data);
          console.log('response.result: ResetPasswordPost: ', e?.response?.data?.message);
          errorMessage(e?.response?.data, 'ResetPasswordPost');
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
        if(response.data.code === 200){
            res(response.data);
          }else{
            errorMessage(response.data, 'ResetPasswordConfirmPost');
          };
    })
    .catch(e => {
        console.log('error: ', e);
        if(e?.response?.status ===  401){
          clearStorageRedirectLogin();
        }else{
          res(e?.response?.data);
          console.log('response.result: ResetPasswordConfirmPost: ', e?.response?.data?.message);
          errorMessage(e?.response?.data, 'ResetPasswordConfirmPost');
        }
        
    });
}