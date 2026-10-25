import { ref, provide } from "vue";
import { messageType, MessageMerge, MessageResult, MessageOptions } from "./type";
import { deepMerge, deepClone } from "../libs/utils";

// 默认的消息选项
export const defaultOptions: MessageOptions & { show: boolean } = {
  // 标题
  title: "",
  // 弹窗类型
  type: "confirm",
  // 是否展示取消按钮
  isShowCancel: false,
  // 取消按钮文本内容
  cancenText: "取消",
  // 是否展示确认按钮
  isShowConfirm: true,
  // 确认按钮文本内容
  confirmText: "确认",
  content: "",
  show: false,
};

export const messageDefaultOptionKey = "RoofBOX__";

export function useRoofBox(selector: string = "") {
  const messageOption = ref<MessageOptions>(deepClone(defaultOptions)); // Message选项
  const messageOptionKey = selector ? messageDefaultOptionKey + selector : messageDefaultOptionKey;
  provide(messageOptionKey, messageOption);

  const createMethod = (type: messageType) => {
    // 优先级：options->MessageOptions->defaultOptions
    return (options: Partial<MessageOptions> | string) => {
      const messageOptions = deepMerge({ type: type }, typeof options === "string" ? { title: options } : options) as MessageOptions;
      if (messageOptions.type === "confirm" || messageOptions.type === "prompt") {
        messageOptions.isShowCancel = true;
      } else {
        messageOptions.isShowCancel = false;
      }
      return show(messageOptions);
    };
  };

  const show = (option: MessageOptions | string) => {
    // 返回一个promise
    return new Promise<MessageResult>((resolve, reject) => {
      const options = deepMerge(defaultOptions, typeof option === "string" ? { title: option } : option) as MessageOptions;

      let obj = Object.assign(deepClone(messageOption.value), deepClone(options), {
        show: true,
        onConfirm: (res: MessageResult) => {
          resolve(res);
        },
        onCancel: (res: MessageResult) => {
          reject(res);
        },
      });
      messageOption.value = obj;
    });
  };

  // 打开Confirm 弹框
  const confirm = createMethod("confirm");
  const close = () => {
    messageOption.value = { ...defaultOptions };
  };
  return {
    show,
    confirm,
    close,
  };
}
