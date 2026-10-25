<template>
		
	<view class="">
		<u-popup   :round="20" :show="modelValue">
			<view class="" style="height: 500rpx;">
				<view class="l-f l-j-between title">
					<view class="cancel" @click="emits('update:modelValue',false)" :style="[{'color':cancelColor}]">{{cancelText}}</view>
					<view class="center">{{title}}</view>
					<view class="confirm" @click="onConfirm" :style="[{'color':confirmColor}]">{{confirmText}}</view>
				</view>
				<picker-view :value="state.currentIndex" @change="change" class="ui-picker-view" @pickstart="pickstart"
					@pickend="pickend">
					<picker-view-column>
						<view class="ui-column-item" v-for="province in areaData" :key="province.id">
							<view :style="getSizeByNameLength(province.name)">{{ province.name }}</view>
						</view>
					</picker-view-column>
					<picker-view-column>
						<view class="ui-column-item" v-for="city in cityList" :key="city.id">
							<view :style="getSizeByNameLength(city.name)">{{ city.name }}</view>
						</view>
					</picker-view-column>
					<picker-view-column>
						<view class="ui-column-item" v-for="district in districtList" :key="district.id">
							<view :style="getSizeByNameLength(district.name)">{{ district.name }}</view>
						</view>
					</picker-view-column>
				</picker-view>
			</view>
		</u-popup>
	</view>
</template>

<script lang="ts" setup>
	import {
		computed,
		reactive
	} from 'vue';
	import {Props,AreaCheck} from "./index"
	const props = withDefaults(defineProps<Props>(), {
		modelValue: false,
		cancelColor:'var(--l-color-gray)',
		confirmColor:'var(--l-color-theme)',
		cancelText:"取消",
		confirmText:"确认",
		title:"选择省市区"
	});
	const emits = defineEmits(['confirm', 'cancel', 'change','update:modelValue']);
	
	const areaData = computed(() => uni.$store('app').AreaData)

	const getSizeByNameLength = (name) => {
		let length = name.length;
		if (length <= 7) return '';
		if (length < 9) {
			return 'font-size:28rpx';
		} else {
			return 'font-size: 24rpx';
		}
	};
	const state = reactive({
		currentIndex: [0, 0, 0],
		moving: false, // 列是否还在滑动中，微信小程序如果在滑动中就点确定，结果可能不准确
	});
	

	

	const cityList = computed(() => {
		return areaData.value[state.currentIndex[0]].children;
	});
	const districtList = computed(() => {
		return cityList.value[state.currentIndex[1]]?.children;
	});
	// 标识滑动开始，只有微信小程序才有这样的事件
	const pickstart = () => {
		// #ifdef MP-WEIXIN
		state.moving = true;
		// #endif
	};

	// 标识滑动结束
	const pickend = () => {
		// #ifdef MP-WEIXIN
		state.moving = false;
		// #endif
	};
	

	const onCancel = () => {
		emits('cancel');
	};

	// 用户更改picker的列选项
	const change = (e) => {
		if (
			state.currentIndex[0] === e.detail.value[0] &&
			state.currentIndex[1] === e.detail.value[1]
		) {
			// 不更改省市区列表
			state.currentIndex[2] = e.detail.value[2];
			return;
		} else {
			// 更改省市区列表
			if (state.currentIndex[0] !== e.detail.value[0]) {
				e.detail.value[1] = 0;
			}
			e.detail.value[2] = 0;
			state.currentIndex = e.detail.value;
		}
		emits('change', state.currentIndex);
	};

	// 用户点击确定按钮
	const onConfirm = (event = null) => {
		
		// #ifdef MP-WEIXIN
		if (state.moving) return;
		// #endif
		let index = state.currentIndex;
		let province = areaData.value[index[0]];
		let city = cityList.value[index[1]];
		let district = districtList.value[index[2]];
		let result = {
			province_name: province.name,
			province_id: province.id,
			city_name: city.name,
			city_id: city.id,
			district_name: district.name,
			district_id: district.id,
			region:`${province.name}-${district.name}-${city.name}`
		} 
		
		emits('update:modelValue', false);
		emits('confirm', result);
	};
</script>

<style>
</style>

<style lang="scss" scoped>
		
	.title{
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.cancel{
			width: 100rpx;
			text-align: center;
		}
		.center{
			
		}
		.confirm{
			width: 100rpx;
			text-align: center;
		}
	}
	.ui-region-picker {
		position: relative;
		z-index: 999;
	}

	.ui-picker-view {
		height: 100%;
		box-sizing: border-box;
	}

	.ui-picker-header {
		width: 100%;
		height: 90rpx;
		padding: 0 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		font-size: 30rpx;
		background: #fff;
		position: relative;
	}

	.ui-picker-header::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}

	.ui-picker__title {
		color: #333;
	}

	.ui-picker-body {
		width: 100%;
		height: 500rpx;
		overflow: hidden;
		background-color: #fff;
	}

	.ui-column-item {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		color: #333;
		padding: 0 8rpx;
	}

	.ui-btn-picker {
		padding: 16rpx;
		box-sizing: border-box;
		text-align: center;
		text-decoration: none;
	}

	.ui-opacity {
		opacity: 0.5;
	}

	.ui-btn-picker--primary {
		color: blue;
	}

	.ui-btn-picker--tips {
		color: red;
	}
</style>