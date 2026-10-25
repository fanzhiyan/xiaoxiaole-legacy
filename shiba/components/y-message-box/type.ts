// 配置项
export type MessageOptions = {
	// 标题
	title : string,
	// 弹窗类型
	type : messageType,
	// 是否展示取消按钮
	isShowCancel : boolean,
	// 取消按钮文本内容
	cancenText : string,
	// 是否展示确认按钮
	isShowConfirm : boolean,
	// 确认按钮文本内容
	confirmText : string,
	content : string,
}

// 方法
export type MessageMerge = {
	// 是否展示
	show : boolean
	onConfirm : (res : MessageResult) => any;
	onCancel : (res : MessageResult) => any;
};





export interface MessageResult {
	action : messageType
	value ?: string | number
}
// 方法Type
export type messageType = 'alert' | 'confirm' | 'close' | 'cancel' | 'prompt'