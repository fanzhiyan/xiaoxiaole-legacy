<template>
  <y-layout>
    <view class="message-content">
      <view class="title">{{ state.title }}</view>
      <view class="time">{{ $u.timeFormat(state.create_time, "yyyy年mm月dd日") }}</view>
      <view class="content">
        <up-parse :content="state.content"></up-parse>
      </view>
    </view>
  </y-layout>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive, ref, warn } from "vue";
import shiba from "@/shiba";
let state = reactive({
  content: "",
  id: "",
  title: "",
  content: "",
  create_time: "",
});
onLoad((opction) => {
  state.id = opction.id;
  getInfo();
});
const getInfo = async () => {
  const res = await shiba.$api.public.GetNotificationDetail({
    id: state.id,
  });
  state.create_time = res.data.create_time;
  state.title = res.data.title;
  state.content = res.data.content;
};
</script>

<style lang="scss" scoped>
.message-content {
  padding: 20rpx;
  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
  }
  .time {
    font-weight: 400;
    font-size: 28rpx;
    color: #999999;
    padding: 15rpx 0;
  }
  .content {
    font-size: 30rpx;
    color: #333333;
    font-weight: 400;
  }
}
</style>
