<template>
  <!-- 根据传入的 role 显示不同的内容图标 -->
  <up-image :width="width" :height="height" :src="src || RoleSrc" mode="aspectFit"></up-image>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  role: {
    type: String,
    default: "",
  },

  src: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "69rpx",
  },
  height: {
    type: String,
    default: "69rpx",
  },
});
const RoleSrc = computed(() => {
  return `/static/level/level-${props.role}.png`;
});
</script>

<style></style>
