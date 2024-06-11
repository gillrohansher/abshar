import { api_config } from "../apis";
import { showNotification } from "@mantine/notifications";
import { APIClientPOST } from "./APIClient";

export async function SignInPost(data, res) {
      await APIClientPOST({
        url: api_config.authorization.signin.signin_post,
        data: data
      })
        .then(response => {
            console.log('response.result: SignInPost: ', response);
            res(response);
        })
        .catch(e => {
            console.log('response.result: SignInPost: ', e.response.data.message);
            showNotification({
              color: 'red',
              message: e.response.data.message
            })
        });
}

export async function SignUpPost(data, res) {
  await APIClientPOST({
    url: api_config.authorization.signup.signup_post,
    data: data
  })
    .then(response => {
        console.log('response.result: SignUpPost: ', response);
        res(response);
    })
    .catch(e => {
        console.log('error response.result: SignUpPost: ', e.response.data.message);
        showNotification({
          color: 'red',
          message: e.response.data.message
        })
    });
}