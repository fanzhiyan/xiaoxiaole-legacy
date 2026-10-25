import * as Pinia from 'pinia';
import piniaPersist from 'pinia-plugin-persist-uni';
import { App } from 'vue';

// 定义模块类型
interface Module {
	[key : string] : any;
}

// 自动注入所有pinia模块
const files = import.meta.glob('./module/*.{js,ts}', { eager: true });
const modules : Module = {};
Object.keys(files).forEach((key) => {
	modules[key.replace(/(.*\/)*([^.]+).*/gi, '$2')] = files[key].default;
});

// 设置 Pinia
export const setupPinia = (app : App) : any => {
	const pinia : Pinia.Pinia = Pinia.createPinia();
	pinia.use(piniaPersist);
	app.use(pinia);
	return Pinia
};

// 获取模块
export default (name : string) : Module => {
	// #ifdef APP
	if (typeof name === 'object' && name !== null) return
	// #endif
	if (modules[name]) {
		return modules[name]();
	} else {
		throw new Error(`Module ${name} not found`);
	}
};