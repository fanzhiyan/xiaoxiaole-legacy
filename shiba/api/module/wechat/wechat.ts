import request from "@/shiba/api/request";
import { AxiosResponseShiBa } from "@/shiba/api/request.d";

// 微信登录
export const wxLogin = <T, S>(params: any): Promise<AxiosResponseShiBa<S>> => {
  return request.action<T>("post", "/api/user.login/wxLogin", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};
