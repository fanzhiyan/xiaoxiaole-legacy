/*
 * @User: 十八
 * @Date: 2023-07-19 17:11:59
 * @libs: axios uniapp-axios-adapter
 */

import axios, { CancelTokenSource, AxiosInstance, CancelToken, AxiosRequestConfig } from "axios";
import config from "@/shiba/config/config";
import { ParamsConfig, DataResponse, AxiosResponseShiBa } from "./request.d";
// #ifdef APP-PLUS ||H5
import { UniAdapter } from "uniapp-axios-adapter";
// #endif
// #ifdef MP-WEIXIN
import UniAdapter from "axios-miniprogram-adapter";
// #endif
import shiba from "..";

const { Token_Name, VUE_APP_API_URL, VUE_APP_APIFiX_URL } = config;

class ShiBaHttp {
  private instance: AxiosInstance;
  private cancelTokenSource: CancelTokenSource | null;

  constructor() {
    this.instance = axios.create({
      baseURL: VUE_APP_API_URL,
      timeout: 10000,
      adapter: UniAdapter,
    });
    this.cancelTokenSource = null;
    this.initInterceptors();
  }

  // 初始化拦截器
  private initInterceptors() {
    this.instance.interceptors.request.use(
      (config: ParamsConfig) => this.handleRequest(config),
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponseShiBa) => this.handleSuccessResponse(response),
      (error) => this.handleErrorResponse(error)
    );
  }

  // 处理请求
  private handleRequest(config: ParamsConfig) {
    const token = shiba.$store("user")[Token_Name] || uni.getStorageSync(Token_Name);
    // const token = '654207b7-470e-41ac-947e-277a26cbadff'

    if (token) {
      config.headers[Token_Name] = token;
    }
    return config;
  }

  // 处理成功响应
  private async handleSuccessResponse(response: AxiosResponseShiBa) {
    if (response.status == 200) {
      this.handleToken(response);
      await this.handleStatusCode(response);
      return Promise.resolve(response.data);
    } else {
      this.handleMessage(response);
      await this.handleErrorResponse(response);
    }
  }

  // 处理错误响应
  private handleErrorResponse(error: any) {
    if (error.response && error.response.status === 401) {
      this.handleUnauthorized();
    } else {
      this.handleMessage(error.response);
    }

    return Promise.reject(error);
  }

  // 处理Token
  private handleToken(response: AxiosResponseShiBa) {
    // #ifdef MP-WEIXIN
    if (response.headers[Token_Name]) {
      shiba.$store("user").SETKEYDATA(Token_Name, response?.headers[Token_Name] || "");
      shiba.$store("user").SETKEYDATA("isLogin", true);
      shiba.$store("user").GetUser();
    }
    // #endif
    // #ifdef APP ||H5
    if (response.header[Token_Name]) {
      shiba.$store("user").SETKEYDATA(Token_Name, response?.headers[Token_Name] || "");
      shiba.$store("user").SETKEYDATA("isLogin", true);
      shiba.$store("user").GetUser();
    }
    // #endif
  }

  // 处理消息提示
  private handleMessage(response: AxiosResponseShiBa) {
    if (response?.status == 500) {
      return uni.showToast({
        icon: "none",
        title: "系统内部繁忙 稍后再试",
      });
    }
    if (response?.config?.isMsg && response?.data?.msg) {
      uni.showToast({
        icon: "none",
        title: response.data.msg,
      });
    }
  }

  // 处理状态码
  private handleStatusCode(response: AxiosResponseShiBa) {
    if (response.data.code == 1) {
      return Promise.resolve(response.data.msg);
    } else if (response.data.code == 0) {
      this.handleMessage(response);
      return Promise.reject(response.data.msg);
    } else if (response.data.code == 2) {
		uni.showModal({
		  title: "认证提示",
		  content: "您还未进行跑腿实名认证，请先进行认证",
		  confirmText: "立即认证",
		  success: (res) => {
		    if (res.confirm) {
		      uni.$u.route({
		        url: "/pages/errand/errand-auth",
		      });
		    }
		  },
		});
      return Promise.reject(response.data);
    } else if (response.data.code == 3) {
      uni.showModal({
        title: "认证提示",
        content: "您还未进行实名认证，请先进行实名认证",
        confirmText: "立即认证",
        success: (res) => {
          if (res.confirm) {
            uni.$u.route({
              url: "/pages/public/real-auth",
            });
          }
        },
      });
      return Promise.reject(response.data);
    } else if (response.data.code == 4) {
      uni.showModal({
        title: "认证提示",
        content: "您的认证在审核中，请等待审核通过",
        success: (res) => {
          if (res.confirm) {
          }
        },
      });
      return Promise.reject(response.data);
    } else if (response.data.code == 5) {
      uni.showModal({
        title: "认证提示",
        confirmText: "重新提交",
        content: "您的审核失败，请重新提交",
        success: (res) => {
          if (res.confirm) {
            uni.$u.route({
              url: "/pages/public/real-auth",
            });
          }
        },
      });
      return Promise.reject(response.data);
    } else if (response.data.code == 11) {
      uni.showModal({
        title: "温馨提示",
        content: `您未加圈，需加圈后使用`,
        confirmText: "确认加圈",

        success: (res) => {
          if (res.confirm) {
            shiba.$api.public
              .applyJoin({
                topic_id: uni.$store("app").user_topic_id,
              })
              .then((eee) => {
                uni.showModal({
                  title: "温馨提示",
                  content: "已加入圈子",
                  showCancel: !true,
                  confirmText: "我知道了",
                });
              });
          }
        },
      });
      return Promise.reject(response.data);
    } else if (response.data.code == 10) {
      uni.showModal({
        title: "温馨提示",
        confirmText: "前往缴纳",
        content: "保证金不足，请缴纳后接单",
        success: (res) => {
          if (res.confirm) {
            uni.$u.route({
              url: "/pages/errand/earnest",
            });
          }
        },
      });
      return Promise.reject(response.data);
    } else if (response.data.code == 21) {
      return Promise.reject(response.data);
    } else if (response.data.code == 401) {
      this.handleUnauthorized();
      return Promise.reject(response.data.msg);
    } else {
      return Promise.reject("请求失败");
    }
  }

  // 处理未授权
  private handleUnauthorized() {
    // uni.showToast({
    //   title: "请重新登录",
    //   icon: "error",
    // });

    // #ifdef MP||H5
    uni.$store("modal").SETKEYDATA("Auth", false);
    setTimeout(() => {
      uni.$store("modal").SETKEYDATA("Auth", true);
    }, 200);
    // #endif
  }

  public async get<T>(url: string, config?: Partial<ParamsConfig>): Promise<DataResponse<T>> {
    try {
      return await this.instance.get(url, {
        ...config,
        cancelToken: this.getCancelToken(),
      } as AxiosRequestConfig<T>);
    } catch (error) {
      throw error;
    }
  }

  public async post<T>(url: string, data?: any, config?: Partial<ParamsConfig>): Promise<DataResponse<T>> {
    try {
      return await this.instance.post(url, data, {
        ...config,
        cancelToken: this.getCancelToken(),
      } as AxiosRequestConfig<T>);
    } catch (error) {
      throw error;
    }
  }

  public async del<T>(url: string, config?: Partial<ParamsConfig>): Promise<DataResponse<T>> {
    try {
      return await this.instance.delete(url, {
        ...config,
        cancelToken: this.getCancelToken(),
      } as AxiosRequestConfig<T>);
    } catch (error) {
      throw error;
    }
  }

  public async action<T>(action: string, url: string, config?: Partial<ParamsConfig>): Promise<DataResponse<T>> {
    if (action.toLowerCase() === "get") {
      return this.get<T>(url, { ...config, data: config?.data });
    }
    if (action.toLowerCase() === "del") {
      return this.del<T>(url, { ...config, data: config?.data });
    }
    if (action.toLowerCase() === "post") {
      return this.post(url, config?.data, config);
    }
  }

  private getCancelToken(): CancelToken {
    this.cancelTokenSource = axios.CancelToken.source();
    return this.cancelTokenSource.token;
  }

  public async cancelRequest(): Promise<void> {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
      this.cancelTokenSource = null;
    }
  }
}

export default new ShiBaHttp();
