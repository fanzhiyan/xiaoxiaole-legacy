import {DataResponse} from "@/shiba/api/request.d"
export interface UploadType {
    // 发送验证码
    uploadFile<T, S>(params: T): Promise<DataResponse<S>>;

}

