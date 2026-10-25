import request from "@/shiba/api/request";
import { DataResponse, Data } from "@/shiba/api/request.d";

export const init = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/index/init", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 获取置顶价格

export const getTopUp = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/grass.grass_topic/getTopUp", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

//发送验证码
export const SendSmS = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.sms/send", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

//注册
export const register = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.login/register", {
    isMsg: true,
    isLoading: true,
    isLogin: false,
    data: params,
  });
};

//忘记密码
export const resetPassword = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.login/resetpwd", {
    isMsg: true,
    isLoading: true,
    isLogin: false,
    data: params,
  });
};

// 账号密码登
export const accountLogin = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.login/login", {
    isMsg: true,
    isLoading: true,
    isLogin: false,
    data: params,
  });
};

// 获取用户信息
export const GetUserInfo = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/user.user/userInfo", {
    isMsg: false,
    isLoading: true,
    isLogin: false,
    data: params,
  });
};

// 验证码登录
export const SmSLogin = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.login/mobilelogin", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 三方登录 platform （wechatmini：微信小程序，app_weixin：微信app，h5_weixin：微信公众号，mp_qq：QQ小程序，app_qq：QQAPP，h5_qq：QQ网页，app_weibo：微博App，app_xiaomi：小米App，apple：苹果）
export const ThirdLogin = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.login/third", {
    isMsg: true,
    isLoading: true,
    isLogin: false,
    data: params,
  });
};

// 修改用户信息
export const EditUserProfile = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.user/profile", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 旧密码重置密码
export const changePassword = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.login/changePassword", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 旧密码重置密码
export const CodeResetPwd = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.login/resetpwd", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 旧密码重置密码
export const CheckSmS = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.sms/check", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 注销账号 原因
export const GetLogoffReason = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/user.logoff/logoff_reason", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};
// 查询注销进度
export const GetLogoffCheck = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/user.logoff/logoff_check", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};
// 提交注销
export const ApplyLogoff = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.logoff/apply_logoff", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// ---------------------------------------------------------------------------------------------------
//  地址
// ---------------------------------------------------------------------------------------------------

// 添加地址
export const createAddress = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.address/add", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

//获取地址
export const GetAddressList = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/user.address/index", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 删除地址
export const DeleteAddress = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("del", "/user.address/delete", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 编辑地址
export const UpdateAddress = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.address/edit", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 获取
export const GetAddressDetail = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/user.address/detail", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 获取地址JSON
export const GetArea = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/common.area/index", {
    isMsg: false,
    isLoading: false,
    isLogin: false,
    data: params,
  });
};

// 获取地址标签
export const GetAddressTag = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/user.address/get_label", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 添加地址标签
export const AddAddressTag = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/user.address/add_label", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 删除地址标签
export const DeleteAddressTag = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/user.address/del_label", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 协议 id
export const GetRichtext = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/common.richtext/index", {
    isMsg: false,
    isLoading: true,
    isLogin: false,
    data: params,
  });
};

// 我的钱包
export const GetWalletLog = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/user.wallet_log", {
    isMsg: !true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// ---------------------------------------------------------------------------------------------------
//  常见问题 问题反馈
// ---------------------------------------------------------------------------------------------------

// 常见问题
export const GetCommonIndex = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/common.faq/index", {
    isMsg: !true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 常见问题
export const GetCommonDetail = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/common.faq/detail", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 问题反馈列表
export const GetFeedbackTypeList = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/common.feedback/type_list", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 问题反馈提交
export const AddFeedback = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/common.feedback/add_feedback", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 反馈列表
export const GetFeedbackList = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/common.feedback/feedback_list", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 小程序登录 可以优化 但后端暂时这样
export const wxLogin = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/user.login/wxLogin", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 获取用户主页细腻 user_id
export const GetUserIndex = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/userIndex", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 我的消息
export const GetNotification = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/notification/getNotification", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 今日热门
export const DayHotGrassTopic = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/dayHot", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 公告
export const NotificationDetail = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/notification/detail", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 今日热门
export const QwRoomCode = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/qw_room_code", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 动态发布价格
export const CycleList = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/cycle_list", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 动态发布支付获取信息
export const SubmitPay = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/pay/submit", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *
 *
 *
 *
 * 新的
 */

export const GetClassify = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/index/classify", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 获取圈子分类
export const getGrassType = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/getGrassType", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 获取圈子动态
export const getGrass = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/getGrass", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 获取我发布的圈子动态
export const myGrass = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/myGrass", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 点赞
export const likeGrass = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/likeGrass", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 跑腿列表
export const GrassRunErrands = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_run_errands/list", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 身份认证
export const GetIdentityAuth = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.user/identityAuth", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 跑腿身份认证
export const runAuth = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.user/runAuth", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 跑腿发布人取消订单
export const GrassRunErrandsCancel = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_run_errands/cancel", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 跑腿发布人取消订单
export const getNotification = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/notification/getNotification", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 跑腿接单人审核取消订单
export const receiveAuthCancel = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_run_errands/receiveAuthCancel", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 跑腿接单人审核取消订单
export const DelRunOrder = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_run_errands/delRun", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 消息分类列表内容
export const GetNoticeInfo = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/notification/getList", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 消息分类列表内容
export const GetSwiper = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/banner", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 消息获取列表
export const GetMyComment = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.user/getMyComment", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 消息获取列表
export const GrassDelItem = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/grassDel", {
    isMsg: false,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 * 删除评论
 * @param params - 。
 * @returns 返回一个Promise对象
 * @httpMethod GET
 */
export const delComment = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/delComment", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 * 我的认证信息
 * @param params - 。
 * @returns 返回一个Promise对象
 * @httpMethod GET
 */
export const getMyAuth = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.user/getMyAuth", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 * 退保证金
 * @param params - 。
 * @returns 返回一个Promise对象
 * @httpMethod GET
 */
export const applyRefundEarnestMoney = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.user/applyRefundEarnestMoney", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 * 保证金明细
 * @param params - 。
 * @returns 返回一个Promise对象
 * @httpMethod GET
 */
export const earnestMoneyLog = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.user/earnestMoneyLog", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 * 保证金交纳保证金
 * @param params - 。
 * @returns 返回一个Promise对象
 * @httpMethod GET
 */
export const payEarnestMoney = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.user/payEarnestMoney", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 * 获取订单发起弹窗
 * @param params - 。
 * @returns 返回一个Promise对象
 * @httpMethod GET
 */
export const GrassGrassRunErrands = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_run_errands/list", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 * 获取分类详情
 * @param params - 。
 * @returns 返回一个Promise对象
 * @httpMethod GET
 */
export const GetClassifyDetail = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/index/classifyDetail", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 * 获取轮播图详情
 * @param params - 。
 * @returns 返回一个Promise对象
 * @httpMethod GET
 */
export const GetBannerDetail = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/bannerDetail", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 * 获取轮播图详情
 * @param params - 。
 * @returns 返回一个Promise对象
 * @httpMethod GET
 */
export const BindWxCodePhone = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.login/bindMobile", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};
