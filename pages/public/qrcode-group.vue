<template>
  <y-layout>
    <view class="content">
      <view class="qrcode">
        <view class="bg">
        </view>
        <view class="qrcode-data">
          <!-- <up-qrcode :size="200" :val="icon"></up-qrcode> -->
          <image :show-menu-by-longpress="true" :src="icon" mode="aspectFit" style="width: 150rpx; height: 150rpx"></image>
        </view>
      </view>
      <view class="hint">{{ System.group_code_content }}</view>
    </view>
  </y-layout>
</template>

<script setup>
import { onLoad, onReady } from "@dcloudio/uni-app";
import shiba from "@/shiba";
import { reactive, computed, ref } from "vue";
const appStore = computed(() => shiba.$store("app").user_topic_id);
const System = computed(() => shiba.$store("app").System);

// 事件处理
onLoad(() => {
  getTopic();
});
let group_code = ref("");
let icon = ref("");
const getTopic = async () => {
  const res = await shiba.$api.api.QwRoomCode({
    topic_id: appStore.value,
  });
  // icon.value = res.data.qr_url;
  icon.value = `data:image/png;base64,${res.data.qr_url}`;
};

onLoad(() => {
  getTopic();
});
</script>

<style lang="scss" scoped>
.content {
  padding: 20rpx;
  width: 702rpx;
  margin: 20rpx auto;
  height: 869rpx;
  background: #ffffff;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  .hint {
    color: #333;
    font-size: 28rpx;
  }
  .qrcode {
    height: 700rpx;
    position: relative;

    .bg {
      position: absolute;
      z-index: 1;
    }
    .qrcode-data {
      position: absolute;
      z-index: 11;
      width: 229rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 229rpx;
      background-color: #fff;
      top: 47%;
      left: 50%;
      border-radius: 20rpx;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
