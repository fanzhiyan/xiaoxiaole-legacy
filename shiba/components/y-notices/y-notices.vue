<template>
  <view class="notice-container" v-if="noticeList.length" @click="handleNoticeClick">
    <view class="notice-left">
      <view class="today-text">今日</view>
      <view class="hot-text">热榜</view>
      <view class="hot-dot"></view>
    </view>
    <scroll-view
      class="notice-wrapper"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
      :show-scrollbar="false"
      @scroll="onScroll"
      @touchstart="stopAutoScroll"
      @touchend="startAutoScroll">
      <view class="notice-content">
        <view v-for="(notice, index) in noticeList" :key="notice[keyField]" class="notice-item hover-effect">
          <image style="width: 30rpx; height: 30rpx; margin-right: 5rpx" src="/static/icon/rb-icon1.png" mode="" v-if="index == 0"></image>
          <image style="width: 30rpx; height: 30rpx; margin-right: 5rpx" src="/static/icon/rb-icon2.png" mode="" v-else-if="index == 1"></image>
          <image style="width: 30rpx; height: 30rpx; margin-right: 5rpx" src="/static/icon/rb-icon3.png" mode="" v-else-if="index == 2"></image>
          <text class="tag" v-if="index >= 3">{{ index + 1 }}</text>
          <text class="notice-text l-text-cuts" :class="[`text-${index + 1}`]">{{ notice[keyName] }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from "vue";

// 定义props
const props = withDefaults(
  defineProps<{
    // 通知列表数据
    list: Array<any>;
    // 唯一标识字段名
    keyField?: string;
    // 内容字段名
    keyName?: string;
    // 滚动间隔时间(ms)
    interval?: number;
  }>(),
  {
    keyField: "id",
    keyName: "content",
    interval: 2000,
    list: [],
  }
);

// 通知列表
const noticeList = computed(() => props.list);

const currentIndex = ref(0);
const scrollTop = ref(0);
const itemHeight = 40; // 每个通知项的高度

// 滚动定时器
let scrollTimer: number | null = null;

// 开始自动滚动
const startAutoScroll = () => {
  if (noticeList.value.length <= 1) return;
  stopAutoScroll(); // 清除之前的定时器

  // 确保初始滚动位置正确
  if (currentIndex.value === 0) {
    scrollTop.value = 0;
  }

  scrollTimer = setInterval(() => {
    const nextIndex = (currentIndex.value + 1) % noticeList.value.length;
    currentIndex.value = nextIndex;
    scrollTop.value = nextIndex * itemHeight;
  }, props.interval);
};

// 停止自动滚动
const stopAutoScroll = () => {
  if (scrollTimer) {
    clearInterval(scrollTimer);
    scrollTimer = null;
  }
};

// 滚动事件处理
const onScroll = (e: any) => {
  const newIndex = Math.round(e.detail.scrollTop / itemHeight);
  if (newIndex !== currentIndex.value && newIndex >= 0 && newIndex < noticeList.value.length) {
    currentIndex.value = newIndex;
    scrollTop.value = newIndex * itemHeight;
  }
};

// 监听列表数据变化
watch(
  () => props.list,
  (newList) => {
    console.log(211111, "开始滚动");
    if (newList && newList.length > 0) {
      nextTick(() => {
        currentIndex.value = 0;
        scrollTop.value = 0;
        startAutoScroll();
        console.log(11111111, "开始滚动");
      });
    } else {
      // stopAutoScroll();
    }
  },
  { immediate: true, deep: true }
);

// 组件卸载时清理定时器
onUnmounted(() => {
  stopAutoScroll();
});

// 暴露方法给父组件
defineExpose({
  startAutoScroll,
  stopAutoScroll,
});

// 点击通知处理
const handleNoticeClick = () => {
  uni.navigateTo({
    url: "/pages/index/dayHot",
  });
};
</script>

<style lang="scss" scoped>
.notice-container {
  width: 100%;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 8px 16px;
  display: flex;
  align-items: flex-start;
  height: 56px;
  transition: all 0.3s ease;
}

.notice-container:hover {
  border-color: #e6e6e6;
}

/* 隐藏滚动条 */
.notice-container ::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.notice-left {
  padding-right: 16px;
  border-right: 1px solid #f0f0f0;
  margin-right: 16px;
  flex-shrink: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  font-weight: bold;
  font-style: italic;
  position: relative;
}

.today-text {
  color: #1890ff;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(90deg, #1890ff, #36a6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
}

.hot-text {
  color: #ff4d4f;
  font-size: 14px;
  font-weight: 600;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(90deg, #ff4d4f, #ff7875);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.hot-dot {
  width: 6px;
  height: 6px;
  background-color: #ff4d4f;
  border-radius: 50%;
  position: absolute;
  right: 4rpx;
  top: 50%;
  transform: translateY(-50%);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: translateY(-50%) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-50%) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translateY(-50%) scale(1);
    opacity: 0.8;
  }
}

.notice-wrapper {
  flex: 1;
  height: 40px;
  position: relative;
}

.notice-content {
  width: 100%;
}

.notice-item {
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  .tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 16px;
    height: 16px;
    line-height: 1;
    font-size: 11px;
    font-weight: 500;
    padding: 2px 5px;
    margin-right: 8px;
    background: linear-gradient(135deg, #ff4d4f, #ff7875);
    color: white;
    border-radius: 3px;
    box-shadow: 0 2px 4px rgba(255, 77, 79, 0.2);
    transform: scale(0.95);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1);
      box-shadow: 0 3px 6px rgba(255, 77, 79, 0.3);
    }
  }

  .notice-text {
    flex: 1;
    overflow: hidden;
    font-size: 14px;
    line-height: 20px;
    color: #454545;
  }
}

.hover-effect:hover {
  background-color: rgba(24, 144, 255, 0.05);
}

.notice-text {
  overflow: hidden;
  font-size: 14px;
  line-height: 20px;
  color: #454545;
}

.l-text-cuts {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}

/* 过渡动画 */
.notice-scroll-enter-active,
.notice-scroll-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}

.notice-scroll-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.notice-scroll-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
.text-1 {
  color: #d17d30 !important;
}

.text-2 {
  color: #576088 !important;
}

.text-3 {
  color: #a95140 !important;
}

.notice-scroll-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
