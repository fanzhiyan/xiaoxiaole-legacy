<template>
  <view class="errand-card" @click="$u.route(`/pages/management/errand-info?id=${goods_id}&action=${mode}`)">
    <view class="status">
      <view class="status-text">{{ status_text }}</view>
      <view class="status-time">发布时间:{{ create_time_text }}</view>
    </view>
    <view class="content l-text-cuts">{{ content }}</view>

    <block v-if="is_address == 1">
      <view class="location-row">
        <view class="location-icon pickup">取</view>
        <view class="location-text text-cut-1">{{ startaddress }}</view>
      </view>
      <view class="location-row delivery-row">
        <view class="location-icon delivery">送</view>
        <view class="location-text text-cut-1">{{ endaddress }}</view>
      </view>
    </block>
    <view class="bottom">
      <view class="price">￥{{ price }}</view>
      <u-button v-if="!isMy" color="rgba(22, 115, 254, 1)" :text="type_title" :customStyle="{ width: '152rpx', height: '56rpx', margin: '0' }" shape="circle" />
      <!-- 根据用户id判断是不是自己 -->
      <u-button v-else color="rgba(22, 115, 254, 1)" text="查看" :customStyle="{ width: '152rpx', height: '56rpx', margin: '0' }" shape="circle" />
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import shiba from "../..";

const props = defineProps({
  create_time_text: {
    type: String,
    default: "",
  },

  goods_id: {
    type: Number,
    required: true,
    default: -1,
  },
  content: {
    type: String,
    required: true,
    default: "",
  },
  startaddress: {
    type: String,
    default: "",
  },
  endaddress: {
    type: String,
    default: "",
  },
  price: {
    type: [String, Number],
    required: true,
    default: 0,
  },
  status: {
    type: Number,
    default: -1,
  },
  type_title: {
    type: String,
    default: "",
  },
  status_text: {
    type: String,
    default: "",
  },
  mode: {
    type: String,
    default: "look",
  },
  is_address: {
    type: String,
    default: -1,
  },
  // 发布人ID
  user_id: {
    type: Number,
    required: true,
    default: -1,
  },
});
const user = shiba.$store("user").user;
const isMy = computed(() => {
  return user.id == props.user_id;
});
</script>

<style lang="scss" scoped>
.errand-card {
  background-color: #ffffff;
  padding: 32rpx;
  position: relative;

  .status {
    color: #ff7a00;
    font-size: 28rpx;
    padding: 4rpx 16rpx;
    border-radius: 12rpx;
    margin-bottom: 16rpx;

    &-text {
      position: absolute;
      left: 0;
      top: 0;
      // width: 156rpx;
      padding: 0 30rpx;
      height: 44rpx;
      background: rgba(228, 53, 12, 0.1);
      border-radius: 0 0 40rpx 0;
      display: flex;
      align-items: center;
      font-size: 25rpx;
      justify-content: center;
    }
    &-time {
      position: absolute;
      right: 0;
      top: 0;
      padding: 0 30rpx;
      height: 44rpx;
      background: #f5f5f5; /* 柔和灰色背景 */
      color: #b0b0b0; /* 中灰色字体 */
      display: flex;
      align-items: center;
      font-size: 25rpx;
      justify-content: center;
      font-weight: 400;
    }
  }

  .content {
    font-size: 28rpx;
    color: rgba(51, 51, 51, 1);
    line-height: 1.4;
    margin: 40rpx 0;
  }

  .location-row {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
    min-height: 72rpx;
    border-radius: 72rpx;
    background-color: rgba(255, 165, 21, 0.1);
    padding: 0 10rpx;

    .location-icon {
      width: 48rpx;
      height: 48rpx;
      border-radius: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      margin-right: 16rpx;
      color: #ffffff;
      flex-shrink: 0;

      &.pickup {
        background: #ffa515;
      }

      &.delivery {
        background: #1673fe;
      }
    }

    .location-text {
      font-size: 28rpx;
      color: #666666;
      width: 100%;
    }

    &.delivery-row {
      background-color: rgba(22, 115, 254, 0.1);
    }
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24rpx;

    .price {
      color: #ff4d00;
      font-size: 36rpx;
      font-weight: bold;
    }
  }
}
</style>
