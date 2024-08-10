//let api_base_url = "http://admin.aabshar.net:9001/api/v1/";
let api_base_url = "https://www.admin.aabshar.net/api/v1/";

export const api_config = {
  baseUrl: api_base_url,
  authorization: {
    signin: {
      signin_post: "auth/login"
    },
    signup: {
      signup_post: "auth/register",
      email_verification_put: "auth/register-confirmation",
      resend_email_verification_put: "auth/register-token-refresh"
    },
    forget_password: {
      reset_password: "auth/reset-password",
      reset_password_confirm: "auth/reset-password-confirm"
    }
  },
  products:{
    product_get: "product/all",
    product_post: "product/add",
    product_put: "product/update",
    product_delete: "product/delete/",
  },
  properties:{
    property_get: "property/all",
    property_count_get: "property/count",
    property_post: "property/add",
    property_put: "property/update",
    property_delete: "property/delete/",
    property_change_status: "property/change-status",
    property_upload_image: "property/upload/images",
    property_upload_feature_image: "property/upload/feature-image"
  },
  users: {
    user_post: "user/create",
    user_get: "user/all",
    user_put: "user/update",
    user_delete: "user/delete",
    user_change_role: "user/change/role",
    user_change_account_status: "user/change/account-status"
  }
};
