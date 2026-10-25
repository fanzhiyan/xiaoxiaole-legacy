// 配置项
export type MessageOptions = {
  // 标题
  title: string;
  // 弹窗类型
  type: messageType;
  // 内容
  content: string;
  // 确认按钮
  confirmText: string;
  // 外部传入的数组
  data: Array<any>;
  // 置顶动态
  grass_id: string | number;
};

// 方法
export type MessageMerge = {
  // 是否展示
  show: boolean;
  onConfirm: (res: MessageResult) => any;
  onCancel: (res: MessageResult) => any;
};

export interface MessageResult {
  action: messageType;
  value?: string | number;
}
// 方法Type
export type messageType = "confirm";
