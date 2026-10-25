// 配置项
export type MessageOptions = {
  // 标题
  title: string;
  // 弹窗类型
  type: messageType;
  // auth类型
  mode: Mode;
  show: boolean;
};

// 方法
export type MessageMerge = {
  // 是否展示
  show: boolean;
  onConfirm: (res: MessageResult) => any;
  onCancel: (res: MessageResult) => any;
};

export interface AvatarEvent {
  detail: {
    avatarUrl: string;
  };
}

// 定义事件处理函数的类型
export interface PhoneNumberEvent {
  detail: {
    errMsg: string;
    encryptedData?: string;
    iv?: string;
  };
}

// 定义 props 类型
export interface Props {
  mode?: Mode;
  selector: string;
}

export interface UserInfoEvent {
  detail: {
    userInfo: {
      nickName: string;
      avatarUrl: string;
    };
  };
}

export interface MessageResult<T = string | number> {
  action: "success" | "error";
  value?: T;
}
// 方法Type
export type messageType = "alert";

// 枚举mode类型
export enum Mode {
  PHONE = "phone",
  AVATAR = "avatar",
  NAME = "name",
  LOGIN = "login",
}
