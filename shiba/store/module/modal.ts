import { defineStore } from "pinia";
import { deepClone } from "@/shiba/libs/index";
import $api from "@/shiba/api/index.js";
// 定义状态类型
interface AppState {
  Auth: Boolean;
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

const defaultUser = {};

// 历史项目使用的案例
const modal = defineStore<"modal", AppState, AppGetters, AppActions>({
  id: "modal",
  state: (): AppState => ({
    // 是否需要弹出登录框
    Auth: false,
  }),
  actions: {
    SETKEYDATA(KEY: string, DATA: any) {
      this[KEY] = DATA;
    },
  },
});

export default modal;
