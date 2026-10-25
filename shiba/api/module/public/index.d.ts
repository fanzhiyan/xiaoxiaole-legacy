import { DataResponse } from "@/shiba/api/request.d";
export interface PublicType {
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
  CreateGrass_topic<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   * 获取圈子接口。
   *
   * @param params - 注册所需参数对象，包含以下字段：
   * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
   *   - `keyword` (string, 可选)：搜索词。
   *   - `limit` (string, 可选)：微信号。
   * @httpMethod POST
   */
  getGrassTopic<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   * 获取圈子分类。
   *
   * @param params - 注册所需参数对象，包含以下字段：
   * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
   *   - `keyword` (string, 可选)：搜索词。
   *   - `limit` (string, 可选)：微信号。
   * @httpMethod POST
   */
  getGrassClassify<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   * 获取我的圈子
   *
   * @param params - 注册所需参数对象，包含以下字段：
   * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
   *   - `keyword` (string, 可选)：搜索词。
   *   - `limit` (string, 可选)：微信号。
   * @httpMethod POST
   */
  myGrassTopic<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   * 获取我的圈子
   *
   * @param params - 注册所需参数对象，包含以下字段：
   * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
   *   - `id` (string, 可选)：圈子id。
   * @httpMethod POST
   */
  getGrassIndex<T, S>(params: T): Promise<DataResponse<S>>;

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
  applyJoin<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   *  获取圈友
   *
   * @param params - 注册所需参数对象，包含以下字段：
   * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
   *   - `topic_id` (string, 可选)：圈子id。
   *   - `limit` (string, 可选)：每页显示条数。
   * @httpMethod POST
   */
  grassTopicFriend<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   *  获取主页
   *
   * @param params - 注册所需参数对象，包含以下字段：
   * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
   *   - `user_id` (string, 可选)：用户id。
   *   - `limit` (string, 可选)：每页显示条数。
   * @httpMethod POST
   */
  GetUserIndex<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   *  今日热门
   *
   * @param params - 注册所需参数对象，包含以下字段：
   * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
   * @httpMethod POST
   */
  GetDayHot<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   *  多校热门
   *
   * @param params - 注册所需参数对象，包含以下字段：
   * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
   * @httpMethod POST
   */
  GetSchoolHot<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   *  申请退圈
   *
   * @param params - 注册所需参数对象，包含以下字段：
   * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
   * @httpMethod POST
   */
  GrassTopicOut<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   *  发动态
   * @param params - 注册所需参数对象，包含以下字段：
   * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
   * @httpMethod POST
   */
  PublishGrass<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   *  获取圈子动态标签
   *
   * @param params -
   * @returns 返回一个Promise对象，该对象解析为包含注册结果的DataResponse。
   * @httpMethod POST
   */
  getGrassLabel<T, S>(params: T): Promise<DataResponse<S>>;
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
  GetGrassInfo<T, S>(params: T): Promise<DataResponse<S>>;
  /**
   *  点赞圈子动态
   *
   * @param params -
   * @httpMethod POST
   */
  likeGrass<T, S>(params: T): Promise<DataResponse<S>>;
  /**
   *  转发圈子动态
   *
   * @param params -
   * @httpMethod POST
   */
  shareGrass<T, S>(params: T): Promise<DataResponse<S>>;
  /**
   *  评论圈子动态
   *
   * @param params -
   * @httpMethod POST
   */
  commentGrass<T, S>(params: T): Promise<DataResponse<S>>;
  /**
   *  删除圈子动态
   *
   * @param params -
   * @httpMethod POST
   */
  grassDel<T, S>(params: T): Promise<DataResponse<S>>;
  /**
   *  举报圈子动态
   *
   * @param params -
   * @httpMethod POST
   */
  reportGrass<T, S>(params: T): Promise<DataResponse<S>>;
  /**
   *  举报类型
   *
   * @param params -
   * @httpMethod POST
   */
  getGrassReportType<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   *  获取组局类型
   *
   * @param params -
   * @httpMethod get
   */
  getType<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   *  发布组局
   * @param params -
   * @httpMethod post
   */
  publishTeam<T, S>(params: T): Promise<DataResponse<S>>;
  /**
   *  圈子跑腿接单
   * @param params - 参数对象
   * @httpMethod post
   */
  ReceiveErrands<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   *  跑腿接单人取消订单
   * @param params - 参数对象
   * @httpMethod post
   */
  ReceiveCancel<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   *  跑腿接单人点送达
   * @param params - 参数对象
   * @httpMethod post
   */
  delivered<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   *  发布人跑腿人点击完成
   * @param params - 参数对象
   * @httpMethod post
   */
  completeRunErrands<T, S>(params: T): Promise<DataResponse<S>>;

  /**
   *  跑腿发布人取消订单
   * @param params - 参数对象
   * @httpMethod post
   */
  cancelGrassRunErrands<T, S>(params: T): Promise<DataResponse<S>>;
}
