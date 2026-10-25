<template>
  <y-layout>
    <y-empty title="暂无公告" v-if="DataList.length == 0"></y-empty>
    <view v-for="item in DataList" class="platform-card" @click="$u.route(`/pages/message/message-info?id=${item.id}`)">
      <view class="card-title">{{ item.title }}</view>
      <view class="card-content">
        <u-parse :content="item.content"></u-parse>
      </view>
      <view class="time">{{ $u.timeFormat(item.create_time, "yyyy年mm月dd日") }}</view>
    </view>
  </y-layout>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive, ref } from "vue";
import shiba from "@/shiba";

let state = reactive({
  type: "1",
});
const { DataList, isLoading, isComplete, reset } = shiba.$hook.useGetList(shiba.$api.api.getNotification, {
  params: () => {
    return {
      type: state.type,
      topic_id: shiba.$store("app").user_topic_id,
    };
  },
});
</script>

<style lang="scss" scoped>
.platform-card {
  width: 750rpx;
  padding: 15rpx 25rpx;
  border-bottom: 1rpx solid #f8f8f8;
  .card-title {
    font-size: 32rpx;
    color: #333333;
    font-weight: bold;
  }
  .card-content {
    padding: 10rpx 0;
    color: #666666;
    font-size: 28rpx;
    font-weight: 400;
  }
  .time {
    font-size: 28rpx;
    color: #999999;
  }
}
</style>
<style>
page {
  background-color: #fff;
}
</style>
