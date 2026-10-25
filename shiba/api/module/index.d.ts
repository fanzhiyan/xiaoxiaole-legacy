import { AxiosResponseShiBa } from "../request.d";
import { ApiType } from "./api/index";
import { UploadType } from "./upload/index";
import { PublicType } from "./public/index";
import { WechatType } from "./wechat/index";

export interface Modules {
  api: ApiType;
  upload: UploadType;
  public: PublicType;
  wechat: WechatType;
  // 可以继续添加其他模块的类型
}
