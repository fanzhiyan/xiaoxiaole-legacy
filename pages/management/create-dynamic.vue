<template>
	<y-layout>
		<view class="form-content">
			<view class="notice" v-if="noticeShow">
				<view class="notice-card">
					<up-notice-bar bgColor="#fdf1e5" :text="run_message"></up-notice-bar>
					<text class="icon shiba-close" @click="closeNotice"></text>
				</view>
			</view>
			<view class="form-row l-f l-a-center l-j-between">
				<view class="form-lable">主题分类</view>
				<view class="form-value" @click="state.showClassifyModal = true">
					{{ classifyText || "请选择" }}
					<text class="shiba-next"></text>
				</view>
			</view>
			<view class="form-row l-f l-a-center l-j-between textarea-box">
				<up-textarea v-model="state.introduce" auto-height placeholder="输入你想说的想问的想聊的内容吧" count
					maxlength="1000"></up-textarea>
			</view>
			<view class="upload-box">
				<view class="lable">图片</view>
				<view class="upload-list">
					<u-upload :multiple="true" width="140rpx" height="140rpx" max-count="9" :fileList="fileList1"
						@afterRead="afterRead" @delete="deletePic">
						<up-image width="140rpx" height="140rpx" src="/static/icon/upload_bg.png"
							mode="aspectFit"></up-image>
					</u-upload>
				</view>
			</view>
			<!--   <view class="form-row l-f l-a-center l-j-between">
        <view class="form-lable">是否匿名</view>
        <view class="form-value">
          <up-switch v-model="state.is_anonymity" :active-value="'1'" :inactive-value="'0'"></up-switch>
        </view>
      </view> -->
			<view class="form-row l-f l-a-center l-j-between">
				<view class="form-lable">是否置顶</view>
				<view class="form-value">
					<up-switch v-model="state.is_top" :active-value="'1'" :inactive-value="'0'"></up-switch>
				</view>
			</view>
			<view v-if="state.is_top == 1" class="form-row l-f l-a-center l-j-between" @click="handleTopTimeClick">
				<view class="form-lable">置顶时间</view>
				<view class="form-value">{{ topTimeText }}</view>
			</view>
		</view>
		<view class="tips">
			请自觉遵守
			<text class="tips-text" @click="$u.route('/pages/setting/agreement?id=9')">《社区规范》</text>
			，如发布违规，辱骂，人身攻击内容会进行封禁处理
		</view>
		<y-fixed-bottom bottom="20rpx">
			<u-button @click="submitData" shape="circle"
				:customStyle="{ width: '640rpx', height: '88rpx', color: '#fff', fontSize: '32rpx', fontWeight: 'bold' }"
				color="#1673FE"
				:disabled="state.isSubmitting"
				:loading="state.isSubmitting">
				{{
					state.isSubmitting 
						? "发布中..."
						: state.is_top == 1 && state.tempTopTime
						? `支付(￥${state.tempTopInfo.price}元置顶${state.tempTopInfo.title})发布
				`
						: "发布"
				}}
			</u-button>
		</y-fixed-bottom>
		<up-picker @cancel="contactShow = false" :show="contactShow" keyName="name" :columns="contactType"
			@confirm="confirmContact"></up-picker>
		<!-- 主题分裂 -->
		<up-popup :show="state.showClassifyModal" :round="20">
			<view class="theme-popup">
				<view class="title">主题分类</view>
				<view class="theme-content">
					<scroll-view scroll-y="true" class="theme-content-scroll" :show-scrollbar="false">
						<view class="tag-list">
							<view @click="checkTag(item)" :class="{ active: CheckTagComputed.includes(item.id) }"
								class="tag-item" :key="item.id" v-for="item in state.ClassifyList">
								#{{ item.title }}
								<view class="active_check" v-if="CheckTagComputed.includes(item.id)">
									<up-image src="/static/icon/check_sucess.png" mode="aspectFit" width="48rpx"
										height="48rpx"></up-image>
								</view>
							</view>
						</view>
					</scroll-view>
					<view class="theme-content-btn">
						<u-button @tap="MenuAction('cancel')" shape="circle" text="取消" plain
							:customStyle="{ width: '300rpx', height: '88rpx' }" color="#1673FE"></u-button>
						<u-button @tap="MenuAction('confirm')" shape="circle" text="确定"
							:customStyle="{ width: '300rpx', height: '88rpx' }" color="#1673FE"></u-button>
					</view>
				</view>
			</view>
		</up-popup>
		<!-- 置顶时间弹窗 -->
		<up-popup :show="state.showTopTimeModal" :round="20">
			<view class="theme-popup">
				<view class="title">选择置顶时间</view>
				<view class="theme-content">
					<scroll-view scroll-y="true" class="top-time-list-scroll" :show-scrollbar="false">
						<view class="top-time-list">
							<view v-for="item in state.topTimeList" :key="item.id" class="top-time-item"
								:class="{ active: state.tempTopTime === item.id }" @click="selectTopTime(item)">
								<view class="lable">
									{{ item.title }} |
									<text class="l-price price">{{ item.price }}</text>
								</view>
								<up-image v-if="state.tempTopTime === item.id" src="/static/icon/check_sucess.png"
									mode="aspectFit" width="48rpx" height="48rpx"></up-image>
							</view>
						</view>
					</scroll-view>
					<view class="theme-content-btn">
						<u-button @tap="cancelTopTime" shape="circle" text="取消" plain
							:customStyle="{ width: '300rpx', height: '88rpx' }" color="#1673FE"></u-button>
						<u-button @tap="confirmTopTime" shape="circle" text="确定"
							:customStyle="{ width: '300rpx', height: '88rpx' }" color="#1673FE"></u-button>
					</view>
				</view>
			</view>
		</up-popup>
		<view class="logo">
			<up-image width="260rpx" height="260rpx" :src="$y.oss('/uploads/logo.png')" mode=""></up-image>
		</view>
	</y-layout>
</template>

<script setup>
import {
	computed,
	reactive,
	ref
} from "vue";
import shiba from "@/shiba";
import {
	onLoad
} from "@dcloudio/uni-app";
import {
	isEmpty
} from "../../shiba/rules/from";
const run_message = computed(() => shiba.$store("app")?.System?.notice_tip);
	// 统一状态管理
const state = reactive({
	ClassifyList: [],
	label: [],
	cate: "0",
	contact_no: "",
	contact_type: "",
	cycle_id: "",
	image: "",
	introduce: "",
	is_anonymity: "0",
	is_top: "0",
	title: "",
	topic_id: "",
	// 弹窗相关
	showClassifyModal: !false,
	showTopTimeModal: false,
	// 临时选择
	tempLabel: [],
	tempTopTime: null,
	tempTopInfo: {},
	// 置顶时间
	topTime: null,
	topTimeList: [],
	// 按钮状态控制
	isSubmitting: false,
});

// 图片上传相关
const fileList1 = ref([]);
const {
	deletePic,
	afterRead
} = shiba.$hook.useUploadFile(fileList1.value);

// 分类弹窗相关
const CheckTagComputed = computed(() => state.tempLabel.map((item) => item.id));
const classifyText = computed(() => state.label.map((item) => item.title).join("，") || "请选择");
const openTagModal = () => {
	state.showClassifyModal = true;
	state.tempLabel = [...state.label];
};
const checkTag = (item) => {
	// const idx = state.tempLabel.findIndex((i) => i.id == item.id);
	// if (idx !== -1) {
	//   state.tempLabel.splice(idx, 1);
	// } else {
	//   state.tempLabel.push(item);
	// }
	state.tempLabel = [item];
};
const MenuAction = (action) => {
	if (action === "cancel") {
		state.showClassifyModal = false;
	}
	if (action === "confirm") {
		state.label = [...state.tempLabel];
		state.showClassifyModal = false;
	}
};

// 置顶时间相关
const topTimeText = computed(() => {
	const item = state.topTimeList.find((i) => i.id === state.topTime);
	return item ? item.title : "请选择置顶时间";
});
const handleTopTimeClick = () => {
	if (state.is_top === "1") {
		state.showTopTimeModal = true;
		state.tempTopTime = state.topTime;
	} else {
		uni.$y.toast("请先开启置顶");
	}
};
const selectTopTime = (item) => {
	state.tempTopTime = item.id;
	state.tempTopInfo = item;
};
const confirmTopTime = () => {
	state.topTime = state.tempTopTime;
	state.cycle_id = state.tempTopTime;
	state.showTopTimeModal = false;
};
const cancelTopTime = () => {
	state.showTopTimeModal = false;
};

// 数据获取
const GetGrassClassify = async () => {
	const res = await shiba.$api.api.getGrassType();
	state.ClassifyList = res.data;
};
const GetCycleList = async () => {
	const res = await shiba.$api.api.getTopUp();
	state.topTimeList = res.data;
};

// 提交表单
const submitData = async () => {
	// 防止重复提交
	if (state.isSubmitting) return;
	
	if (isEmpty(state.introduce)) return uni.$y.toast("请输入内容");
	
	// 设置提交状态为true，禁用按钮
	state.isSubmitting = true;
	
	try {
		state.image = fileList1.value.map((items) => items.fileUrl).join(",");
		state.topic_id = shiba.$store("app").user_topic_id;
		const params = {
			image: state.image,
			introduce: state.introduce,
			is_anonymity: state.is_anonymity,
			is_top: state.is_top,
			grass_type: state.label.map((item) => item.id).join(","),
			topic_id: state.topic_id,
		};
		if (state.is_top === "1") {
			params.top_up_id = state.topTime;
		}
		const res = await shiba.$api.public.PublishGrass(params);
		
		if (state.is_top == 1) {
			uni.requestPayment({
				provider: "wxpay",
				...res.data.pay_params,
				success: function (res) {
					state.isSubmitting = false; // 支付成功后恢复按钮状态
					uni.$emit('changePageDynamic')
					uni.$u.route({
						url: "/pages/public/result",
						type: "redirect",
						params: {
							title: "发布成功",
							pageTitle: "发布结果",
							showPay: true,
							success: true,
							payType: "微信支付",
							showManagement: false,
							showHome: true,
							showBack: false,
							showMyBtn: true,
						},
					});
				},
				fail: () => {
					state.isSubmitting = false; // 支付失败后恢复按钮状态
					uni.$u.route({
						url: "/pages/public/result",
						type: "redirect",
						params: {
							title: "支付失败",
							pageTitle: "发布结果",
							success: false,
							showPay: true,
							showManagement: false,
							showHome: true,
							showBack: true,
							showMyBtn: false,
							payType: "微信支付",
						},
					});
				},
			});
		} else {
			uni.$emit('changePageDynamic')
			uni.$u.route({
				url: "/pages/public/result",
				type: "redirect",
				params: {
					title: "发布成功",
					pageTitle: "发布结果",
					success: true,
					showPay: false,
					showManagement: false,
					showHome: true,
					showMyBtn: true,
					showBack: false,
				},
			});
		}
	} catch (error) {
		// 出现错误时恢复按钮状态
		state.isSubmitting = false;
	}
};
// 展示
let noticeShow = ref(!false);
const closeNotice = () => {
	noticeShow.value = false;
};

onLoad(() => {
	GetGrassClassify();
	GetCycleList();
});
</script>

<style lang="scss" scoped>
.logo {
	display: flex;
	align-items: center;
	justify-content: center;
}

.form-content {
	padding: 20rpx 0;

	.form-row {
		padding: 0 20rpx;
		min-height: 100rpx;
		border-bottom: 1rpx solid #f8f8f8;

		.form-lable {
			font-size: 28rpx;
			color: #333333;
			font-weight: bold;
		}

		.form-value {
			font-size: 28rpx;
			color: #999999;
		}
	}

	.textarea-box {
		padding: 20rpx;
		background-color: #fff;

		:deep(.u-textarea) {
			width: 100%;
			// height: 260rpx;
			padding: 15rpx 10rpx;
			background: #f7f8fc;
		}
	}

	.upload-box {
		padding: 20rpx;

		.lable {
			height: 70rpx;
			font-weight: bold;
			color: #333333;
			font-size: 28rpx;
		}
	}

	.notice {
		border-bottom: 1rpx solid #f8f8f8;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 132rpx;
		background: #ffffff;
		border-radius: 0rpx 0rpx 0rpx 0rpx;

		.notice-card {
			width: 690rpx;
			height: 72rpx;
			background: #fdf1e5;
			border-radius: 8rpx 8rpx 8rpx 8rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 24rpx;
			color: #ffaa00;
			padding: 0 10rpx;

			:deep(.u-notice__left-icon) {
				display: none;
			}

			.icon {
				font-size: 45rpx;
				font-weight: 500;
			}
		}
	}
}

.tips {
	padding: 10rpx;
	color: #999999;
	font-size: 24rpx;

	.tips-text {
		font-weight: bold;
		color: #000;
		font-size: 24rpx;
		color: #1673fe;
	}
}

.theme-popup {
	.title {
		color: #333333;
		line-height: 100rpx;
		text-align: center;
		height: 100rpx;
		font-size: 32rpx;
		font-weight: bold;
	}

	.theme-content {
		height: 550rpx;

		.theme-content-scroll {
			height: 400rpx;
			width: 700rpx;
			margin: 0 auto;

			.tag-list {
				display: flex;
				align-items: flex-start;
				flex-direction: row;
				// height: 400rpx;
				width: 700rpx;
				flex-wrap: wrap;
				justify-content: space-between;

				.tag-item {
					margin: 20rpx 0;
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 10rpx;
					flex-shrink: 0;
					width: 330rpx;
					height: 84rpx;
					background: #f7f8fc;
					color: #999999;
					border-radius: 20rpx 20rpx 20rpx 20rpx;
				}

				.active {
					color: #1673fe;
					border: 2rpx solid #1673fe;
				}
			}
		}

		.theme-content-btn {
			display: flex;
			justify-content: space-between;
			height: 100rpx;
			margin-top: 20rpx;
		}
	}
}

.top-time-list-scroll {
	height: 400rpx;
	width: 680rpx;
	margin: 0 auto;
}

.top-time-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	width: 100%;
}

.top-time-item {
	height: 80rpx;
	padding: 0 30rpx;
	border-radius: 20rpx;
	background: #f7f8fc;
	color: #999;
	font-size: 32rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border: 2rpx solid #f7f8fc;
	font-size: 32rpx;

	.lable {
		width: 70%;
	}

	.price {
		font-size: 29rpx;
		font-weight: bold;
	}

	&.active {
		color: #1673fe;
		border: 2rpx solid #1673fe;
		background: #fff;
	}

	// &.disabled {
	//   color: #ccc;
	//   background: #f0f0f0;
	//   pointer-events: none;
	// }
}
</style>
<style>
page {
	background-color: #fff !important;
}
</style>