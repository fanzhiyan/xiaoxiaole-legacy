import { ref, provide } from 'vue';
import { messageType, MessageMerge, MessageResult, MessageOptions, Mode } from "./type.d";
import { deepMerge, deepClone } from "../libs/utils";

// 默认的消息选项
export const defaultOptions: MessageOptions = {
	// 标题
	title: "",
	// 弹窗类型 比如登录弹窗
	type: 'alert',
	// auth类型，使用枚举值
	mode: Mode.PHONE,
	// 是否显示弹窗
	show: false
};

// 默认的消息选项键前缀
export const messageDefaultOptionKey = 'YAUTH__';

/**
 * useAuth 组合式函数，用于管理消息选项和弹窗
 * @param selector - 可选的选择器，用于区分不同的消息选项
 * @returns 包含 show, alert 和 close 方法的对象
 */
export function useAuth(selector: string = '') {
	// 创建一个响应式的消息选项对象，初始值为默认选项的深拷贝
	const messageOption = ref<MessageOptions>(deepClone(defaultOptions));

	// 根据选择器生成消息选项键
	const messageOptionKey = selector ? messageDefaultOptionKey + selector : messageDefaultOptionKey;

	// 提供消息选项，以便在组件树中注入
	provide(messageOptionKey, messageOption);

	/**
	 * 创建消息方法
	 * @param type - 消息类型
	 * @returns 一个函数，该函数接受消息选项或标题，并显示消息
	 */
	const createMethod = (type: messageType) => {
		// 优先级：options -> MessageOptions -> defaultOptions
		return (options: MessageOptions | string) => {
			// 合并选项，确保类型为 messageType
			const messageOptions = deepMerge({ type: type }, typeof options === 'string' ? { title: options } : options) as MessageOptions;
			return show(messageOptions);
		};
	};

	/**
	 * 显示消息
	 * @param option - 消息选项或标题
	 * @returns 一个 Promise，解析为 MessageResult
	 */
	const show = (option: MessageOptions | string) => {
		// 返回一个 Promise
		return new Promise<MessageResult>((resolve, reject) => {
			// 合并选项，确保类型为 MessageOptions
			const options = deepMerge(defaultOptions, typeof option === 'string' ? { title: option } : option) as MessageOptions;

			// 创建新的消息选项对象，包含 onConfirm 和 onCancel 回调
			let obj = Object.assign(deepClone(messageOption.value), deepClone(options), {
				show: true,
				onConfirm: (res: MessageResult) => {
					resolve(res);
				},
				onCancel: (res: MessageResult) => {
					reject(res);
				}
			});
			// 更新消息选项
			messageOption.value = obj;
		});
	};

	// 打开 Alert 弹框
	const alert = createMethod('alert');

	// 关闭弹窗，重置消息选项为默认值
	const close = () => {
		messageOption.value = { ...defaultOptions };
	};

	return {
		show,
		alert,
		close
	};
}
