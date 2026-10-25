<template>
	<!-- 主视图容器，包含验证码发送按钮 -->
	<view class="y-code">
		<!-- 显示发送验证码的文本，根据 sendFlag 的值显示不同的文本 -->
		<view class="text-code">{{sendFlag ? sendTxt : "发送验证码"}}</view>
	</view>
</template>

<script setup>
	/*
		使用例子
		<y-code ref="CodeRef"></y-code>
		let CodeRef=ref(null)
		const SmsSend = async () => {
			console.log(uni.$api, '--')
			if (!uni.$u.test.mobile(form.mobile)) return uni.$utils.toast('请输入正确手机号')
			const res = await uni.$api.api.SmSSend({
				mobile: form.mobile,
				event: 'mobilelogin '
			})
			CodeRef.value.start()
		}
	*/
	// 从 Vue 中导入 ref 函数
	import { ref } from "vue";
	const emits =defineEmits(['DownCode'])
	// 定义组件的 props
	const props = defineProps({
		// 发送按钮的文本
		sendText: {
			type: String,
			default: "发送验证码"
		},
		// 倒计时期间显示的文本模板
		finterText: {
			type: String,
			default: "&s"
		},
		// 倒计时时间（秒）
		downTime: {
			type: Number,
			default: 60
		},
		// 发送失败时的提示文本
		errText: {
			type: String,
			default: "验证码已发送"
		},
	})

	// 定义响应式变量
	let sendFlag = ref(false) // 标识是否正在发送验证码
	let code = ref(0) // 倒计时的当前值
	let sendTxt = ref('发送验证码') // 显示的发送按钮文本

	// 开始发送验证码的函数
	const start = () => {
		// 如果已经在发送验证码，显示错误提示并返回
		if (sendFlag.value) return uni.showToast({
			icon: "none",
			title: props.errText
		});
		
		// 设置发送标识为 true
		sendFlag.value = true
		// 初始化倒计时
		code.value = props.downTime
		
		// 开始倒计时
		var timer = setInterval(function() {
			code.value--; // 每秒减少倒计时
			if (code.value <= 0) {
				// 倒计时结束
				code.value = 0
				sendFlag.value = false // 重置发送标识
				clearInterval(timer); // 清除定时器
				// 恢复发送按钮文本
				sendTxt.value = props.sendText
				// 触发倒计时结束事件
				emits('DownCode')
			} else {
				// 更新发送按钮文本
				sendTxt.value = props.finterText.replace('&', code.value)
				sendFlag.value = true
			}
		}, 1000); // 每秒执行一次
	}

	// 公开 sendFlag 和 start 函数
	defineExpose({
		sendFlag,
		start
	})
</script>

<style lang="scss" scoped>
	/* 样式定义 */
	.y-code {
		text-align: center; /* 文本居中 */
		min-width: 170rpx; /* 最小宽度 */
		font-size: 25rpx; /* 字体大小 */
		height: 100%; /* 高度 */
		color: #01B365; /* 字体颜色 */
		font-weight: bold; /* 字体加粗 */
	}
</style>