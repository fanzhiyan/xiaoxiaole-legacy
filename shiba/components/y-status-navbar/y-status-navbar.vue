<template>
  <!-- 生成一个占位的导航栏元素，动态设置其高度 -->
  <view class="navBar" :style="{ height: headerHeight + MenuHeight + 'px' }">
    <!-- 添加自定义内容插槽 -->
    <view class="custom-content" :style="customContentStyle">
      <view class="slot-container">
        <slot></slot>
      </view>
    </view>
  </view>
  <!-- 这里是根据导航栏高度生成的元素 -->
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";

// 定义属性
const props = defineProps({
  showMenu: {
    type: Boolean,
    default: false,
  },
});

/**
 * 导航栏元素引用和高度。
 */
const MenuHeight = ref(44); // 设置默认高度
const headerHeight = ref(0);
const menuButtonInfo = ref(null);

// 计算自定义内容样式
const customContentStyle = computed(() => {
  const style = {
    top: headerHeight.value + "px",
    height: MenuHeight.value + "px",
    width: "100%", // 默认宽度为100%
    display: "flex",
    alignItems: "center",
  };

  // #ifdef MP-WEIXIN
  if (menuButtonInfo.value) {
    // 计算右侧留出胶囊按钮的空间
    style.width = `${menuButtonInfo.value.left}px`;
    style.paddingLeft = "15px";
  }
  // #endif

  return style;
});

// 监听showMenu属性变化，仅在小程序环境下生效
// #ifdef MP
watch(
  () => props.showMenu,
  (isNewMenuVisible) => {
    if (isNewMenuVisible) {
      adjustForMenuButton();
    }
  },
  {
    immediate: true,
  }
); // 使用immediate选项确保初始化时也执行一次监听函数
// #endif

/**
 * 组件挂载后执行，设置初始导航栏高度。
 */
onMounted(() => {
  initializeNavigationHeight();
});

/**
 * 初始化不同平台下的导航栏高度。
 */
function initializeNavigationHeight() {
  const systemInfo = uni.getSystemInfoSync();

  // APP 或 微信小程序
  // #ifdef APP || MP-WEIXIN
  headerHeight.value = systemInfo.statusBarHeight;
  // #endif

  // 微信小程序特别处理
  // #ifdef MP-WEIXIN
  if (props.showMenu) {
    adjustForMenuButton();
  }
  // #endif

  // H5环境
  // #ifdef H5
  headerHeight.value = 30;
  // #endif
}

/**
 * 根据菜单按钮调整导航栏高度（适用于微信小程序）。
 */
function adjustForMenuButton() {
  menuButtonInfo.value = uni.getMenuButtonBoundingClientRect();
  MenuHeight.value = menuButtonInfo.value.height;
}
</script>

<style scoped>
/* 设置导航栏的宽度为100% */
.navBar {
  width: 100%;
  position: relative;
}

.custom-content {
  position: absolute;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.slot-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
