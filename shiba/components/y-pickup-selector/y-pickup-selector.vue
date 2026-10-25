<template>
  <view class="pickup-selector">
    <up-popup :show="modelValue" mode="bottom" :round="20" @close="handleClose">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">选择送达时间</text>
        </view>
        <view class="picker-container">
          <picker-view :value="currentIndex" @change="handleChange" class="picker-view">
            <!-- 日期列 -->
            <picker-view-column>
              <view v-for="(date, index) in dateList" :key="index" class="picker-item" :class="{ 'picker-item-selected': currentIndex[0] === index }">
                {{ date.label }}
              </view>
            </picker-view-column>
            <!-- 时间列 -->
            <picker-view-column>
              <view v-for="(time, index) in displayTimeList" :key="index" class="picker-item" :class="{ 'picker-item-selected': currentIndex[1] === index }">
                {{ time.label }}
              </view>
            </picker-view-column>
          </picker-view>
        </view>
        <view class="selected-time-display">已选择: {{ selectedDate.label }} {{ selectedTime.label }}</view>
        <view class="popup-footer">
          <u-button shape="circle" text="取消" :customStyle="{ width: '300rpx', height: '90rpx', color: '#333' }" color="#F7F8FC" @click="handleClose"></u-button>
          <u-button shape="circle" text="确定" :customStyle="{ width: '300rpx', height: '90rpx' }" color="#1673FE" @click="handleConfirm"></u-button>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from "vue";

interface DateTimeItem {
  label: string;
  value: string;
}

interface PickupTimeResult {
  date: DateTimeItem;
  time: DateTimeItem;
  formattedValue: string;
  dateTime: string;
  timestamp: number;
}

interface Props {
  modelValue: boolean;
  days?: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  days: 5, // 默认显示5天
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm", result: PickupTimeResult): void;
}>();

const currentIndex = ref<number[]>([0, 0]);
const dateList = ref<DateTimeItem[]>([]);

// 创建全天候的时间列表（每30分钟一个选项）
const fullTimeList = ref<DateTimeItem[]>([]);
const generateFullTimeList = () => {
  const times: DateTimeItem[] = [];
  for (let hour = 0; hour < 24; hour++) {
    // 添加整点
    times.push({
      label: `${hour.toString().padStart(2, "0")}:00`,
      value: `${hour.toString().padStart(2, "0")}:00`,
    });
    // 添加半点
    times.push({
      label: `${hour.toString().padStart(2, "0")}:30`,
      value: `${hour.toString().padStart(2, "0")}:30`,
    });
  }
  return times;
};

// 计算两小时后的时间并格式化
const calculateTwoHoursLater = () => {
  const now = new Date();
  now.setHours(now.getHours() + 2);

  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes() >= 30 ? "30" : "00";

  return {
    formatted: `${hour}:${minute}`,
    hour: parseInt(hour),
    minute: parseInt(minute),
  };
};

// 特殊选项：大约2小时后
const todaySpecialOption = computed(() => {
  const twoHoursLater = calculateTwoHoursLater();
  return {
    label: `大约2小时后`,
    value: "after-2-hours",
  };
});
// (${twoHoursLater.formatted})

// 立即上门选项
const immediateOption = computed(() => {
  return {
    label: "尽快送达",
    value: "immediate",
  };
});

// 一小时内选项
const withinOneHourOption = computed(() => {
  return {
    label: "一小时内",
    value: "within-one-hour",
  };
});

// 计算今天可用的时间列表（过滤掉已经过去的时间）
const getTodayAvailableTimes = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // 计算当前时间后的2小时（向上取整到最近的半小时）
  const twoHoursLaterHour = currentHour + 2 + (currentMinute > 30 ? 1 : 0);
  const twoHoursLaterMinute = currentMinute > 30 ? 0 : 30;

  // 过滤掉已经过去的时间
  return fullTimeList.value.filter((timeItem) => {
    const [hourStr, minuteStr] = timeItem.value.split(":");
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    // 如果小时数大于当前小时数+2，则可用
    if (hour > twoHoursLaterHour) return true;
    // 如果小时数等于当前小时数+2，则检查分钟数
    if (hour === twoHoursLaterHour && minute >= twoHoursLaterMinute) return true;

    return false;
  });
};

// 根据选择的日期动态显示时间列表
const displayTimeList = computed(() => {
  if (fullTimeList.value.length === 0) {
    fullTimeList.value = generateFullTimeList();
  }

  // 如果选择的是今天，过滤掉已经过去的时间，并添加"立即上门"和"大约2小时后"选项
  if (currentIndex.value[0] === 0 && isFirstDayToday.value) {
    const availableTimes = getTodayAvailableTimes();

    // 如果没有可用时间，至少返回最后一个时间点
    if (availableTimes.length === 0) {
      return [withinOneHourOption.value, todaySpecialOption.value, fullTimeList.value[fullTimeList.value.length - 1]];
    }

    return [withinOneHourOption.value, todaySpecialOption.value, ...availableTimes];
  } else {
    // 非今天返回完整时间列表
    return fullTimeList.value;
  }
});

const selectedDate = computed(() => dateList.value[currentIndex.value[0]] || { label: "", value: "" });
const selectedTime = computed(() => displayTimeList.value[currentIndex.value[1]] || { label: "", value: "" });

// 检查第一天是否是今天
const isFirstDayToday = computed(() => {
  if (dateList.value.length === 0) return false;

  const today = new Date();
  const firstDayDate = new Date(dateList.value[0].value);

  return today.getFullYear() === firstDayDate.getFullYear() && today.getMonth() === firstDayDate.getMonth() && today.getDate() === firstDayDate.getDate();
});

// 监听props变化和内部状态变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      generateDateList();
      // 生成时间列表
      if (fullTimeList.value.length === 0) {
        fullTimeList.value = generateFullTimeList();
      }

      // 当打开选择器时，如果是今天，默认选择第一个可用时间
      if (isFirstDayToday.value) {
        currentIndex.value = [0, 0]; // 默认选择今天和第一个时间（大约2小时后）
      }
    }
  }
);

watch(
  currentIndex,
  (newVal, oldVal) => {
    // 如果日期变化了，需要重置时间选项
    if (newVal[0] !== oldVal[0]) {
      // 如果从今天切换到其他日期，重置时间选项到第一个
      currentIndex.value = [newVal[0], 0];
    }
  },
  { deep: true }
);

onMounted(() => {
  generateDateList();
  fullTimeList.value = generateFullTimeList();
});

// 格式化日期为 "月日" 格式
function formatDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}

// 生成未来几天的日期列表
function generateDateList(): void {
  const tempDateList: DateTimeItem[] = [];
  const today = new Date();

  for (let i = 0; i < props.days; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    const formattedDate = formatDate(date);
    const isoDate = date.toISOString().split("T")[0] || "";

    let label = formattedDate;
    if (i === 0) {
      label = "今天";
    } else if (i === 1) {
      label = "明天";
    }

    tempDateList.push({
      label: label,
      value: isoDate,
    });
  }

  dateList.value = tempDateList;
}

// 处理picker-view变更事件
function handleChange(e: any): void {
  const newValue = e.detail.value;

  // 如果日期变化了（从今天切换到其他日期，或从其他日期切换到今天）
  if (newValue[0] !== currentIndex.value[0]) {
    if (newValue[0] === 0 && isFirstDayToday.value) {
      // 如果切换到今天，默认选择第一个可用时间（大约2小时后）
      newValue[1] = 0;
    } else if (currentIndex.value[0] === 0 && isFirstDayToday.value && newValue[1] === 0) {
      // 如果从今天切换到其他日期，且当前选择的是"大约2小时后"，则选择第一个普通时间
      newValue[1] = 0;
    }
  }

  currentIndex.value = newValue;
}

// 处理确认按钮点击
function handleConfirm(): void {
  let timestamp = 0;

  try {
    if (selectedTime.value.value === "within-one-hour") {
      // "一小时内"
      const now = new Date();
      now.setHours(now.getHours(), now.getMinutes() + 59, 59, 999);
      timestamp = now.getTime();
    } else if (selectedTime.value.value === "after-2-hours") {
      // "大约2小时后"
      const now = new Date();
      const twoHoursLater = calculateTwoHoursLater();
      now.setHours(twoHoursLater.hour, twoHoursLater.minute, 0, 0);
      timestamp = now.getTime();
    } else if (selectedTime.value.value === "immediate") {
      // "立即上门"：返回当前时间戳
      const now = new Date();
      timestamp = now.getTime();
    } else {
      // 其它时间
      const dateStr = selectedDate.value.value;
      const timeStr = selectedTime.value.value;
      if (dateStr && timeStr) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const date = new Date(dateStr);
        date.setHours(hours, minutes, 0, 0);
        timestamp = date.getTime();
      }
    }
  } catch (error) {
    console.error("计算时间戳失败:", error);
  }

  // 处理特殊时间值
  let actualTimeValue = selectedTime.value.value;
  if (selectedTime.value.value === "within-one-hour") {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = (now.getMinutes() + 59).toString().padStart(2, "0");
    actualTimeValue = `${hour}:${minute}`;
  } else if (selectedTime.value.value === "after-2-hours") {
    actualTimeValue = calculateTwoHoursLater().formatted;
  } else if (selectedTime.value.value === "immediate") {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    actualTimeValue = `${hour}:${minute}`;
  }

  emit("confirm", {
    date: selectedDate.value,
    time: selectedTime.value,
    formattedValue: `${selectedDate.value.label} ${selectedTime.value.label}`,
    dateTime: `${selectedDate.value.value} ${
      selectedTime.value.value === "after-2-hours" || selectedTime.value.value === "immediate" || selectedTime.value.value === "within-one-hour" 
        ? actualTimeValue 
        : selectedTime.value.value
    }`,
    timestamp: timestamp,
  });
  emit("update:modelValue", false);
}

// 处理关闭事件
function handleClose(): void {
  emit("update:modelValue", false);
}
</script>

<style>
.popup-content {
  padding-bottom: env(safe-area-inset-bottom);
}

.popup-header {
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* border-bottom: 1px solid #f5f5f5; */
}

.popup-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.picker-container {
  height: 500rpx;
}

.picker-view {
  width: 100%;
  height: 100%;
}

.picker-item {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #999;
}

.picker-item-selected {
  color: #333;
  font-weight: bold;
}

.selected-time-display {
  padding: 20rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666;
  border-top: 1px solid #f5f5f5;
}

.popup-footer {
  padding: 20rpx 30rpx;
  display: flex;
}

.confirm-btn {
  height: 90rpx;
  background-color: #d81b1c;
  color: #ffffff;
  border-radius: 8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
}
</style>
