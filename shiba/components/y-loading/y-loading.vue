<template>
	<view v-if="StateOpction.show" class="loading-container">
		<view class="loading">
			<view class="loading-css">
				<view v-if="StateOpction.icon === 'lp'" class="lp">
					<view></view>
					<view></view>
					<view></view>
					<view></view>
					<view></view>
					<view></view>
				</view>
				<view v-else-if="StateOpction.icon === 'fk'" class="fk">
					<view class="spinner-box">
						<view class="configure-border-1">
							<view class="configure-core"></view>
						</view>
						<view class="configure-border-2">
							<view class="configure-core"></view>
						</view>
					</view>
				</view>
				<view v-else-if="StateOpction.icon === 'loader'" class="preloader">
					<view class="loader"></view>
				</view>
			</view>
			<view class="loading-text">{{StateOpction.loadingText}}</view>
		</view>
		<view class="bg-overlay"></view>
	</view>
</template>




<script setup lang="ts">
	/**
	 * y-loading
	 * @description 加载动画
	 * @property {selector} selector shiba-组件id值 use注册使用
	 * @example 该组件后期可搭配骨架屏组件使用
	 */
	import { inject, reactive, ref, watch } from 'vue';
	import { defaultOptions, messageDefaultOptionKey } from "./index";
	import { LoadingOptions, Props } from "./type";

	const props = withDefaults(defineProps<Props>(), {
		selector: ""
	});

	// 根据 selector 获取对应的 message 选项 key
	const popupOpctionKey = props.selector ? `${messageDefaultOptionKey}${props.selector}` : messageDefaultOptionKey;

	// 注入 message 选项
	const messageOption = inject(popupOpctionKey, ref<LoadingOptions>(defaultOptions));
	/**
	 * 定义响应式的 StateOption，用于存储 message 选项的状态
	 */
	let StateOpction = reactive<LoadingOptions>({
		show: false,
		loadingText: "",
		icon: ''
	});

	/**
	 * 初始化 message 选项
	 * @param option - message 选项
	 */
	const initMessage = (option : LoadingOptions) => {
		if (!option) return
		StateOpction.show = option.show;
		StateOpction.icon = option.icon;
		StateOpction.loadingText = option.loadingText;
	};


	watch(() => messageOption, (newValue) => {
		console.log('修改', newValue)
		initMessage(newValue.value)
	}, {
		deep: true,
		immediate: true
	})
</script>

<style lang="scss">
	@import "@/shiba/scss/loading/index.scss";


	.loading-container {
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999991;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.loading {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			width: 100%;
			height: 100%;
			position: fixed;
			z-index: 99999;

			.loading-css {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 350rpx;
			}

			.loading-text {
				color: #fff;
				margin-top: 10px;
			}
		}

		.bg-overlay {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100vh;
			background: rgba(0, 0, 0, 0.3);
			z-index: 19999;
		}
	}
</style>