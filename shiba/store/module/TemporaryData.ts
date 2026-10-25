import { defineStore } from 'pinia';
import { deepClone } from "@/shiba/libs/index"
import $api from "@/shiba/api/index.js"
import config from "@/shiba/config/config"
// 定义状态类型
interface AppState {
	[key : string] : any; // 允许动态键值
}

// 定义 getters 类型
interface AppGetters {

}

// 定义 actions 类型
interface AppActions {

}

// 定义 store 类型
type AppStore = {
	state : AppState;
	getters : AppGetters;
	actions : AppActions;
};




// 历史项目使用的案例
const TemporaryData = defineStore<'TemporaryData', AppState, AppGetters, AppActions>({
	id: 'TemporaryData',
	state: () : AppState => ({
		offData:{
			reason_id:"",
			content:''
		}
	}),
	actions: {
		SETKEYDATA(KEY : string, DATA : any) {
			this[KEY] = DATA;
		}
	},
	persist: {
		enabled: true,
		strategies: [],
	}
});

export default TemporaryData;