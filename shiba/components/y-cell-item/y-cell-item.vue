<template>
	<view class="y-cell-container" @click="targetPage">
		<view class="label">
			<view class="label-icon">
				<u-image :width="iconSize" :height="iconSize" :src="icon" mode="aspectFit"></u-image>
			</view>
			<view class="label-text">{{ title }}</view>
		</view>
		<view class="value">
			<view class="content">
				<slot name='value'>{{value}}</slot>
			</view>
			<view class="arrow-right" >
				<u-icon name="arrow-right" color="rgba(69, 69, 69, 1)"></u-icon>
			</view>
		</view>
	</view>
</template>
<script setup>
	const props = defineProps({
		// label text内容
		title: {
			type: String,
			default: ''
		},
		// content内容
		value: {
			type: String,
			default: ''
		},
		// 跳转的页面地址
		link: {
			type: String,
			default: ''
		},
		// 图标地址
		icon: {
			type: String,
			default: '/static/service.png'
		},
		// 图标大小
		iconSize: {
			type: String,
			default: '50rpx'
		},
		// 参数
		params: {
			type: String||Object,
			default: '50rpx'
		}
	});
	
	
	const targetPage=()=>{
		uni.navigateTo({
			url:props.link
		})
	}
</script>
<style lang="scss" scoped>
	.y-cell-container {
		height: 90rpx;
		border-bottom: 1rpx solid rgba(244, 244, 244, 1);
		display: flex;
		align-items: center;
		justify-content: space-between;

		.label {
			width: 40%;
			display: flex;
			align-items: center;

			.label-icon {
				width: 70rpx;
				height: 50rpx;
			}

			.label-text {
				font-weight: 500;
				font-size: 28rpx;
				color: #1c1c1c;
			}
		}

		.value {
			width: 60%;
			display: flex;
			align-items: center;
			justify-content: flex-end;

			.arrow-right {
				margin-left: 10rpx;
			}
		}
	}
</style>