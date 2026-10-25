<template>
  <view class="message">
    <up-popup :safeAreaInsetBottom="false" :close-on-click-overlay="false" :show="StateOpction.show" mode="center" :round="20">
      <view class="popup-card">
        <view class="title" v-if="StateOpction.title">
          {{ StateOpction.title }}
        </view>
        <slot></slot>
        <view class="slot-input l-f-center" v-if="StateOpction.type == 'prompt'">
          <view class="input-coustom l-f-center">
            <u-input v-model="PromptValue" :clearable="true"></u-input>
          </view>
        </view>
        <view class="slot-input l-f-center" v-if="(StateOpction.type == 'confirm' || StateOpction.type == 'alert') && StateOpction.content">
          <view v-html="StateOpction.content"></view>
        </view>
        <view class="action l-f">
          <view class="cancel l-f-center" @click="toggleModal('cancel')" v-if="StateOpction.isShowCancel">{{ StateOpction.cancenText }}</view>
          <view class="confirm l-f-center" @click="toggleModal('confirm')" v-if="StateOpction.isShowConfirm">{{ StateOpction.confirmText }}</view>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<script setup lang="ts">
import { inject, reactive, ref, watch } from "vue";
import { defaultOptions, messageDefaultOptionKey } from "./index";
import { MessageOptions, MessageResult, MessageMerge } from "./type";
import { isFunction } from "../libs/utils";

// 获取组件的 props
const props = defineProps({
  selector: {
    type: String,
  },
});

// 根据 selector 获取对应的 message 选项 key
const popupOpctionKey = props.selector ? `${messageDefaultOptionKey}${props.selector}` : messageDefaultOptionKey;

// 注入 message 选项
const messageOption = inject(popupOpctionKey, ref<MessageOptions>(defaultOptions));
/**
 * 定义响应式的 StateOption，用于存储 message 选项的状态
 */
let StateOpction = reactive<Omit<MessageOptions & MessageMerge, "onConfirm" | "onCancel">>({
  title: "",
  type: "confirm",
  isShowCancel: true,
  cancenText: "取消",
  isShowConfirm: true,
  confirmText: "确认",
  show: false,
  content: "",
});

/**
 * 如果是输入框时候值
 * @param
 */
let PromptValue = ref("");
/**
 * 处理确认操作
 * @param result - 确认结果
 */
const handleConfirm = (result: MessageResult) => {
  StateOpction.show = false;
  if (isFunction(onConfirm)) {
    onConfirm(result);
  }
};

/**
 * 处理取消操作
 * @param result - 取消结果
 */
const handleCancel = (result: MessageResult) => {
  StateOpction.show = false;
  if (isFunction(onCancel)) {
    onCancel(result);
  }
};

// 定义确认和取消的回调函数
let onConfirm = (result: MessageResult) => {};
let onCancel = (result: MessageResult) => {};

/**
 * 点击操作
 * @param action 操作类型 ('confirm' | 'cancel')
 */
function toggleModal(action: "confirm" | "cancel") {
  const payload = StateOpction.type === "prompt" ? { action, value: PromptValue.value } : { action };
  PromptValue.value = "";
  switch (action) {
    case "confirm":
      handleConfirm(payload);
      break;
    case "cancel":
      handleCancel(payload);
      break;
  }
}

/**
 * 初始化 message 选项
 * @param option - message 选项
 */
const initMessage = (option: MessageOptions & MessageMerge) => {
  if (!option) return;
  StateOpction.show = option.show;
  StateOpction.title = option.title;
  StateOpction.type = option.type;
  StateOpction.isShowCancel = option.isShowCancel;
  StateOpction.cancenText = option.cancenText;
  StateOpction.isShowConfirm = option.isShowConfirm;
  StateOpction.confirmText = option.confirmText;
  StateOpction.content = option.content;
  onCancel = option.onCancel;
  onConfirm = option.onConfirm;
};

watch(
  () => messageOption,
  (newValue) => {
    initMessage(newValue.value as MessageOptions & MessageMerge);
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.popup-card {
  border-radius: 12rpx;
  width: 600rpx;
  min-height: 240rpx;
  background-color: #ffffff;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .title {
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    font-size: 32rpx;
    font-weight: 600;
    padding: 0 30rpx;
  }

  .slot-input {
    flex: 1;
    min-height: 160rpx;
    font-size: 30rpx;
    margin: 20rpx auto;
    padding: 20rpx 40rpx;
    text-align: center;
    color: #333333;

    .input-coustom {
      width: 90%;
      height: 80rpx;
      background: #f7f7f7;
      border-radius: 8rpx;
      padding: 0 20rpx;
      border: 1rpx solid #eeeeee;
    }
  }

  .action {
    border-top: 1rpx solid #eeeeee;
    height: 100rpx;
    display: flex;

    .cancel,
    .confirm {
      flex: 1;
      height: 100%;
      font-size: 32rpx;
      font-weight: 500;
      transition: background-color 0.2s;
      position: relative;

      &:active {
        background-color: #f5f5f5;
      }
    }

    .cancel {
      border-right: 1rpx solid #eeeeee;
      color: #666666;
    }

    .confirm {
      color: #1673fe;
    }
  }
}
</style>
