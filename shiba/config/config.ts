// 请求基本路径
const VUE_APP_API_URL: string = import.meta.env.VUE_APP_API_URL;
const VUE_APP_APIFiX_URL: string = import.meta.env.VUE_APP_APIFiX_URL || "";
// 图片基本路径
const VUE_BASE_IMAGE_Url: string = import.meta.env.VUE_APP_BASE_IMAGE_URL || "";
// 上传基本路径
const VUE_BASE_UPLOAD: string = import.meta.env.VUE_APP_BASE_UPLOAD || "";

// Token 名称
const Token_Name: string = import.meta.env.VUE_APP_TOKEN_NAME || "";
// 用户名
const USERNAME: string = import.meta.env.VUE_APP_USERNAME || "";

export default {
  VUE_APP_APIFiX_URL,
  VUE_BASE_UPLOAD,
  USERNAME,
  Token_Name,
  VUE_APP_API_URL,
  VUE_BASE_IMAGE_Url,
};
