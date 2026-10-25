<template>
  <!-- 支付方式容器 -->

  <view class="y-pay">
    <view class="pay-title">支付方式</view>
    <!-- 遍历支付方式列表，生成每个支付项 -->
    <view class="pay-item" v-for="item in list" :key="item.id">
      <!-- 支付方式图标 -->
      <view class="pay-icon">
        <u-image width="50rpx" height="50rpx" :src="item.icon" mode="aspectFit"></u-image>
      </view>
      <!-- 支付方式名称 -->
      <view class="pay-type">{{ item.name }}</view>
      <!-- 单选按钮，点击时更新选中的支付方式 -->
      <view @click="update(item)">
        <y-radio size="32rpx" :modelValue="item.id == modelValue"></y-radio>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { Props } from "./index.d";
// 导入必要的模块和函数
import { computed, ref, watch } from "vue";

// 定义组件的事件
const emits = defineEmits(["update:modelValue"]);

const Props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  title: "",
  list: () => [
    {
      id: "wechat",
      name: "微信零钱",
      icon: "/static/components/pay/icon-wx.png",
    },
  ],
});

// 更新选中的支付方式
const update = (item) => {
  emits("update:modelValue", item.id);
};
</script>

<style lang="scss" scoped>
/* 支付方式容器样式 */
.y-pay {
  .pay-title {
    border-bottom: 1rpx solid #f6f6f6;
    font-size: 28rpx;
    color: #141519;
    font-weight: bold;
    position: relative;
    height: 80rpx;
    display: flex;
    align-items: center;
    padding-left: 20rpx;

    &::before {
      position: absolute;
      left: 0rpx;
      height: 50%;
      width: 7rpx;
      content: "";
      top: 50%;
      transform: translateY(-50%);
      border-radius: 3rpx;
      background-color: #058752;
    }
  }

  .divider {
    margin: 0 auto;
    width: 300rpx;
  }

  /* 支付项样式 */
  .pay-item {
    width: 100%;
    margin: 0 auto;
    display: flex;
    height: 100rpx;
    align-items: center;
    justify-content: space-between;

    /* 支付图标样式 */
    .pay-icon {
      width: 70rpx;
    }

    /* 支付名称样式 */
    .pay-type {
      font-size: 26.63rpx;
      font-weight: bold;
      width: 550rpx;
    }
  }
}
</style>
