<template>
  <y-layout>
    <view class="contaion">
      <view class="title">{{ state.title }}</view>
      <view class="time">
        {{ $u.timeFormat(state.time) }}
      </view>
      <up-gap height="30rpx" bgColor="#f8f8f8"></up-gap>
      <view class="parse">
        <u-parse :content="state.content"></u-parse>
      </view>
    </view>
  </y-layout>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import shiba from "@/shiba";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
let noticeId = "";
let state = reactive({
  title: "",
  content: "",
  time: 0,
  id: "",
});
onLoad((opction) => {
  state.id = opction?.id;
  getInfo();
});

const getInfo = async () => {
  const res = await shiba.$api.public.GetNotificationDetail({
    id: state.id,
  });
  state.content = res.data.content;
  state.time = res.data.create_time;
  state.title = res.data.title;
};
</script>

<style lang="scss" scoped>
.contaion {
  .title {
    font-size: 32rpx;
    color: #333333;
    font-weight: bold;
    line-height: 1.5;
    padding: 10rpx 20rpx;
  }
  .time {
    margin: 10rpx 0;
    font-size: 24rpx;
    color: #999999;
    padding: 0rpx 20rpx;
  }
  .parse {
    padding: 15rpx;
  }
}
</style>
<style>
page {
  background-color: #fff;
}
</style>
