<template>
  <!-- 点击事件绑定 -->
  <view @click="handleItemClick" class="type-item tabbar-item">
    <view class="image-container">
      <view class="tag" v-if="item.pagePath == 'pages/message/message'"><u-badge max="99" :value="noticeSystem.noteCount"></u-badge></view>

      <!-- 根据激活状态显示不同的图片 -->
      <u-image width="48rpx" height="48rpx" v-if="item.pagePath == activeUrl" :src="item.selectedIconPath" mode="aspectFit"></u-image>
      <u-image width="48rpx" height="48rpx" v-else :src="item.iconPath" mode="aspectFit"></u-image>
    </view>
    <!-- 根据传入的文本颜色和字体大小显示文本 -->
    <view :style="{ color: item.pagePath == activeUrl ? item.activeColor : item.color, fontSize: item.fontSize, fontSize: `${item.size}rpx` }" style="font-weight: 600">
      {{ item.text }}
    </view>
  </view>
</template>

<script setup>
// 引入 Vue 的计算属性和引用
import { computed, ref } from "vue";
const noticeSystem = computed(() => uni.$store("app").notice);
// 定义组件的属性
const props = defineProps({
  item: {
    type: Object,
    default: () => {
      size: "22rpx";
    },
  },
  activeUrl: {
    type: String,
    default: "",
  },
});
// 定义组件的事件
const emits = defineEmits(["wxClick", "changeTabbarItem"]);
// 定义点击事件处理函数
const handleItemClick = () => {
  // 触发 'changeTabbarItem' 事件，并传递当前 item 对象
  emits("changeTabbarItem", props.item);
};
</script>

<style lang="scss" scoped>
/* 定义 tabbar-item 的样式 */
.tabbar-item {
  width: 100% !important;
  height: 100%;
}

/* 定义 image-container 的样式 */
.image-container {
  display: flex;
  align-items: center;
  width: 50rpx;
  height: 50rpx;
  justify-content: center;
  position: relative;
  .tag {
    position: absolute;
    // width: 35rpx;
    // height: 35rpx;
    // border-radius: 35rpx;
    right: -10rpx;
    top: -15rpx;
    z-index: 999;
    color: #fff;
    // font-size: 18rpx;
    // text-align: center;
    // line-height: 35rpx;
  }
}

/* 定义 type-item 的样式 */
.type-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
