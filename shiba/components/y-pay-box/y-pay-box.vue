<template>
	<up-popup :closeable="true" :closeOnClickOverlay="false" class="pay-popup" :show="StateOpction.show" mode='bottom'
		:round='20'>
		<view class="pay-popup-content">
			<view class="title">
				{{StateOpction.title}}
			</view>
			<y-pay v-model="StateOpction.value" :list='StateOpction.list'></y-pay>
			<view class="pay-buttons">
				<u-button text='确定支付' @tap="toggleModal('confirm')" shape="circle"
					color="var(--l-color-theme)"></u-button>
				<u-button text='放弃支付' @tap="toggleModal('cancel')" plain shape="circle"
					color="var(--l-color-theme)"></u-button>
			</view>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	// usePay().confirm() 返回值应该是 type 也就是支付选择的方式
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
		ModalAction, ShowMethodOptions
	} from "./type.d";

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
		// 已选中的支付方式
		value: "",
		title: "请选择支付方式",
		cancelText: '取消',
		show: false,
		list: [],
		onCancel: () => { },
		onConfirm: () => { }
	});


	/**
	 * 初始化 message 选项
	 * @param option - message 选项
	 */
	const initMessage = (option : ShowMethodOptions) => {
		if (!option) return
		StateOpction.show = option.show;
		StateOpction.list = option.list;
		StateOpction.onCancel = option.onCancel;
		StateOpction.onConfirm = option.onConfirm;
		StateOpction.title = option?.title || defaultOptions.title;
		StateOpction.cancelText = option?.cancelText || defaultOptions.cancelText;
	};

	// 元素选择
	function toggleModal(action : ModalAction) {
		const payload = {
			action,
			value: StateOpction.value
		}
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
	const handleConfirm = (result : ModalPayload) => {

		StateOpction.show = false;
		if (isFunction(StateOpction.onConfirm)) {
			StateOpction.onConfirm(result);
		}
	};

	/**
	 * 处理取消操作
	 * @param result - 取消结果
	 */
	const handleCancel = (result : ModalPayload) => {
		StateOpction.show = false;
		if (isFunction(StateOpction.onCancel)) {
			StateOpction.onCancel(result);
		}
	};


	watch(() => messageOption.value as ShowMethodOptions, (newValue) => {
		initMessage(newValue)
	}, {
		deep: true,
		immediate: true
	})
</script>

<style lang="scss" scoped>
	.pay-popup-content {
		padding: 20rpx 30rpx;

		:deep(.pay-title) {
			display: none;
		}

		.title {
			color: #333;
			height: 80rpx;
			text-align: center;
			font-weight: bold;
		}

		.pay-buttons {
			display: flex;
			gap: 20rpx;
			padding: 20rpx 0;
		}
	}
</style>