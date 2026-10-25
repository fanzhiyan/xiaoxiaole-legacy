import type { AxiosInstance, AxiosRequestHeaders, AxiosRequestConfig, AxiosResponse } from "axios";

//  定义返回------------------------------------
// 后端返回数据结构
export interface DataResponse<T> {
	code : number,
	data : T,
	time : number,
	msg : string
}

// 重新定义返回结构
// 配置返回 Header
interface headerData {
	header : {
		token ?: string
	}
}
// 配置config项目
interface configResponse {
	config : {
		isMsg ?: boolean;
		updateToken ?: boolean,
		isLoading ?: boolean;
		// 是否需要登录 如果需要登录 会弹出是否跳转登录页
		isLogin ?: boolean,
	}
}

type AxiosResponseShiBa<T = any> = AxiosResponse<DataResponse<T>> & headerData & configResponse


//  定义传入参数------------------------------------


// 限制返回是否包含config
interface requestConfig {
	isMsg ?: boolean,
	isLoading ?: boolean,
	isLogin ?: boolean,
	headers : AxiosRequestHeaders & { token : string }
}
type ParamsConfig = AxiosRequestConfig & requestConfig

export {
	AxiosResponseShiBa,
	AxiosResponse,
	ParamsConfig,
	AxiosInstance,
	AxiosRequestConfig
}