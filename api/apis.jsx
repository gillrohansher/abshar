let api_base_url = "http://admin.aabshar.net:9001/api/v1/";

export const api_config = {
  baseUrl: api_base_url,
  authorization: {
    signin: {
      signin_post: "user/login"
    },
    signup: {
      signup_post: "user/register",
      email_verification_put: "user/register-confirmation",
      resend_email_verification_put: "user/register-token-refresh"
    },
    forget_password: {
      reset_password: "user/reset-password",
      reset_password_confirm: "user/reset-password-confirm"
    }
  }
};
