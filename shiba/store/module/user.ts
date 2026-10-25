import { defineStore } from "pinia";
import { deepClone } from "@/shiba/libs/index";
import $api from "@/shiba/api/index";
import config from "@/shiba/config/config";
// 定义状态类型
interface AppState {
  [key: string]: any; // 允许动态键值
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

const defaultUser = {
  id: -1,
  group_id: 1,
  username: "",
  nickname: "",
  mobile: "",
  pay_pwd: "",
  email: "",
  avatar: "",
  bind_car: null,
  level: 1,
  gender: 0,
  birthday: null,
  bio: "",
  money: "0",
  commission: "0.00",
  score: 0,
  successions: 0,
  maxsuccessions: 0,
  prevtime: null,
  logintime: null,
  loginip: "",
  loginfailure: 0,
  joinip: "",
  jointime: null,
  token: "",
  status: "normal",
  verification: {
    username: 0,
    password: 0,
    mobile: 0,
  },
  parent_user_id: 0,
  total_consume: "0.00",
  is_recharge: 0,
  total_recharge: "0.00",
  parent_user: null,
  third_oauth: [],
  status_text: "正常",
  gender_text: "",
};

// 历史项目使用的案例
const user = defineStore<"app", AppState, AppGetters, AppActions>({
  id: "user",
  state: (): AppState => ({
    user: deepClone(defaultUser),
    isLogin: false,
    [config.Token_Name]: "",
    [config.USERNAME]: "",
  }),
  actions: {
    SETKEYDATA(KEY: string, DATA: any) {
      this[KEY] = DATA;
    },
    // 登录
    Login() {
      this.GetUser();
    },
    // 退出登录
    LogOut() {
      this.user = deepClone(defaultUser);
      this.isLogin = false;
      this[config.Token_Name] = "";
      this[config.USERNAME] = "";
    },
    // 登录获取接口，
    async GetUser() {
      const ress = await $api.api.GetUserInfo();
      this.isLogin = true;
      this.user = ress.data;
    },
  },
  persist: {
    enabled: true,
    strategies: [],
  },
});

export default user;
