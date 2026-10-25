import App from "./App";

// #ifndef VUE3
import Vue from "vue";
import "./uni.promisify.adaptor";
Vue.config.productionTip = false;
App.mpType = "app";
const app = new Vue({
  ...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import uviewPlus from "uview-plus";
import shiba from "@/shiba";
import "@/shiba/scss/index.scss";
import utils from "@/shiba/utils/index";

let i18nConfig = {
  locale: uni.getLocale(),
  messages: shiba.$locale,
};

import { createSSRApp } from "vue";
import { setupPinia } from "@/shiba/store";
import RouteIntercept from "@/shiba/route";
// import PermissionsIntercept from '@/shiba/permissions';
export function createApp() {
  const app = createSSRApp(App);
  let Pinia = setupPinia(app);
  app.use(uviewPlus);
  app.use(utils);
  // #ifdef APP
  // app.use(PermissionsIntercept);
  // #endif
  app.use(RouteIntercept);
  return {
    app,
    Pinia,
  };
}
// #endif
