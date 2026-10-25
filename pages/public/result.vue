<template>
  <view class="result-page">
    <!-- 导航栏 -->
    <u-navbar :title="pageTitle" autoBack :placeholder="true"></u-navbar>

    <!-- 结果图标 -->
    <view class="result-icon">
      <u-image :src="iconSrc" width="140rpx" height="140rpx" mode="aspectFit"></u-image>
    </view>

    <!-- 结果内容 -->
    <view class="result-content">
      <!-- 主标题 -->
      <view class="title">{{ title }}</view>

      <!-- 失败原因 -->
      <view v-if="failReason" class="fail-reason">
        {{ failReason }}
      </view>

      <!-- 支付信息 -->
      <view v-if="showPayInfo" class="pay-info">
        <view class="info-row">
          <text class="label">支付方式</text>
          <text class="value">{{ state.payType }}</text>
        </view>
        <view class="info-row">
          <text class="label">支付时间</text>
          <text class="value">{{ state.payTime }}</text>
        </view>
      </view>

      <!-- 按钮区域 -->
      <view class="button-group">
        <!-- 前往帖子列表 -->
        <u-button v-if="showManagement" text="返回帖子列表" @click="goManageMent" shape="circle" color="#1673fe" :customStyle="buttonStyle"></u-button>

        <!-- 返回按钮 -->
        <u-button v-if="showBackBtn" text="返回上一页" @click="goBack" shape="circle" color="#1673fe" :customStyle="buttonStyle"></u-button>

        <!-- 首页按钮 -->
        <u-button v-if="showHomeBtn" text="返回首页" @click="goHome" shape="circle" color="#1673fe" :customStyle="buttonStyle"></u-button>

        <!-- 我的帖子按钮 -->
        <u-button v-if="showMyBtn" text="查看发布" @click="goManageMent" shape="circle" color="#1673fe" :customStyle="buttonStyle"></u-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";

// 页面状态管理
const state = reactive({
  // 基础信息
  success: true, // 是否成功
  title: "", // 主标题
  failReason: "", // 失败原因
  pageTitle: "", // 导航栏标题

  // 支付相关
  showPay: false, // 是否显示支付信息
  payType: "", // 支付方式
  payTime: "", // 支付时间

  // 按钮控制
  showBack: true, // 是否显示返回按钮
  showHome: true, // 是否显示首页按钮
  showManagement: true, // 是否显示前往

  showMy: true, //是否我的帖子按钮
  //
});

// 计算属性
const iconSrc = computed(() => {
  const iconName = state.success ? "success" : "error";
  return `/static/public/${iconName}.gif`;
});

const title = computed(() => state.title || (state.success ? "操作成功" : "操作失败"));
const pageTitle = computed(() => state.pageTitle || title.value);
const showPayInfo = computed(() => state.showPay);
const showMyBtn = computed(() => state.showMy);
const showBackBtn = computed(() => state.showBack);
const showHomeBtn = computed(() => state.showHome);
const failReason = computed(() => state.failReason);
const showManagement = computed(() => state.showManagement);

// 按钮样式
const buttonStyle = {
  width: "320rpx",
  height: "84rpx",
  color: "#fff",
  margin: "0 10rpx",
};

// 页面加载
onLoad((options: any) => {
  // 处理成功/失败状态
  state.success = options.success !== "false";

  // 设置标题
  state.title = options.title || "";
  state.pageTitle = options.pageTitle || "";

  // 设置失败原因
  state.failReason = options.failReason || "";

  // 处理支付信息
  state.showPay = options.showPay === "true";
  if (state.showPay) {
    state.payType = options.payType || "微信支付";
    state.payTime = options.payTime || formatDateTime(new Date());
  }
  console.log(options, "optionsoptions");
  // 处理按钮显示
  state.showHome = options?.showHome == "true" ? true : false;
  state.showBack = options?.showBack == "true" ? true : false;
  state.showMy = options?.showMyBtn == "true" ? true : false;

  state.showManagement = options?.showManagement == "true" ? true : false;
});

// 格式化日期时间
const formatDateTime = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 返回首页
const goHome = () => {
  uni.switchTab({
    url: "/pages/index/index",
  });
};
// 前往帖子列表
const goManageMent = () => {
  uni.redirectTo({
    url: "/pages/management/my-management",
  });
};
</script>

<style lang="scss" scoped>
.result-page {
  min-height: 100vh;
  background: #fff;

  .result-icon {
    margin: 40rpx auto;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 180rpx;
  }

  .result-content {
    padding: 0 32rpx;

    .title {
      font-size: 32rpx;
      color: #333;
      font-weight: 600;
      text-align: center;
      margin-bottom: 24rpx;
    }

    .fail-reason {
      font-size: 28rpx;
      color: #999;
      text-align: center;
      margin: 24rpx 0;
      padding: 0 40rpx;
    }

    .pay-info {
      width: 90%;
      margin: 32rpx auto;
      border-radius: 12rpx;

      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          color: #999;
          font-size: 28rpx;
        }

        .value {
          color: rgba(51, 51, 51, 1);
          font-size: 28rpx;
          font-weight: 500;
        }
      }
    }

    .button-group {
      margin-top: 48rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20rpx;
      flex-direction: column;
    }
  }
}
</style>

<style>
page {
  background-color: #fff !important;
}
</style>
