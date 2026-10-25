<template>
  <y-layout>
    <u-image width="750rpx" height="384rpx" :src="$y.oss(System.publicize_image)" mode="widthFix"></u-image>
    <view class="paid-content">
      <view class="title">名额</view>
      <view class="sub-title">确保学生体验活动效果</view>
      <view class="btn">本圈子今日剩余名额：3</view>
    </view>
    <y-fixed-bottom bottom="30rpx">
      <view class="paid-fixed">
        <view class="btn" @click="$u.route('/pages/management/create-prom')">发布推广内容</view>
        <view class="paid-row">
          <y-radio size="30rpx"></y-radio>
          已阅读并同意
          <text>《服务协议》</text>
          与
          <text>《隐私政策》</text>
        </view>
      </view>
    </y-fixed-bottom>
  </y-layout>
</template>

<script setup>
import { computed } from "vue";
import shiba from "../../shiba";
const System = computed(() => shiba.$store("app").System);
</script>

<style lang="scss" scoped>
.paid-content {
  padding: 0 25rpx;
  .title {
    margin: 20rpx 0;
    font-size: 28rpx;
    color: #333333;
    font-weight: bold;
  }
  .sub-title {
    margin: 10rpx 0;
    font-size: 28rpx;
    color: #333333;
  }
}
.btn {
  font-weight: bold;
  width: 694rpx;
  height: 81rpx;
  background: #f6f7f9;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20rpx auto;
}
.paid-fixed {
  .btn {
    width: 640rpx;
    height: 88rpx;
    border-radius: 88rpx;
    background: #ffd972;
    color: #333333;
  }
  .paid-row {
    font-size: 24rpx;
    display: flex;
    color: #999999;
    align-items: center;
    gap: 10rpx;
    justify-content: center;
    text {
      color: #2999f8;
    }
  }
}
</style>

<style>
page {
  background-color: #fff;
}
</style>
