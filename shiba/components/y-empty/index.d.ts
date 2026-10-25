export type Props = {
  icon: keyof typeof iconMode;
  title: string;
  width: string;
  height: string;
};

// 定义一个枚举类型，用于表示各种空状态的描述
export enum iconMode {
  /**
   * 暂无数据
   */
  data = "暂无数据",

  /**
   * 无搜索记录
   */
  search = "无搜索记录",

  /**
   * 无网络
   */
  network = "无网络",

  /**
   * 加载失败
   */
  error = "加载失败",

  /**
   * 购物车无商品
   */
  cart = "购物车无商品",

  /**
   * 暂无评价
   */
  comment = "还没有任何评论 发表第一条评论吧",

  /**
   * 暂无优惠卷
   */
  coupon = "暂无优惠卷",

  /**
   * 商品不存在
   */
  goods = "商品不存在",

  /**
   * 订单不存在
   */
  order = "订单不存在",

  /**
   * 暂无收藏
   */
  soldout = "暂无收藏",
  /**
   * 暂无地址
   */
  address = "暂无收货地址",
}

// 定义一个枚举类型，用于表示各种空状态的图片路径
export enum iconModeSrc {
  /**
   * 暂无数据
   */
  data = "/static/components/empty/empty-data.png",

  /**
   * 无搜索记录
   */
  search = "/static/components/empty/empty-search.png",

  /**
   * 无网络
   */
  network = "/static/components/empty/empty-network.png",

  /**
   * 加载失败
   */
  error = "/static/components/empty/empty-error.png",

  /**
   * 购物车无商品
   */
  cart = "/static/components/empty/empty-cart.png",

  /**
   * 暂无评价
   */
  comment = "/static/components/empty/empty-comment.png",

  /**
   * 暂无优惠卷
   */
  coupon = "/static/components/empty/empty-coupon.png",

  /**
   * 商品不存在
   */
  goods = "/static/components/empty/empty-goods.png",

  /**
   * 订单不存在
   */
  order = "/static/components/empty/empty-order.png",

  /**
   * 暂无收藏
   */
  soldout = "/static/components/empty/empty-soldout.png",

  /**
   * 暂无地址
   */
  address = "/static/components/empty/empty-address.png",
}

// 非必填转换
export type PartialProps = Omit<Props, "width" | "height"> & Partial<Pick<Props, "width" | "height">>;
