import config from "@/shiba/config/config";
import store from "@/shiba/store"
const { VUE_BASE_IMAGE_Url } = config
import * as lib from "../libs/index"

const y = {
	...lib
};

// 挂载到uni对象上
uni.$y = y;
uni.$store = store;
// Vue插件安装函数
/**
 * @description 安装Vue插件
 * @param {any} Vue - Vue实例
 */
const install = (Vue) : void => {
	Vue.config.globalProperties.$y = y;
	Vue.config.globalProperties.$store = store;
};

export default {
	install
};