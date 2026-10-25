import { DataResponse } from "@/shiba/api/request.d";
export interface WechatType {
  // 微信登录
  wxLogin<T, S>(params: T): Promise<DataResponse<S>>;
}
