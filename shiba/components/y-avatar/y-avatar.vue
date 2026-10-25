<template>
  <view class="y-avatar" :style="{ width: avatarSize, height: avatarSize }">
    <view class="avatar-box">
      <image :src="src" :alt="BRAND.name" mode="" :style="{ width: avatarSize, height: avatarSize, borderRadius: avatarSize }"></image>
    </view>
    <view class="gender" v-if="srcGender" :style="{ width: genderSize, height: genderSize }">
      <image :src="srcGender" mode="aspectFit"></image>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import BRAND from "@/shiba/config/brand.js";
// run_auth_status：跑腿认证状态：0.未申请，1.待审核，2.审核通过
// auth_status：身份认证状态：0.未申请，1.待审核，2.审核通过
interface Props {
  src: string;
  avatarSize: string;
  genderSize: string;
  gender: number;
  is_official: number;
  auth_status: number;
}
// 1.男，2.女
const props = withDefaults(defineProps<Props>(), {
  src: "",
  avatarSize: "64rpx",
  genderSize: "32rpx",
  auth_status: 1,
  // 是否是官方
  is_official: 1,
});
let srcGender = computed(() => {
  if (props.is_official == 2) {
    return "/static/icon/is_official.png";
  }
  if (props.auth_status == 2) {
    return "";
  }
  return "";
});
</script>

<style lang="scss" scoped>
.y-avatar {
  position: relative;

  .avatar-box {
    z-index: 1;
    position: absolute;
  }

  .gender {
    position: absolute;
    right: -5rpx;
    bottom: -5rpx;
    z-index: 11;
    background-color: rgba(235, 232, 232, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      widows: 32rpx;
      height: 32rpx;
    }
  }
}
</style>
