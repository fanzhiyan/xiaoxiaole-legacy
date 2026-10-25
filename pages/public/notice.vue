<template>
  <y-layout>
    <view class="card" v-for="item in DataList" @click="$u.route(`/pages/public/notice-info?id=${item.id}`)">
      <view class="title">{{ item.title }}</view>
      <view class="content">
        <u-parse :content="item.content"></u-parse>
      </view>
      <view class="time">{{ $u.timeFormat(item.create_time, "yyyy-mm-dd hh:MM") }}</view>
    </view>
  </y-layout>
  <view></view>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import shiba from "@/shiba";
import { onLoad, onReachBottom, onShow } from "@dcloudio/uni-app";
onLoad(() => {
  getData();
});

const { DataList } = shiba.$hook.useGetList(shiba.$api.public.GetNotification);
</script>

<style lang="scss" scoped>
.card {
  width: 686rpx;
  background: #ffffff;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  margin: 20rpx auto;
  padding: 20rpx;
  box-sizing: border-box;

  .title {
    font-size: 32rpx;
    color: #333333;
    font-weight: bold;
    line-height: 1.5;
  }

  .content {
    padding: 15rpx 0;
    font-size: 28rpx;
    color: #666666;
    line-height: 1.3;
  }

  .time {
    padding: 15rpx 0;
    font-size: 25rpx;
    color: #999999;
  }
}
</style>
