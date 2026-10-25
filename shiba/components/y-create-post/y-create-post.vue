<template>
  <up-popup mode="bottom" :round="20" :zIndex="99991" :show="isShow" @close="handleCancel">
    <view class="create-popup">
      <view class="title">发布的帖子/跑腿将会推送至《集市通知群》</view>
      <view class="action-item" @click="handleAction('dynamic')">
        <view class="action-icon">
          <u-image width="112rpx" height="88rpx" src="/static/icon/icon_dt.png" mode="aspectFit" />
        </view>
        <view class="content-info">
          <view class="content-label">发动态</view>
          <view class="content-values">发现校园新鲜事、吐槽近来阴雨天</view>
        </view>
      </view>
      <view class="action-item" @click="handleAction('runner')">
        <view class="action-icon">
          <u-image width="112rpx" height="88rpx" src="/static/icon/icon_pt.png" mode="aspectFit" />
        </view>
        <view class="content-info">
          <view class="content-label">发跑腿</view>
          <view class="content-values">代取、代去、帮买、帮送</view>
        </view>
      </view>
    </view>
  </up-popup>
</template>

<script setup lang="ts">
import { inject, computed } from "vue";
import type { CreatePostOptions, ActionType, ActionConfig } from "./type";
import { createPostDefaultOptionKey } from "./index";
import shiba from "@/shiba";
const isLogin = computed(() => shiba.$store("user").isLogin);
// 定义props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  needAuth: {
    type: Boolean,
    default: true,
  },
  needJoin: {
    type: Boolean,
    default: true,
  },
  topicId: {
    type: [String, Number],
    default: "",
  },
});

// 定义emit
const emit = defineEmits(["update:modelValue", "cancel", "confirm"]);

// 动作配置
const actionConfig: Record<ActionType, ActionConfig> = {
  dynamic: {
    type: "dynamic",
    path: "/pages/management/create-dynamic",
    needAuth: true,
    needJoin: true,
  },
  runner: {
    type: "runner",
    path: "/pages/management/create-runner",
    needAuth: true,
    needJoin: true,
  },
};

// 注入选项
const createPostOption = inject<{ value: CreatePostOptions & { show: boolean; onConfirm?: Function; onCancel?: Function } }>(createPostDefaultOptionKey);

// 计算显示状态
const isShow = computed(() => {
  return props.modelValue || createPostOption?.value?.show || false;
});

// 方法
const handleAction = async (type: ActionType) => {
  const config = actionConfig[type];
  console.log(1, isLogin.value, "---");
  if (!isLogin.value) {
    uni.$store("modal").SETKEYDATA("Auth", false);
    uni.$store("modal").SETKEYDATA("Auth", true);
    return;
  }
  // 跳转到对应页面
  uni.$u.route(config.path, {
    topic_id: props.topicId || createPostOption?.value.topicId,
  });

  handleConfirm();
};

const handleConfirm = () => {
  // Props方式
  if (props.modelValue !== undefined) {
    emit("update:modelValue", false);
    emit("confirm");
  }
  // 函数式方式
  if (createPostOption?.value.onConfirm) {
    createPostOption.value.onConfirm({
      confirm: () => {},
      cancel: () => {},
    });
  }
  if (createPostOption) {
    createPostOption.value.show = false;
  }
};

const handleCancel = () => {
  // Props方式
  if (props.modelValue !== undefined) {
    emit("update:modelValue", false);
    emit("cancel");
  }
  // 函数式方式
  if (createPostOption?.value.onCancel) {
    createPostOption.value.onCancel({
      confirm: () => {},
      cancel: () => {},
    });
  }
  if (createPostOption) {
    createPostOption.value.show = false;
  }
};
</script>

<style lang="scss" scoped>
.create-popup {
  width: 750rpx;
  min-height: 556rpx;
  background: #ffffff;
  border-radius: 24rpx 24rpx 0rpx 0rpx;

  .title {
    color: #666666;
    height: 90rpx;
    text-align: center;
    line-height: 90rpx;
    font-size: 28rpx;
  }

  .action-item {
    margin: 20rpx auto;
    width: 686rpx;
    height: 160rpx;
    background: #f7f8fc;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    border-radius: 10rpx;
    transition: all 0.2s;

    &:active {
      opacity: 0.8;
      transform: scale(0.98);
    }

    .action-icon {
      width: 112rpx;
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .content-info {
      flex: 1;
      margin-left: 20rpx;

      .content-label {
        font-size: 28rpx;
        color: #333333;
        font-weight: bold;
      }

      .content-values {
        margin-top: 4rpx;
        color: #999999;
        font-size: 24rpx;
      }
    }
  }
}
</style>
