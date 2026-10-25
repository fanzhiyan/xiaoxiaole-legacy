import { ref, provide } from 'vue';
import { messageType, MessageMerge,ModalPayload, DefaultOptions, Options } from "./type";
import { deepMerge, deepClone } from "../libs/utils";



// 默认的消息选项
export const defaultOptions : DefaultOptions  = {
	value:'',
	// 标题
	title: "请选择支付方式",
	// 默认支付方式
	defaultPay: "money",
	cancelText: '取消',
	show:false,
	// 支付列表
	list: [
		// {
		// 	id: 'zfb',
		// 	name: '支付宝',
		// 	icon: "/shiba/components/static/pay/icon-zfb.png"
		// },
		{
			id: 'wx',
			name: '微信',
			icon: "/shiba/components/static/pay/icon-wx.png"
		},
		{
			id: 'money',
			name: '套餐次数',
			icon: "/shiba/components/static/pay/icon-yhk.png"
		}
	]
};

export const messageDefaultOptionKey = 'Pay__'

/**
 * 创建一个可复用的消息弹出组件钩子函数。
 * @param selector - 选择器字符串，用于区分不同的消息实例（可选）。
 */
export function usePay(selector : string = '') {
	// 使用 Vue 的 ref 创建一个响应式对象，初始值为深拷贝的默认选项。
	const messageOption = ref(deepClone(defaultOptions));

	// 根据传入的选择器创建一个唯一的键名，如果没有传入选择器，则使用默认键名。
	const messageOptionKey = selector ? messageDefaultOptionKey + selector : messageDefaultOptionKey;

	// 使用 Vue 的 provide 注册提供者，使得子孙组件可以注入并使用这个消息选项。
	provide(messageOptionKey, messageOption);

	// 创建方法工厂函数，根据传入的方法名返回对应的操作函数。
	const createMethod = (optionsOption : 'showModal') => {
		return (options : Options) => {
			// 深拷贝传入的选项以避免直接修改原始数据。
			const messageOptions = deepClone(options);
			if (optionsOption == 'showModal') {
				return show(messageOptions); // 如果是显示模态框，则调用 show 方法。
			}
		};
	};

	// 显示消息框的方法，接收用户自定义的选项，并返回一个 Promise。
	const show = (option : Options) => {
		// 返回一个新的 Promise，允许调用者处理确认或取消事件。
		return new Promise<ModalPayload>((resolve, reject) => {
			// 合并默认选项和用户提供的选项，确保所有必要的属性都存在。
			const options = deepMerge(defaultOptions, option);
			console.log(options,'optionsoptionsoptions')
			// 更新消息选项对象，设置为显示状态，并添加回调函数处理确认和取消事件。
			let obj = Object.assign(
				deepClone(messageOption.value), // 深拷贝当前的消息选项
				deepClone(options),            // 用户提供的选项
				{
					show: true,                // 设置为显示
					onConfirm: (res:ModalPayload) => resolve(res), // 确认时解析 Promise
					onCancel: (res:ModalPayload) => reject(res)    // 取消时拒绝 Promise
				}
			);
			messageOption.value = obj; // 将更新后的对象赋值给响应式的 messageOption
		});
	};

	// 打开 Confirm 弹框的方法，通过 createMethod 工厂函数创建。
	const showModal = createMethod('showModal');

	// 关闭消息框的方法，重置消息选项为默认值。
	const close = () => {
		messageOption.value = { ...defaultOptions };
	};

	// 返回包含关闭和显示模态框的方法的对象。
	return {
		close,
		showModal
	};
}