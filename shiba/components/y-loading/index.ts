import { ref, provide } from 'vue';
import { messageType, LoadingOptions, LoadingFunction } from "./type";
import { deepMerge, deepClone } from "../libs/utils";

// 默认的消息选项
export const defaultOptions: LoadingOptions = {
	icon: "lp",
	show: false,
	loadingText: "加载中"
};

export const messageDefaultOptionKey = 'YLoading_';

/**
 * useLoading - 自定义加载功能的钩子函数
 * @param {string} selector - 可选的选择器，用于区分不同的加载实例
 * @returns {LoadingFunction} - 包含 loading 和 close 方法的对象
 */
export function useLoading(selector: string = ''): LoadingFunction {
	// 创建一个响应式的消息选项对象，初始值为默认选项
	const messageOption = ref<LoadingOptions>(deepClone(defaultOptions));
	
	// 根据选择器生成唯一的消息选项键
	const messageOptionKey = selector ? messageDefaultOptionKey + selector : messageDefaultOptionKey;
	
	// 提供消息选项对象，以便在组件树中使用
	provide(messageOptionKey, messageOption);

	/**
	 * createMethod - 创建或关闭加载消息的方法
	 * @param {messageType} optionsOption - 操作类型 ('loading' 或 'close')
	 * @param {LoadingOptions} [LoadingOption] - 可选的加载选项
	 */
	const createMethod = (optionsOption: messageType, LoadingOption?: LoadingOptions): void => {
		if (optionsOption === 'close') {
			// 关闭加载消息，重置为默认选项
			messageOption.value = deepClone(defaultOptions);
		} else if (optionsOption === 'loading') {
			// 合并默认选项和传入的加载选项
			const options = deepMerge(defaultOptions, typeof LoadingOption === 'string' ? { icon: LoadingOption } : LoadingOption);
			// 更新消息选项对象，并设置 show 为 true
			messageOption.value = { ...deepClone(messageOption.value), ...deepClone(options), show: true };
		}
	};

	/**
	 * loading - 打开加载消息的方法
	 * @param {LoadingOptions} [option=defaultOptions] - 可选的加载选项，默认为默认选项
	 */
	const loading = (option: LoadingOptions = defaultOptions) => createMethod('loading', option);

	/**
	 * close - 关闭加载消息的方法
	 */
	const close = () => createMethod('close');

	return {
		loading,
		close
	};
}
