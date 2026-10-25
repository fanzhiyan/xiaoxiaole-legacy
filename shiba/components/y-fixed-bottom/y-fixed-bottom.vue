<template>
  <!-- 占位视图，用于调整布局 -->
  <view class="pal" :style="{ height: PalHeight }"></view>
  <!-- 固定位置的视图，包含插槽内容 -->
  <view class="y-fixed" :style="{ 'padding-bottom': bottomNavBarHeight + 'px', 'z-index': index }">
    <slot></slot>
  </view>
</template>

<script setup>
import { ref, nextTick, getCurrentInstance, onMounted } from "vue";

// 获取当前组件实例
const instance = getCurrentInstance();

// 定义组件的 props
const pros = defineProps({
  index: {
    type: [String, Number],
    default: 1077,
  },
  bottom: {
    type: String,
    default: "0rpx",
  },
});

// 定义响应式变量
let platform = ref("");
let bottomNavBarHeight = ref(0);

// 组件挂载时的生命周期钩子
onMounted(() => {
  // 获取系统信息
  const res = uni.getSystemInfoSync();
  // 设置底部导航栏高度
  bottomNavBarHeight.value = res.safeAreaInsets.bottom;

  // 根据平台类型进行不同的初始化操作
  if (res.platform === "ios" || res.platform === "devtools") {
    platform.value = "ios";
    nextTick(() => {
      initPal(res.platform, bottomNavBarHeight.value);
    });
  } else if (res.platform === "android") {
    platform.value = "android";
    nextTick(() => {
      initPal(res.platform, 0);
    });
  }

  // 隐藏 TabBar
  uni.hideTabBar();
});

// 定义占位视图的高度
let PalHeight = ref("0px");

// 初始化占位视图的高度
const initPal = (type, BarHeight) => {
  uni
    .createSelectorQuery()
    .in(instance)
    .select(".y-fixed")
    .boundingClientRect((data) => {
      PalHeight.value = `${data.height + 10 + BarHeight}px`;
    })
    .exec();
};
</script>

<style lang="scss" scoped>
.y-fixed {
  width: 100%;
  position: fixed;

  bottom: v-bind(bottom);
}
</style>
