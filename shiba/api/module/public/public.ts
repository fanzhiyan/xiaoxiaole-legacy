import request from "@/shiba/api/request";
import { DataResponse, Data } from "@/shiba/api/request.d";

/**
 * 创建圈子接口。
 *
 * @param params - 注册所需参数对象，包含以下字段：
 *   - `token` (string, 需)：用户认证令牌。
 *   - `content` (string, 可选)：描述说明。
 *   - `wechatNo` (string, 选)：微信号。
 *   - `address` (string, 选)：地址。
 *   - `lat` (string, 选)：纬度。
 *   - `lng` (string, 可选)：经度。
 * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
 * @httpMethod POST
 */
export const CreateGrass_topic = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/apply", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 * 获取圈子接口。
 *
 * @param params - 注册所需参数对象，包含以下字段：
 * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
 *   - `keyword` (string, 可选)：搜索词。
 *   - `limit` (string, 可选)：微信号。
 * @httpMethod POST
 */
export const getGrassTopic = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/getGrassTopic", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 * 获取圈子分类。
 *
 * @param params - 注册所需参数对象，包含以下字段：
 * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
 *   - `keyword` (string, 可选)：搜索词。
 *   - `limit` (string, 可选)：微信号。
 * @httpMethod POST
 */
export const getGrassClassify = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/getGrassClassify", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 * 获取圈子动态。
 *
 * @param params - 注册所需参数对象，包含以下字段：
 * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
 * 	 - `topic_id`(string, 可选)：圈子id。
 *   - `keyword` (string, 可选)：搜索词。
 *   - `limit` (string, 可选)：微信号。
 * @httpMethod POST
 */
export const GetGrassInfo = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/getGrass", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 * 获取我的圈子
 *
 * @param params - 注册所需参数对象，包含以下字段：
 * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
 *   - `keyword` (string, 可选)：搜索词。
 *   - `limit` (string, 可选)：微信号。
 * @httpMethod POST
 */
export const myGrassTopic = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/myGrassTopic", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 * 获取圈子首页
 *
 * @param params - 注册所需参数对象，包含以下字段：
 * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
 *   - `keyword` (string, 可选)：搜索词。
 *   - `limit` (string, 可选)：微信号。
 * @httpMethod POST
 */
export const getGrassIndex = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/getGrassIndex", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 * 申请加入圈子
 *
 * @param params - 注册所需参数对象，包含以下字段：
 * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
 *   - `topic_id` (string, 可选)：圈子id。
 *   - `content` (string, 可选)：申请理由。
 *   - `image` (string, 可选)：图片。
 * @httpMethod POST
 */
export const applyJoin = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/applyJoin", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  获取圈友
 *
 * @param params - 注册所需参数对象，包含以下字段：
 * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
 *   - `topic_id` (string, 可选)：圈子id。
 *   - `limit` (string, 可选)：每页显示条数。
 * @httpMethod POST
 */
export const grassTopicFriend = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/grassTopicFriend", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  获取主页
 *
 * @param params - 注册所需参数对象，包含以下字段：
 * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
 *   - `user_id` (string, 可选)：用户id。
 *   - `limit` (string, 可选)：每页显示条数。
 * @httpMethod POST
 */
export const GetUserIndex = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/userIndex", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  今日热门
 *
 * @param params - 注册所需参数对象，包含以下字段：
 * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
 *   - `topic_id` (string, 可选)：用户id。
 * @httpMethod POST
 */
export const GetDayHot = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/dayHot", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  多校热门
 *
 * @param params - 注册所需参数对象，包含以下字段：
 * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
 * @httpMethod POST
 */
export const GetSchoolHot = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/schoolHot", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  申请退圈
 *
 * @param params - 注册所需参数对象，包含以下字段：
 * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
 * @httpMethod POST
 */
export const GrassTopicOut = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/grassTopicOut", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  发动态
 *
 * @param params -
 *   - `topic_id` (string, 可选)：圈子id。
 *   - `title` (string, 可选)：圈子id。
 *   - `introduce` (string, 可选)：圈子id。
 *   - `image` (string, 可选)：圈子id。
 *   - `label` (string, 可选)：标签id。
 *   - `contact_type` (string, 可选)：联系方式类型。
 *   - `contact_no` (string, 可选)：号码。
 * @httpMethod POST
 */
export const PublishGrass = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/publishGrass", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  获取圈子动态标签
 *
 * @param params -
 * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
 * @httpMethod POST
 */
export const getGrassLabel = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/getGrassLabel", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  获取圈子动态详情
 *
 * @param params - grass_id
 * @httpMethod POST
 */
export const getGrassDetail = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/getGrassDetail", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  点赞圈子动态
 *
 * @param params - grass_id
 * @httpMethod POST
 */
export const likeGrass = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/likeGrass", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  转发圈子动态
 *
 * @param params - grass_id
 * @httpMethod POST
 */
export const shareGrass = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/shareGrass", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  评论圈子动态
 *
 * @param params - grass_id content
 * @httpMethod POST
 */
export const commentGrass = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/commentGrass", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  删除圈子动态
 *
 * @param params - grass_id content
 * @httpMethod POST
 */
export const grassDel = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/grassDel", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  举报圈子动态
 *
 * @param params - grass_id content
 * @httpMethod POST
 */
export const reportGrass = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/reportGrass", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  举报圈子动态类型获取
 *
 * @param params - grass_id content
 * @httpMethod POST
 */
export const getGrassReportType = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/getGrassReportType", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  获取圈子评论信息
 *
 * @param params - grass_id content
 * @httpMethod POST
 */
export const getCommentGrass = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/getCommentGrass", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  回复评论
 *
 * @param params - grass_id content
 * @httpMethod POST
 */
export const replyCommentGrass = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/replyCommentGrass", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  点赞评论
 *
 * @param params - type 1.评论，2.评论回复，3.留言，4.留言回复 item_id
 * @httpMethod POST
 */
export const likeComment = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/likeComment", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  获取举报类型
 *
 * @param params -
 * @httpMethod POST
 */
export const GetGrassReportType = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/grass.grass_topic/getGrassReportType", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  获取组局类型
 *
 * @param params -
 * @httpMethod get
 */
export const getType = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("get", "/api/grass.grass_team/getType", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  发布组局
 * @param params -
 * @httpMethod post
 */
export const publishTeam = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_team/publishTeam", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  组局列表
 * @param params -
 * @httpMethod post
 */
export const GrassTeamList = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_team/list", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  发布圈子跑腿
 * @param params -
 * @httpMethod post
 */
export const PublishRunErrands = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_run_errands/publishRunErrands", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  获取圈子跑腿
 * @param params -
 * @httpMethod post
 */
export const GrassRunErrands = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_run_errands/list", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  圈子跑腿接单
 * @param params -
 * @httpMethod post
 */
export const ReceiveErrands = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_run_errands/receive", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  跑腿接单人取消订单
 * @param params -
 * @httpMethod post
 */
export const ReceiveCancel = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_run_errands/receiveCancel", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  跑腿接单人点送达
 * @param params -
 * @httpMethod post
 */
export const delivered = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_run_errands/delivered", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  发布人跑腿人点击完成
 * @param params -
 * @httpMethod post
 */
export const completeRunErrands = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_run_errands/complete", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 *  跑腿发布人取消订单
 * @param params -
 * @httpMethod post
 */
export const cancelGrassRunErrands = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_run_errands/cancel", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 详情
export const GrassErrandsDetail = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_run_errands/detail", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 获取组局详情
export const GrassTeamDetail = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_team/detail", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 取消组局
export const Grass_teamCancel = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_team/cancel", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 退出组局
export const QuitGrassTeam = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_team/quit", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 加入组局
export const JoinTeam = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_team/joinTeam", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};
// 加入组局
export const GetTeamMember = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_team/getTeamMember", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 组局评论
export const GetTeamMessage = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_team/getTeamMessage", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 回复留言
export const ReplyTeamMessage = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_team/replyTeamMessage", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 组局评论
export const TeamMessage = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_team/teamMessage", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 组局评论
export const GetGrassTopic = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/getGrassTopic", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 获取圈子好友
export const GrassTopicFriend = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/grassTopicFriend", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 获取圈子好友
export const GetIdentityAuth = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.user/identityAuth", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 公告列表
export const GetNotification = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/notification/getNotification", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 公告详情
export const GetNotificationDetail = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/notification/detail", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 帮顶
export const SetTopUpItem = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_topic/setTopUp", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 帮顶
export const GetLevelInfo = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.user/getLevelInfo", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

/**
 * -----
 * 提现
 * -------
 *
 */

// 绑定
export const BindPay = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.user/bindPay", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 获取
export const GetBindPay = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.user/getBindPay", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 获取绑定支付信息
export const GetBindPayInfo = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.user/getBindPay", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 获取绑定支付信息
export const GetWithdrawInfo = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/addons/shopro/withdraw/index", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 发起提现申请
export const ApplyWithDraw = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/addons/shopro/withdraw/apply", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 发起提现申请
export const MoneyLog = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/user.user/moneyLog", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};

// 发起互助分类
export const getGrassRunType = <T, S>(params: T): Promise<DataResponse<S>> => {
  return request.action<S>("post", "/api/grass.grass_run_errands/getGrassRunType", {
    isMsg: true,
    isLoading: true,
    isLogin: true,
    data: params,
  });
};
