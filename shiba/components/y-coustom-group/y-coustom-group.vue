<template>
  <view class="group-container">
    <view class="header">
      <view class="group-info">组局 {{ currentStep }}/{{ totalSteps }}</view>
      <view class="timer" v-if="status == 0">
        <i class="icon-clock"></i>
        <u-count-down @change="onChange" :time="state.timeRemaining" format="HH:mm:ss">
          <view class="time">
            <text class="time__item">{{ timeData.days }}&nbsp;天</text>
            <text class="time__item">{{ timeData.hours > 10 ? timeData.hours : "0" + timeData.hours }}&nbsp;时</text>
            <text class="time__item">{{ timeData.minutes }}&nbsp;分</text>
            <text class="time__item">{{ timeData.seconds }}&nbsp;秒</text>
          </view>
        </u-count-down>
        后组局截止
      </view>
      <view class="timer" v-if="status == 1">已满员</view>
      <view class="timer" v-if="status == 2">已满员</view>
      <view class="timer" v-if="status == 3">已取消</view>
    </view>
    <view class="content">
      <scroll-view class="avatars" scroll-x :show-scrollbar="false">
        <view class="flex-row">
          <view v-for="(avatar, index) in avatars" @tap="$emit('look', avatar)" :key="index" class="avatar-box">
            <view class="avatar" v-if="avatar.image">
              <u-avatar size="102rpx" :src="avatar.image" mode="aspectFit"></u-avatar>
            </view>
            <view v-else class="placeholder">
              <text class="shiba-a"></text>
            </view>
            <text class="label">{{ avatar.label ?? index + 1 }}</text>
          </view>
        </view>
      </scroll-view>
      <view class="footer">加入后点击头像，查看联系方式</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { PropType, watch, reactive, ref } from "vue";

// 定义头像信息的类型
type Avatar = {
  image?: string;
  label: string;
  value: unknown;
};
const emits = defineEmits(["look"]);
// 使用 reactive 创建响应式对象
const timeData = ref({
  hours: 0,
  minutes: 0,
  seconds: 0,
  days: 0,
});

// 定义 onChange 方法
const onChange = (e) => {
  timeData.value = e;
};
// 定义 props
const props = withDefaults(
  defineProps<{
    currentStep: number;
    totalSteps: number;
    timeRemaining: string | number;
    avatars: any[];
    status: number;
  }>(),
  {
    currentStep: 1,
    totalSteps: 3,
    // 结束时间戳
    timeRemaining: 0,
    status: 1,
    avatars: [],
  }
);
let state = reactive({
  timeRemaining: 0,
});
watch(
  () => props.timeRemaining,
  (newVal) => {
    // timeRemaining 是秒 需要转换为毫秒
    const timeRemainingNew = newVal * 1000;
    // 传入的是截止时间戳 我需要你计算出 距离截止时间还有多少秒
    const endTime = timeRemainingNew;
    const nowTime = new Date().getTime();
    const timeRemaining = endTime - nowTime;
    state.timeRemaining = timeRemaining;
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style scoped>
.group-container {
  border-radius: 8px;
  padding: 10px;
}

.content {
  background-color: #fff;
  padding: 30rpx 20rpx;
}

.header {
  padding: 0 20rpx;
  display: flex;
  justify-content: space-between;
}

.group-info,
.timer {
  background-color: #ffe8a8;
  padding: 5rpx 10rpx;
  border-radius: 5rpx 5rpx 0 0;
  font-size: 22rpx;
  display: flex;
  align-items: center;
}

.avatars {
  margin-bottom: 10px;
}

.flex-row {
  gap: 20rpx;
  flex-wrap: nowrap;
  display: flex;
  flex: row;
  justify-content: space-around;
}

.avatar-box {
  width: 102rpx;
  height: 102rpx;
  position: relative;
  text-align: center;
  flex-shrink: 0;
}

.avatar {
  border-radius: 50%;
  border: 1px dashed #d3d3d3;
  position: absolute;
}

.placeholder {
  width: 102rpx;
  height: 102rpx;
  border-radius: 50%;
  border: 1px dashed #d3d3d3;
  background-color: #ffffff;
}

.label {
  display: block;
  margin-top: -20rpx;
  width: 104rpx;
  height: 36rpx;
  background: #fef7e7;
  position: absolute;
  z-index: 111;
  bottom: -10rpx;
  border-radius: 28rpx 28rpx 28rpx 28rpx;
  font-size: 22rpx;
  text-align: center;
  line-height: 36rpx;
  font-weight: 600;
}

.footer {
  text-align: center;
  color: #666;
  font-size: 20rpx;
}
</style>
