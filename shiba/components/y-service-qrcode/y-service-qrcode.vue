<template>
  <up-popup :show="modelValue" @open="getGrassInfo" @close="emits('update:modelValue', false)" closeable="true" :round="20" mode="center">
    <view class="qrcode-content">
      <view class="title">{{ title }}</view>
      <view class="qrcode">
        <up-image width="320rpx" height="320rpx" :src="props.imgUrl ? props?.imgUrl : state?.kefu_image" mode=""></up-image>
      </view>
      <view class="desc">{{ desc }}</view>
    </view>
  </up-popup>
</template>

<script setup>
import { reactive, computed, ref, onMounted } from "vue";
import shiba from "@/shiba";
const topic_id = computed(() => shiba.$store("app").user_topic_id);
const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  imgUrl: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "客服",
  },
  desc: {
    type: String,
    default: "联系客服",
  },
});
let state = reactive({
  kefu_image: "",
});
onMounted(() => {
  getGrassInfo();
});
// 获取动态
// 获取首页详情
// run_auth_status：跑腿认证状态：0.未申请，1.待审核，2.审核通过
// auth_status：身份认证状态：0.未申请，1.待审核，2.审核通过
const getGrassInfo = async () => {
  const res = await shiba.$api.public.getGrassIndex({
    id: topic_id.value,
  });
  state.kefu_image = uni.$y.oss(res.data.kefu_image);
};
</script>

<style lang="scss" scoped>
.qrcode-content {
  width: 600rpx;
  height: 640rpx;
  position: relative;
  border-radius: 20rpx 20rpx 20rpx 20rpx;
  background: url(../../../static/public/bg_service.png);
  background-size: 100% 100%;
  .qrcode-info {
    width: 300rpx;
    height: 300rpx;
  }
  .qrcode {
    height: 450rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  // 客服二维码
  .title {
    font-size: 32rpx;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
  }
  .desc {
    text-align: center;
    color: #999;
  }
}
</style>
