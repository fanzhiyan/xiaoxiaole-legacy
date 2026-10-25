<template>
	<view class="LastBorder">
		<slot></slot>
	</view>
</template>

<script setup>
	const props = defineProps({
		// 是否清楚最后一个元素的底部边框
		LastBorderNone: {
			type: Boolean,
			default: true
		}
	});
</script>

<style lang="scss" scoped>
	.LastBorder {
	  ::v-deep .y-cell-container:last-child {
	    /* 在这里添加你的样式 */
	    border-bottom:none;
	  }
	}
</style>