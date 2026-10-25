<template>
	<u-popup :show='modelValue' @close="closePopup" :round="20">
		<view class="appointment-picker">
			<view class="header">
				<view class="title">{{title}}</view>
				<view class="close-button" @click='closePopup'>
					<u-icon name="close-circle"></u-icon>
				</view>
			</view>
			<view class="content">
				<scroll-view class="date-list" scroll-y="true">
					<view class="date-item" :class="{'active': date === selectedDate}" v-for="date in dateList"
						:key="date" @click="selectDate(date)">
						{{ date }}
					</view>
				</scroll-view>
				<scroll-view class="time-slots" scroll-y="true">
					<view v-for="(timePeriod, index) in filteredTimeSlots" :key="index" class="time-period">
						<view class="period-label">{{ timePeriod.period }}</view>
						<view class="time-slot-list">
							<view :class="{'active-slot': slot === selectedTimeSlot}" @click="selectTimeSlot(slot)"
								v-for="(slot, slotIndex) in timePeriod.slots" :key="slotIndex" class="time-slot">
								{{ slot }}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="actions">
				<u-button @click='cancel' shape="circle" color="#3AD7A1"
					:customStyle="{'width':'311rpx','height':'84rpx'}" plain text='取消'></u-button>
				<u-button @click='confirm' shape="circle" color="#3AD7A1"
					:customStyle="{'width':'311rpx','height':'84rpx'}" text='确认上门时间'></u-button>
			</view>
		</view>
	</u-popup>
</template>

<script setup>
	import {
		ref,
		reactive,
		watch,
		computed
	} from 'vue';

	// 获取当前时间戳和七天后的时间戳
	const currentTimestamp = Date.now();
	const currentDate = new Date();
	const sevenDaysLaterTimestamp = new Date();
	sevenDaysLaterTimestamp.setDate(sevenDaysLaterTimestamp.getDate() + 7);

	// 定义 emits
	const emits = defineEmits(['update:modelValue', 'cancel', 'confirm']);

	// 定义 props 并设置默认值
	const props = defineProps({
		startTimestamp: {
			type: Number,
			default: 0
		},
		endTimestamp: {
			type: Number,
			default: 0
		},
		modelValue: {
			type: Boolean,
			default: true
		},
		title: {
			type: String,
			default: "预约日期"
		}
	});

	// 定义时间段数据
	const timeSlots = ref([{
			period: '上午',
			slots: ['09:00-10:00', '10:00-12:00']
		},
		{
			period: '下午',
			slots: ['12:00-14:00', '14:00-16:00', '16:00-18:00']
		},
		{
			period: '晚上',
			slots: ['18:00-20:00', '20:00-22:00']
		}
	]);

	// 定义日期数组
	const dateList = ref([]);

	// 初始化数据日期
	const generateDateList = () => {
		let startDate = props.startTimestamp === 0 ? new Date(currentTimestamp) : new Date(props.startTimestamp);
		let endDate = props.endTimestamp === 0 ? new Date(sevenDaysLaterTimestamp) : new Date(props.endTimestamp);

		const dates = [];
		for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
			dates.push(formatDate(d));
		}
		dateList.value = dates;
		// 默认选第一个元素 实现默认值
		if (dates.length > 0) {
			selectedDate.value = dates[0];
		}

	};

	// 格式化日期
	const formatDate = (date, format = 'MM月dd日') => {
		const year = date.getFullYear().toString();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');

		const replacements = {
			yyyy: year,
			yy: year.slice(-2),
			MM: month,
			M: month.replace(/^0/, ''),
			dd: day,
			d: day.replace(/^0/, '')
		};

		return format.replace(/yyyy|yy|MM|M|dd|d/g, match => replacements[match]);
	};

	// 选择日期
	const selectDate = (date) => {
		selectedDate.value = date;
	};

	// 选择时间段
	const selectTimeSlot = (slot) => {
		selectedTimeSlot.value = slot;
	};

	// 存储选择值
	const selectedDate = ref("");
	const selectedTimeSlot = ref("");

	// 过滤时间段
	const filteredTimeSlots = computed(() => {
		if (selectedDate.value === formatDate(currentDate)) {
			const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();
			return timeSlots.value.map(period => {
				return {
					...period,
					slots: period.slots.filter(slot => {
						const [start, end] = slot.split('-').map(time => {
							const [hours, minutes] = time.split(':').map(Number);
							return hours * 60 + minutes;
						});
						return start > currentTime;
					})
				};
			});
		}
		return timeSlots.value;
	});

	// 初始化监听
	watch([() => props.startTimestamp, () => props.endTimestamp], generateDateList, {
		immediate: true
	});

	// 确认选择
	const confirm = () => {
		if (!selectedDate.value) {
			return uni.showToast({
				icon: "none",
				title: '请选择服务日期'
			});
		}
		if (!selectedTimeSlot.value) {
			return uni.showToast({
				icon: "none",
				title: '请选择服务时间'
			});
		}
		emits('confirm', {
			day: selectedDate.value,
			slotTime: selectedTimeSlot.value
		});
	};

	// 取消选择
	const cancel = () => {
		selectedDate.value = '';
		selectedTimeSlot.value = '';
		emits('cancel');
		emits('update:modelValue', false);
	};

	// 关闭弹窗
	const closePopup = () => {
		emits('update:modelValue', false);
	};
</script>

<style lang="scss" scoped>
	.appointment-picker {
		height: 1024rpx;
		padding: 0 10rpx;

		.content {
			display: flex;
			justify-content: space-between;

			.date-list {
				padding: 10rpx;
				height: 760rpx;
				background-color: #F3F3F3;
				width: 328rpx;

				.date-item {
					color: #1C1C1C;
					font-size: 28rpx;
					height: 90rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			.time-slots {
				height: 760rpx;
				padding: 0 20rpx;

				.period-label {
					font-size: 24rpx;
					color: #454545;
					height: 50rpx;
					line-height: 50rpx;
				}

				.time-slot-list {
					.time-slot {
						color: #898989;
						margin-top: 20rpx;
						width: 90%;
						height: 64rpx;
						background: rgba(47, 219, 181, 0.1);
						border-radius: 11rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border: 1px solid #fff;
					}
				}
			}
		}

		.actions {
			padding: 20rpx 0;
			display: flex;
			justify-content: space-around;
		}

		.header {
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 90rpx;
			border-bottom: 1rpx solid #F3F3F3;

			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #1C1C1C;
			}

			.close-button {}
		}

		.active-slot {
			background: rgba(47, 219, 181, 0.1);
			border-radius: 11rpx;
			border: 1px solid #2FDBB5 !important;
			background-color: red;
		}

		.active {
			background-color: #fff;
			color: #333;
		}
	}
</style>