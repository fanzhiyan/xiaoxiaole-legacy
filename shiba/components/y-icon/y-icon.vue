<template>
	<view class="y-icon shiba">
		<y-image v-if="CoustomComputed.mode === 1" :src="CoustomComputed.icon" :width="CoustomComputed.size"
			:height="CoustomComputed.size" mode="aspectFit"></y-image>
		<text v-else :style="{ fontSize: CoustomComputed.size }" :class="[CoustomComputed.icon]"></text>
	</view>
</template>

<script lang="ts" setup>
	import { computed } from "vue";
	import { Props } from "./index";
	import { RpxPipeline, isURL } from "../libs/utils";

	const props = withDefaults(defineProps<Props>(), {
		size: '38rpx',
		icon: ""
	});

	/**
	 * y-empty  
	 * @description empty展示图片
	 * @property {icon} icon shiba-内置图标或者路径如果传入路径 那么解析图片展示
	 * @property {size} size shiba-高度-传入number自动转为rpx string赋值  默认38rpx
	 * @example 该组件后期可搭配骨架屏组件使用
	 */

	const CoustomComputed = computed(() => {
		const size = RpxPipeline(props.size);
		const isIconURL = isURL(props.icon);
		return {
			icon: isIconURL ? props.icon : `shiba-${props.icon}`,
			size,
			mode: isIconURL ? 1 : 2
		};
	});
</script>

<style lang="scss" scoped>
	
</style>