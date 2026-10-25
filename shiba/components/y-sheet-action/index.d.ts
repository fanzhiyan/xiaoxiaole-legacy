// 定义消息项的接口
export interface MessageItem {
	name : string;
	value : number;
}

// 定义默认选项的接口
export interface DefaultOptions {
	cancelText : string;
	show : boolean;
	list : MessageItem[];
}

// 可传入的接口内容
export interface Options {
	cancelText : string;
	show? : boolean;
	list : MessageItem[];
}

// 定义显示方法的选项接口
export interface ShowMethodOptions extends DefaultOptions {
	onConfirm ?: (res : ModalPayload) => any;
	onCancel ?: (res : ModalPayload) => any;
}


//  定义约束
export interface ShowMethodAction  {
	onConfirm ?: (res : ModalPayload) => any;
	onCancel ?: (res : ModalPayload) => any;
}

// 定义组件 Props 类型
export interface ComponentProps {
	selector ?: string;
}

// 定义 toggleModal 的参数类型
export type ModalAction = 'confirm' | 'cancel';

// 定义 toggleModal 和 handle 系列函数的 payload 类型
export interface ModalPayload {
	action : ModalAction;
	value : any;
}