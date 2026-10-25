<template>
	
	<!-- 密码登录的mode -->
	<u-popup @close="emits('update:modelValue',false)" :show="isPasswordLoginVisible&modelValue" round="20">
		<view class="login-popup">
			<view class="login-header">
				<view class="header-item active" @click="toggleMode('login')">密码登录</view>
				<view class="divider"></view>
				<view class="header-item" @click="toggleMode('smslogin')">短信登录</view>
			</view>
			<view class="login-hint">未注册手机号请先点击下方立即注册</view>
			<!-- 密码登录区域 -->
			<view class="login-form">
				<view class="form-item">
					<view class="form-label">账号</view>
					<view class="input-container">
						<input type="text" placeholder="请输入账号" />
					</view>
				</view>
				<view class="form-item">
					<view class="form-label">密码</view>
					<view class="input-container">
						<input type="password" placeholder="请输入密码" />
					</view>
				</view>
				<view class="form-buttons">
					<u-button shape="circle" :customStyle="buttonStyle" color="#333" text="登录"></u-button>
				</view>
				<view class="hint-action" @click="toggleMode('register')">还没账号？前往注册</view>
				<view class="form-footer">
					<y-radio></y-radio>
					<view class="footer-text">我已阅读<text class="policy-link">《用户协议》</text>与<text class="policy-link">《隐私政策》</text></view>
				</view>
			</view>
		</view>
	</u-popup>

	<!-- 短信登录的mode -->
	<u-popup @close="emits('update:modelValue',false)" :show="isSmsLoginVisible&modelValue" round="20">
		<view class="login-popup">
			<view class="login-header">
				<view class="header-item active">短信登录</view>
				<view class="divider"></view>
				<view class="header-item" @click="toggleMode('login')">密码登录</view>
			</view>
			<view class="login-hint">未注册手机号请先点击下方立即注册</view>
			<!-- 短信登录区域 -->
			<view class="login-form">
				<view class="form-item">
					<view class="form-label">账号</view>
					<view class="input-container">
						<input type="text" placeholder="请输入账号" />
					</view>
				</view>
				<view class="form-item">
					<view class="form-label">验证码</view>
					<view class="input-container">
						<input type="password" placeholder="请输入验证码" />
						<y-code></y-code>
					</view>
				</view>
				<view class="form-buttons">
					<u-button shape="circle" :customStyle="buttonStyle" color="#333" text="登录"></u-button>
				</view>
				<view class="hint-action" @click="toggleMode('register')">还没账号？前往注册</view>
				<view class="form-footer">
					<y-radio></y-radio>
					<view class="footer-text">我已阅读<text class="policy-link">《用户协议》</text>与<text class="policy-link">《隐私政策》</text></view>
				</view>
			</view>
		</view>
	</u-popup>

	<!-- 注册 -->
	<u-popup @close="emits('update:modelValue',false)" :show="isRegisterVisible&modelValue" round="20">
		<view class="login-popup">
			<view class="login-header">
				<view class="header-title active">注册</view>
			</view>
			<view class="login-hint">请在下方输入手机号后注册</view>
			<!-- 注册区域 -->
			<view class="login-form">
				<view class="form-item">
					<view class="form-label">手机号</view>
					<view class="input-container">
						<input type="text" placeholder="请输入手机号" />
					</view>
				</view>
				<view class="form-item">
					<view class="form-label">验证码</view>
					<view class="input-container">
						<input type="password" placeholder="请输入验证码" />
						<y-code></y-code>
					</view>
				</view>
				<view class="form-item">
					<view class="form-label">设置密码</view>
					<view class="input-container">
						<input type="password" placeholder="请输入密码" />
					</view>
				</view>
				<view class="form-buttons">
					<u-button shape="circle" :customStyle="buttonStyle" color="#333" text="立即注册"></u-button>
				</view>
				<view class="hint-action" @click="toggleMode('login')">返回登录</view>
				<view class="form-footer">
					<y-radio></y-radio>
					<view class="footer-text">我已阅读<text class="policy-link">《用户协议》</text>与<text class="policy-link">《隐私政策》</text></view>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

type PropsType = {
	modelValue:boolean,
	mode: 'login' | 'smslogin' | 'register'
}

	
const props = withDefaults(defineProps<PropsType>(), {
	modelValue:false,
	mode: 'login'
})
const emits=defineEmits(['update:modelValue'])

// 声明三个弹窗 分别代表 login smlogin register弹窗
const isPasswordLoginVisible = ref(props.mode === 'login');
const isSmsLoginVisible = ref(props.mode === 'smslogin');
const isRegisterVisible = ref(props.mode === 'register');

const toggleMode = (mode: PropsType['mode']) => {
	isPasswordLoginVisible.value = mode === 'login';
	isSmsLoginVisible.value = mode === 'smslogin';
	isRegisterVisible.value = mode === 'register';
}

const buttonStyle = { width: '260rpx', height: '70rpx' };







</script>

<style lang="scss" scoped>
.login-popup {
	min-height: 500rpx;
	padding: 15rpx 20rpx;

	.login-hint {
		padding: 10rpx 0;
		font-size: 28rpx;
	}

	.login-header {
		display: flex;
		flex-direction: row;
		height: 90rpx;
		color: #333;
		align-items: center;

		.active {
			font-weight: bold;
			color: #000 !important;
		}

		.header-title {
			color: #999;
			font-size: 37rpx;
		}

		.header-item {
			min-width: 200rpx;
			color: #999;
			font-size: 37rpx;
		}

		.header-item:first-child {
			position: relative;

			&:before {
				position: absolute;
				width: 1rpx;
				height: 100%;
				border-radius: 10rpx;
				right: 20rpx;
				background-color: #e9e9e9;
				content: "";
			}
		}
	}

	.login-form {
		.form-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 100rpx;

			.form-label {
				flex-shrink: 0;
				font-weight: bold;
				width: 150rpx;
			}

			.input-container {
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex: 1;
			}
		}

		.hint-action {
			padding: 20rpx 0;
			text-align: center;
			font-size: 25rpx;
		}

		.form-footer {
			display: flex;
			align-items: center;
			justify-content: center;

			.footer-text {
				font-size: 24rpx;
				color: #333;
				padding:10rpx 0;
				text {
					text-align: center;
					font-size: 24rpx;
					color: #adc1c0;
				}
			}
		}
		.form-buttons {
			padding: 30rpx 0;
		}
	}
}
</style>
