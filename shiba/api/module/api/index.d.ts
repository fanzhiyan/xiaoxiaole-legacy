import { DataResponse } from "@/shiba/api/request.d";
export interface ApiType {
  // 发送验证码
  SendSmS<T, S>(params: T): Promise<DataResponse<S>>;

  // 注册
  register<T, S>(params: T): Promise<DataResponse<S>>;

  // 忘记密码
  resetPassword<T, S>(params: T): Promise<DataResponse<S>>;

  // 账号密码登录
  accountLogin<T, S>(params: T): Promise<DataResponse<S>>;

  // 获取用户信息
  GetUserInfo<T, S>(params: T): Promise<DataResponse<S>>;

  // 验证码登录
  SmSLogin<T, S>(params: T): Promise<DataResponse<S>>;

  // 三方登录
  ThirdLogin<T, S>(params: T): Promise<DataResponse<S>>;

  // 修改用户信息
  EditUserProfile<T, S>(params: T): Promise<DataResponse<S>>;

  // 旧密码重置密码
  changePassword<T, S>(params: T): Promise<DataResponse<S>>;

  // 旧密码重置密码
  CodeResetPwd<T, S>(params: T): Promise<DataResponse<S>>;

  // 验证验证码
  CheckSmS<T, S>(params: T): Promise<DataResponse<S>>;

  // 注销账号原因
  GetLogoffReason<T, S>(params: T): Promise<DataResponse<S>>;

  // 查询注销进度
  GetLogoffCheck<T, S>(params: T): Promise<DataResponse<S>>;

  // 提交注销
  ApplyLogoff<T, S>(params: T): Promise<DataResponse<S>>;

  // 添加地址
  createAddress<T, S>(params: T): Promise<DataResponse<S>>;

  // 获取地址列表
  GetAddressList<T, S>(params: T): Promise<DataResponse<S>>;

  // 删除地址
  DeleteAddress<T, S>(params: T): Promise<DataResponse<S>>;

  // 编辑地址
  UpdateAddress<T, S>(params: T): Promise<DataResponse<S>>;

  // 获取地址详情
  GetAddressDetail<T, S>(params: T): Promise<DataResponse<S>>;

  // 获取地址JSON
  GetArea<T, S>(params: T): Promise<DataResponse<S>>;

  // 获取地址标签
  GetAddressTag<T, S>(params?: T): Promise<DataResponse<S>>;

  // 添加地址标签
  AddAddressTag<T, S>(params: T): Promise<DataResponse<S>>;

  // 获取协议
  GetRichtext<T, S>(params: T): Promise<DataResponse<S>>;

  // 我的钱包
  GetWalletLog<T, S>(params: T): Promise<DataResponse<S>>;

  // 常见问题
  GetCommonIndex<T, S>(params: T): Promise<DataResponse<S>>;

  // 常见问题详情
  GetCommonDetail<T, S>(params: T): Promise<DataResponse<S>>;

  // 问题反馈类型列表
  GetFeedbackTypeList<T, S>(params: T): Promise<DataResponse<S>>;

  // 问题反馈提交
  AddFeedback<T, S>(params: T): Promise<DataResponse<S>>;

  // 反馈列表
  GetFeedbackList<T, S>(params: T): Promise<DataResponse<S>>;
  // 删除地址
  DeleteAddressTag<T, S>(params: T): Promise<DataResponse<S>>;
}
