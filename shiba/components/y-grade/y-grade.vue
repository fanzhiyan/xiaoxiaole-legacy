<template>
  <view class="grade-con">
    <image class="icon" :src="$y.oss(level_img)" mode="aspectFit"></image>
    <view class="level-lable">
      {{ level_text }}
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  level_img: {
    type: String,
    default: "",
  },
  level_text: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.grade-con {
  padding: 0 20rpx 0 0;
  height: 28rpx;
  gap: 10rpx;
  border-radius: 28rpx;
  background: RGBA(252, 236, 220, 0.4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .level-lable {
    color: #fe8024;
    font-size: 13rpx;
  }
}
.icon {
  width: 28rpx;
  height: 28rpx;
}
</style>
