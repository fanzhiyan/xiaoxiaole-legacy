<template>
	<view class="image">
		<image :style="computedStyle" :src="src" :mode="mode"></image>
	</view>
</template>

<script lang="ts" setup>
	/**
	 * image  
	 * @description image展示图片
	 * @property {mode}		mode  裁剪模式，见uni官网说明 （默认 'aspectFill' ）
	 * @property {height}	title shiba-高度-传入number自动转为rpx string赋值
	 * @property {width }	width  shiba-宽度-传入number自动转为rpx string赋值
	 * @property {src}	    src  shiba-图片地址
	 * @example 该组件后期可搭配骨架屏组件使用
	 */
	import { RpxPipeline } from "../libs/utils"
	// 定义组件的默认属性
	import { computed } from "vue";
	import { Props } from "./index.d"
	const props = withDefaults(defineProps<Props>(), {
		mode: "aspectFit",
		width: "100rpx",
		height: "100rpx",
		src:''
	})


	const computedStyle = computed(() => {
		return {
			width: RpxPipeline(props.width),
			height: RpxPipeline(props.height)
		}
	})
</script>

<style>
</style>