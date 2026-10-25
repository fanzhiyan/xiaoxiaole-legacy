<template>
  <view class="float-wrapper" :class="{ 'with-transition': isInitialized }" :style="wrapperStyle" @touchstart="handleTouchStart" @touchmove.prevent="handleTouchMove" @touchend="handleTouchEnd" @touchcancel="handleTouchEnd">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// 固定浮窗大小
const FLOAT_SIZE = 50;

interface Position {
  x: string | number;
  y: string | number;
}

const props = defineProps({
  initPosition: {
    type: Object as () => Position,
    default: () => ({ x: "85%", y: "80%" }),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  zIndex: {
    type: Number,
    default: 2900,
  },
});

const emit = defineEmits(["change", "touchend", "touchstart"]);

// 状态
const screenSize = ref({ width: 375, height: 667 });

// 计算初始位置
const parseValue = (val: string | number, total: number): number => {
  if (typeof val === "string" && val.includes("%")) {
    const percentage = parseFloat(val) / 100;
    return percentage * total;
  }
  return Number(val);
};

// 初始化位置
const initPosition = () => {
  const info = uni.getSystemInfoSync();
  screenSize.value = {
    width: info.windowWidth,
    height: info.windowHeight,
  };

  const x = parseValue(props.initPosition.x, screenSize.value.width);
  const y = parseValue(props.initPosition.y, screenSize.value.height);

  // #ifdef MP-WEIXIN
  const safeArea = info.safeArea || {};
  const bottomSafeHeight = screenSize.value.height - (safeArea.bottom || screenSize.value.height);
  if (bottomSafeHeight > 0) {
    return {
      x,
      y: Math.min(y, screenSize.value.height - bottomSafeHeight - FLOAT_SIZE)
    };
  }
  // #endif

  return { x, y };
};

const position = ref(initPosition());
const isDragging = ref(false);
const startTouch = ref({ x: 0, y: 0 });
const isInitialized = ref(false);

// 样式
const wrapperStyle = computed(() => ({
  transform: `translate(${position.value.x}px, ${position.value.y}px)`,
  width: `${FLOAT_SIZE}px`,
  height: `${FLOAT_SIZE}px`,
  zIndex: isDragging.value ? props.zIndex + 1 : props.zIndex,
  color: "#fff", // 添加文字颜色
}));

// 触摸事件处理
function handleTouchStart(e: any) {
  if (props.disabled) return;
  isDragging.value = true;
  isInitialized.value = true;
  const touch = e.touches[0];
  startTouch.value = {
    x: touch.clientX - position.value.x,
    y: touch.clientY - position.value.y,
  };
  emit("touchstart", position.value);
}

function handleTouchMove(e: any) {
  if (!isDragging.value || props.disabled) return;
  const touch = e.touches[0];

  let newX = touch.clientX - startTouch.value.x;
  let newY = touch.clientY - startTouch.value.y;

  // 限制边界
  newX = Math.max(0, Math.min(newX, screenSize.value.width - FLOAT_SIZE));
  newY = Math.max(0, Math.min(newY, screenSize.value.height - FLOAT_SIZE));

  position.value = { x: newX, y: newY };
  emit("change", position.value);
}

function handleTouchEnd() {
  if (!isDragging.value) return;
  isDragging.value = false;
  emit("touchend", position.value);
}

onMounted(() => {
  // 重新计算一次位置，确保在正确的屏幕尺寸下
  position.value = initPosition();
});

// 暴露方法
defineExpose({
  resetPosition: initPosition,
});
</script>

<style>
.float-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 10px;
  touch-action: none;
  user-select: none;
}

.float-wrapper.with-transition {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
