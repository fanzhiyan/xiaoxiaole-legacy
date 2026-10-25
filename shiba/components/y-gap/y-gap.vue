<template>
	<!-- 自定义视图组件 -->
	<view class="custom-view" :style="computedStyle">
		<slot>{{text}}</slot>
	</view>
</template>

<script setup>
	import {
		computed
	} from "vue";
	import {
		RpxPipeline
	} from "../libs/utils"
	const props = defineProps({
		// 背景颜色
		bgColor: {
			default: "#f8f8f8",
			type: String
		},
		// 文本内容
		text: {
			default: "",
			type: String
		},
		// 高度
		height: {
			default: "50rpx",
			type: String
		}
	})

	const computedStyle = computed(() => {
		return {
			background: props.bgColor,
			text: props.text,
			height: RpxPipeline(props.height)
		}
	})
</script>

<style lang="scss">

</style>
