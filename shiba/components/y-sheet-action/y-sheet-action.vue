<template>
	<view class="">
		<up-popup :show="StateOpction.show" mode='bottom' :round="20">
			<view class="sheect-popup">
				<!-- 如果传入较多时候 要考虑屏幕可视区域  所以此处固定 -->
				<scroll-view scroll-y="true" style="height: 600rpx;overflow: hidden;"
					v-if="messageOption.list.length>6">
					<view class="sheect-list">
						<view class="sheect-item" @click="toggleModal('confirm',item)"
							v-for="item in messageOption.list">
							{{item.name}}
						</view>
					</view>
				</scroll-view>
				<view class="sheect-list" v-else>
					<view class="sheect-item" @click="toggleModal('confirm',item)" v-for="item in messageOption.list">
						{{item.name}}
					</view>
				</view>
				<y-gap height='10rpx'></y-gap>
				<view class="cancel" @click="toggleModal('cancel',{})">
					取消
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script lang="ts" setup>
	import {
		inject,
		reactive,
		ref,
		watch
	} from 'vue';
	import {
		defaultOptions,
		messageDefaultOptionKey
	} from "./index";
	import {
		ModalPayload,
		DefaultOptions,
		ModalAction,ShowMethodOptions
	} from "./index.d";
	
	import {
		isFunction
	} from "../libs/utils";
	// 获取组件的 props
	const props = defineProps({
		selector: {
			type: String
		}
	});

	// 根据 selector 获取对应的 message 选项 key
	const popupOpctionKey = props.selector ? `${messageDefaultOptionKey}${props.selector}` : messageDefaultOptionKey;

	// 注入 message 选项
	const messageOption = inject(popupOpctionKey, ref(defaultOptions))
	/**
	 * 定义响应式的 StateOption，用于存储 message 选项的状态
	 */
	let StateOpction = reactive<ShowMethodOptions>({
		cancelText: '取消',
		show: false,
		list: [],
		onCancel:()=>{},
		onConfirm:()=>{}
	});


	/**
	 * 初始化 message 选项
	 * @param option - message 选项
	 */
	const initMessage = (option:ShowMethodOptions) => {
		if (!option) return
		StateOpction.show = option.show;
		StateOpction.list = option.list;
		StateOpction.cancelText = option.cancelText;
		StateOpction.onCancel = option.onCancel;
		StateOpction.onConfirm = option.onConfirm;
	};

	// 元素选择
	function toggleModal(action:ModalAction, data:any) {
		const payload = {
			action,
			value:data
		}
		console.log(payload,'toggleModaltoggleModaltoggleModaltoggleModaltoggleModal')
		switch (action) {
			case 'confirm':
				handleConfirm(payload);
				break;
			case 'cancel':
				handleCancel(payload);
				break;
		}
	}

	/**
	 * 处理确认操作
	 * @param result - 确认结果
	 */
	const handleConfirm = (result:ModalPayload) => {
		StateOpction.show = false;
		if (isFunction(onConfirm)) {
			StateOpction.onConfirm(result);
		}
	};

	/**
	 * 处理取消操作
	 * @param result - 取消结果
	 */
	const handleCancel = (result:ModalPayload) => {
		StateOpction.show = false;
		if (isFunction(StateOpction.onCancel)) {
			StateOpction.onCancel(result);
		}
	};



	// 定义确认和取消的回调函数
	let onConfirm = (result:ModalPayload) => {};
	let onCancel = (result:ModalPayload) => {};

	watch(() => messageOption.value as ShowMethodOptions, (newValue) => {
		initMessage(newValue)
	}, {
		deep: true,
		immediate: true
	})
</script>

<style lang="scss" scoped>
	.sheect-popup {
		.sheect-list {
			.sheect-item {

				font-size: 32rpx;
				height: 100rpx;
				font-weight: 600;
				border-radius: 0rpx 0rpx 0rpx 0rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-bottom: 1rpx solid #f8f8f8;
			}
		}

		.cancel {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			height: 96rpx;
			font-weight: 600;
			background: #FFFFFF;
			border-radius: 0rpx 0rpx 0rpx 0rpx;
		}
	}
</style>