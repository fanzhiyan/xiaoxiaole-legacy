<template>
	<!-- 容器视图，应用自定义样式 -->
	<view class="radio-container" :style="CustomStyle">
		<!-- 单选按钮视图，绑定点击事件和样式 -->
		<view class="radio" @click="UpdateChecked" :style="CustomRadioStyle" :class="classStyle"></view>
	</view>
</template>

<script lang="ts" setup>
	// Vue3 v-model 默认 true false  也可以传入 ：modelValue=boolean 来手动控制 具体看y-pay
	// 导入必要的模块和函数
	import { computed } from 'vue';
	// 定义一个正则表达式，匹配带有'rpx'或'px'的字符串
	const reg = /(\d*\.?\d+)(r?px)/;
	// 定义组件的属性接口
	interface Props {
		modelValue: boolean,
		size?: string,
		DefaultColor?: string,
		ActiveColor?: string,
	}

	// 定义组件的默认属性
	const props = withDefaults(defineProps<Props>(), {
		modelValue: false,
		size: "33rpx",
		DefaultColor: "#333",
		ActiveColor: "var(--l-button-theme-color)",
	})

	// 定义组件的事件
	const emits = defineEmits(['update:modelValue'])

	// 更新选中状态的函数
	const UpdateChecked = () => {
		emits('update:modelValue', !props.modelValue)
	}

	// 提取匹配结果，如果匹配不到则默认加上'rpx'
	const sizeMatch = props.size.match(reg) ? props.size : props.size + 'rpx';

	// 计算选中和非选中的样式类
	const classStyle = computed(() => {
		return { 
			'color-active shiba-radio_active': props.modelValue, 
			'color-default shiba-radio': !props.modelValue 
		}
	})

	// 计算容器的自定义样式
	const CustomStyle = computed(() => {
		return {
			width: sizeMatch,
			height: sizeMatch,
			borderRadius: sizeMatch,
			fontSize: sizeMatch
		}
	})

	// 计算单选按钮的自定义样式
	const CustomRadioStyle = computed(() => {
		return {
			fontSize: sizeMatch
		}
	})
</script>

<style lang="scss" scoped>
	/* 默认颜色样式 */
	.color-default {
		color: v-bind(DefaultColor);
	}
	/* 选中颜色样式 */
	.color-active {
		color: v-bind(ActiveColor);
	}
	/* 容器样式 */
	.radio-container {
		display: flex;
		align-items: center;
		.radio {
			transition: .5s all;
		}
	}
</style>
