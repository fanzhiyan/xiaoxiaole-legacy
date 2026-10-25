<template>
  <view class="notices">
    <view class="notice-icon">
    </view>
    <view class="carousel">
      <view class="carousel-wrapper" :style="{ transform: `translateY(-${currentIndex * 88}rpx)` }">
        <!-- @click="$u.route(`/pages/management/management-info?id=${item.grass_id}`)" -->

        <view class="carousel-item" @click="$u.route(`/pages/public/hot-today`)" v-for="(item, index) in list" :key="item.id">
          <view class="serial">
            {{ index + 1 }}
          </view>
          <view class="carousel-name text-cut-1">
            {{ item[keyName] }}
          </view>
          <view class="carousel-view">
            <u-image width="22.19rpx" height="27rpx" src="/static/icon/public/hots.png" mode="aspectFit"></u-image>
            {{ item.hot_num }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  keyName: {
    type: String,
    default: "content",
  },

  list: {
    type: Array,
    default: () => [],
  },
  displayDuration: {
    type: Number,
    default: 3000, // 3 seconds
  },
  scrollDuration: {
    type: Number,
    default: 3000, // 3 seconds
  },
});

const currentIndex = ref(0);
let intervalId = null;

const cycleItems = () => {
  currentIndex.value = (currentIndex.value + 1) % props.list.length;
};

watch(
  () => props.scrollDuration,
  (newVal) => {
    if (newVal && !intervalId) {
      intervalId = setInterval(cycleItems, props.displayDuration + props.scrollDuration);
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.notices {
  height: 88rpx;
  background-color: rgba(255, 212, 96, 0.2);
  border-radius: 88rpx;
  margin: 20rpx auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;

  .notice-icon {
    width: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.carousel {
  width: calc(100% - 120rpx);
  overflow: hidden;
  height: 88rpx;
  position: relative;
}

.carousel-wrapper {
  display: flex;
  flex-direction: column;
  transition: transform 2s ease;
}

.carousel-item {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  .serial {
    width: 30rpx;
    font-size: 29rpx;
    flex-shrink: 0;
    color: #f26418;
  }

  .carousel-name {
    line-height: 88rpx;
    font-size: 29rpx;
    height: 88rpx;
    width: calc(100% - 180rpx - 30rpx);
  }

  .carousel-view {
    width: 140rpx;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    gap: 5rpx;
    color: #f26418;
    height: 100%;
    font-size: 22rpx;

    .num {
    }
  }
}
</style>
