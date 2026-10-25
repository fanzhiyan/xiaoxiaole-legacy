import { defineStore } from "pinia";
import { deepClone } from "@/shiba/libs/index";
import $api from "@/shiba/api/index";
import config from "@/shiba/config/config";
// 定义状态类型
interface AppState {
  [key: string]: any; // 允许动态键值
  screenInfo: {
    width: number;
    height: number;
    safeArea: any;
  };
}

// 定义 getters 类型
interface AppGetters {}

// 定义 actions 类型
interface AppActions {}

// 定义 store 类型
type AppStore = {
  state: AppState;
  getters: AppGetters;
  actions: AppActions;
};

// 历史项目使用的案例
const app = defineStore<"app", AppState, AppGetters, AppActions>({
  id: "app",
  state: (): AppState => ({
    // 地址ecode
    AreaData: [],
    // 用户选择查看的圈子
    user_topic_id: "",
    System: {
      run_message: "通知",
      sys_image: "",
    },
    earnest_money: 99999,
    service_rate: 1,
    Upload: {},
    // 弹窗
    pop: [],
    screenInfo: {
      width: 375,
      height: 667,
      safeArea: {},
    },

    notice: {
      noteCount: 0,
      runOrderCount: 0,
      commonCount: 0,
      bulletinCount: 0,
      hudongCount: 0,
    },
    wechat_image: "",
  }),
  actions: {
    SETKEYDATA(KEY: string, DATA: any) {
      this[KEY] = DATA;
    },
    setScreenInfo(info: { width: number; height: number; safeArea: any }) {
      this.screenInfo = info;
    },
    // 登录获取接口，
    async init() {
      // 获取省市区
      const ress = await $api.api.init({
        topic_id: this.user_topic_id,
      });
      this.notice.noteCount = ress.data.noteCount;
      this.notice.runOrderCount = ress.data.runOrderCount;
      this.notice.commonCount = ress.data.commonCount;
      this.notice.bulletinCount = ress.data.bulletinCount;
      this.notice.hudongCount = ress.data.hudongCount;
      this.wechat_image = ress.data.system.wechat_image;
      this.System = ress.data.system;
      this.pop = ress.data.pop;
      this.earnest_money = ress.data.system.earnest_money;
      this.service_rate = (ress.data.system.service_rate / 100).toFixed(2);
      config.VUE_BASE_IMAGE_Url = config.VUE_BASE_IMAGE_Url ? config.VUE_BASE_IMAGE_Url : ress.data.upload.cdnurl;
      this.Upload = ress.data.upload;
      const res = await $api.api.GetArea();
      this.AreaData = res.data;
      // 初始化
    },
  },
  persist: {
    enabled: true,
    strategies: [],
  },
});

export default app;
