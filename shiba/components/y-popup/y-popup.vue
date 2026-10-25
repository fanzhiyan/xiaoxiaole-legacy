<template>
		<view class="cu-modal" :class="computedClass">
			<view class="cu-dialog" :style="computedStyle">
				<slot name="title">
					<view class="y-title" v-if="isDefaultTitle">
						<view class="title">{{title}}</view>
						<view class="close" @click="close">
							<text class="cuIcon-close "></text>
						</view>
					</view>
				</slot>
				<view class="content-popup">
					<slot> 内容 </slot>
				</view>
				<view class="bottom">
					<slot name='bottom'></slot>
				</view>
			</view>
		</view>
</template>

<script setup>
	// 侧边栏   drawer-modal justify-start 左侧  drawer-modal justify-end 右侧
	// 居中  center
	// 底部弹出 bottom-modal

	import {
		computed
	} from 'vue';



	const props = defineProps({
		modelValue: {
			type: Boolean,
			default: false
		},

		mode: {
			type: String,
			default: ""
		},
		// 标题头
		title:{
			type: String,
			default:'标题'
		},
		// 是否使用默认标题头
		isDefaultTitle:{
			type: Boolean,
			default:true
		},
		// 圆角度数
		round:{
			type: Number,
			default:30
		}
	})
	const emits = defineEmits(['update:modelValue','close'])

	// 弹出模式
	const computedClass = computed(() => {
		let classObj = {
			'show': props.modelValue
		};
		if (props.mode === 'left') {
			classObj['drawer-modal'] = true;
			classObj['justify-start'] = true;
		} else if (props.mode === 'right') {
			classObj['drawer-modal'] = true;
			classObj['justify-end'] = true;
		} else if (props.mode === 'bottom') {
			classObj['bottom-modal'] = true;
		} else if (props.mode === 'center') {
			classObj['center'] = true;
		}
		

		return classObj;
	});
	// 计算样式
	const computedStyle = computed(() => {
		let StyleObj={}
		StyleObj['border-radius'] = props.round+'rpx';
		return StyleObj;
	});
	
	const close=()=>{
		emits('update:modelValue',false)
		emits('close')
	}
</script>

<style lang="scss">
	.cu-dialog {
		min-width: 30%;
		min-height:100rpx;
		width: auto !important;
	}

	.content-popup {
		min-height: 200rpx;
		height: 100%;
		background-color: #f8f8f8;
	}

	.y-title {
		width: 100%;
		min-height: 70rpx;
		position: relative;
		background-color: #fff;

		.close {
			position: absolute;
			top: 50%;
			right: 5%;
			transform: translateY(-50%);
			// width: 30rpx;
			// height:30rpx;
			// background-color: #f8f8f8;
		}

		.title {
			position: absolute;
			font-size: 28rpx;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>