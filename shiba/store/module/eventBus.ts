import { defineStore } from "pinia";
import { watch } from "vue";
import $api from "@/shiba/api/index";
import user from "./user";
import app from "./app";
// 定义事件总线状态接口
interface EventBusState {
  pollingInterval: number | null; // 轮询定时器ID
  isPolling: boolean; // 是否正在轮询中
  handledOrders: {
    id: number | string;
    confirmed: boolean;
  }[]; // 存储已处理的订单ID及其状态
}

export const eventBus = defineStore("eventBus", {
  state: (): EventBusState => ({
    pollingInterval: null, // 存储定时器ID，初始为null
    isPolling: false, // 轮询状态标记，初始为false
    handledOrders: [], // 已处理的订单列表
  }),

  actions: {
    // 检查订单是否已经处理过
    checkOrderHandled(orderId: number | string) {
      return this.handledOrders.find((order) => order.id === orderId);
    },

    // 添加已处理的订单
    addHandledOrder(orderId: number | string, confirmed: boolean) {
      if (!this.checkOrderHandled(orderId)) {
        this.handledOrders.push({
          id: orderId,
          confirmed,
        });
      }
    },

    async startPolling() {
      const userStore = user();
      const appStore = app();

      // 检查是否满足开始轮询的条件：用户已登录且已选择话题
      if (!userStore.isLogin || !appStore.user_topic_id) {
        this.stopPolling();
        return;
      }

      // 如果已经在轮询中，则不重复启动
      if (this.isPolling) return;

      this.isPolling = true;

      // 创建定时器，每2分钟（120000毫秒）执行一次
      this.pollingInterval = setInterval(async () => {
        try {
          // 再次确认用户仍然处于登录状态且话题ID存在
          if (userStore.isLogin && appStore.user_topic_id) {
            // console.log("轮询中");
            const res = await $api.api.GrassGrassRunErrands({
              topic_id: appStore.user_topic_id,
              type: 3,
              status: 6,
            });

            let data = res.data.data;
            for (var i = 0; i < data.length; i++) {
              let order_id = data[i].id;
              console.log(order_id, "id");

              // 检查该订单是否已经处理过
              const handledOrder = this.checkOrderHandled(order_id);

              // 如果订单未处理过，或者之前点击了取消（confirmed为false）
              if (!handledOrder || !handledOrder.confirmed) {
                uni.showModal({
                  title: "温馨提示",
                  content: "您有订单发起了取消申请",
                  confirmText: "前往查看",
                  success: (res) => {
                    // 记录用户的选择
                    this.addHandledOrder(order_id, res.confirm);

                    if (res.confirm) {
                      uni.$u.route({
                        url: "/pages/management/errand-info",
                        params: {
                          id: order_id,
                        },
                      });
                    }
                  },
                });
              }
            }
            // console.log(res, "轮训结果");
          } else {
            // 如果条件不满足，停止轮询
            this.stopPolling();
          }
        } catch (error) {
          // 错误处理
          console.error("轮询过程出错:", error);
        }
      }, 12020); // 2分钟间隔
    },

    // 停止轮询
    stopPolling() {
      // 如果定时器存在，清除定时器
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
      this.isPolling = false;
    },

    // 初始化方法，在组件或应用挂载时调用
    init() {
      const userStore = user();
      const appStore = app();

      // 监听登录状态变化
      watch(
        () => userStore.isLogin,
        (newIsLogin) => {
          if (newIsLogin && appStore.user_topic_id) {
            this.startPolling();
          } else {
            this.stopPolling();
          }
        }
      );

      // 监听话题ID变化
      watch(
        () => appStore.user_topic_id,
        (newTopicId) => {
          if (newTopicId && userStore.isLogin) {
            this.startPolling();
          } else {
            this.stopPolling();
          }
        }
      );

      // 初始检查是否应该开始轮询
      if (userStore.isLogin && appStore.user_topic_id) {
        this.startPolling();
      }
    },

    // 销毁方法，在组件或应用卸载时调用
    destroy() {
      this.stopPolling();
    },
  },
});

export default eventBus;
