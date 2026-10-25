<template>
	<y-layout>
		<!--  <up-navbar title="搜索" bg-color="transparent" autoBack :placeholder="true"></up-navbar> -->
		<view class="search-switch">
			<u-search @search="searchKey" bgColor="#FFFFFF" placeholder-color="#A6CCFE" :modelValue="keywords"
				placeholder="请输入名称搜索学校" :show-action="false"></u-search>
		</view>
		<view class="school-conetent">
			<view class="school-item" v-for="items in state.list">
				<view class="school-img">
					<view class="tag" v-if="items?.auth_status == 2 && isLogin">已认证</view>
					<view class="school-logos">
						<u-image :radius="10" width="100rpx" height="100rpx" :src="$y.oss(items.icon)"
							mode=""></u-image>
					</view>
				</view>
				<view class="school-content">
					<view class="title">{{ items.name }}</view>
					<view class="label">{{ items.user_count }}位圈友已加入</view>
				</view>
				<view class="school-action">
					<u-button text="进入" @click="toTopic(items)" v-if="items.is_join == 1" color="#1673FE"
						:customStyle="{ width: '140rpx', fontWeight: 'bold', height: '60rpx' }"
						shape="circle"></u-button>
					<u-button text="加入" @click="applYJoin(items)" v-if="items.is_join != 1" color="#1673FE"
						:customStyle="{ width: '140rpx', fontWeight: 'bold', height: '60rpx' }"
						shape="circle"></u-button>
				</view>
			</view>
		</view>
		<y-empty icon="search" title="该学校暂未加入" v-if="state.list.length == 0"></y-empty>
		<y-service-qrcode title="联系客服" desc="长按识别联系客服" :imgUrl="$y.oss(sys_image)"
			v-model="state.serviceShow"></y-service-qrcode>
		<y-fixed-bottom bottom="30rpx">
			<u-button shape="circle" color="#468BF3" :customStyle="{ width: '630rpx', height: '88rpx' }" text="申请学校集市"
				@click="$y.ToWeChatFollowByArticle('BJXXLXYJS')"></u-button>
		</y-fixed-bottom>
	</y-layout>
</template>

<script setup>
	import {
		onLoad,
		onReady,
		onReachBottom
	} from "@dcloudio/uni-app";
	import shiba from "@/shiba";
	import {
		reactive,
		ref,
		computed
	} from "vue";
	const isLogin = computed(() => shiba.$store("user").isLogin);
	const sys_image = computed(() => shiba.$store("app").System?.sys_image);
	const list = ref([]);
	let keywords = ref("");
	onLoad((e) => {
		console.log("e: ", e);
		state.keyword = e.keywords;
		keywords.value = e.keywords;
		getList();
	});
	onReachBottom(() => {
		state.page++;
		getList();
	});

	let state = reactive({
		keyword: "",
		page: 1,
		serviceShow: false,
		list: [],
	});

	const getList = async () => {
		const res = await shiba.$api.public.GetGrassTopic({
			page: state.page,
			keyword: state.keyword,
		});
		res.data.data.map((items) => {
			state.list.push(items);
		});
	};
	//
	const searchKey = (key) => {
		state.page = 1;
		state.list = [];
		state.keyword = key;
		getList();
	};

	// 加入圈子
	const applYJoin = async (item) => {
		// 如果未登录 提示登录
		console.log(isLogin.value, 'isLogin.value')
		if (!isLogin.value) {
			shiba.$store("modal").SETKEYDATA("Auth", false);
			shiba.$store("modal").SETKEYDATA("Auth", true);
			return;
		}
		uni.showModal({
			title: "温馨提示",
			content: `是否选择加入${item.name}？`,
			success: (res) => {
				if (res.confirm) {
					shiba.$api.public
						.applyJoin({
							topic_id: item.id,
						})
						.then((rrr) => {
							uni.$store("app").SETKEYDATA("user_topic_id", item.id);
							uni.$emit("changeSwitch");
							uni.switchTab({
								url: "/pages/index/index",
							});
						});
				}
			},
		});
	};

	// 选择圈子
	const setChange = (item) => {
		// 如果未登录 提示登录
		if (!isLogin.value) {
			shiba.$store("modal").SETKEYDATA("Auth", false);
			shiba.$store("modal").SETKEYDATA("Auth", true);
			return;
		}

		if (isLogin.value && item.is_join == 0) {
			uni.showModal({
				title: "温馨提示",
				content: `是否选择加入${item.name}？`,
				success: (res) => {
					if (res.confirm) {
						shiba.$api.public
							.applyJoin({
								topic_id: item.id,
							})
							.then((rrr) => {
								uni.$store("app").SETKEYDATA("user_topic_id", item.id);
								uni.$emit("changeSwitch");
								uni.switchTab({
									url: "/pages/index/index",
								});
							});
					}
				},
			});
			return;
		}
		// 如果登录 并且加圈了
		if (isLogin.value && item?.auth_status == 2) {
			uni.$store("app").SETKEYDATA("user_topic_id", item.id);
			uni.$emit("changeSwitch");
			uni.switchTab({
				url: "/pages/index/index",
			});
			return;
		}
		// 如果登录 未认证 跳转此圈子认证
		if (isLogin.value && item?.auth_status != 2) {
			uni.$u.route({
				url: "/pages/public/real-auth",
				params: {
					topic_id: item.id,
				},
			});
			return;
		}
	};

	// 跳转圈子
	const toTopic = (item) => {
		// 如果未登录 提示登录
		if (!isLogin.value) {
			shiba.$store("modal").SETKEYDATA("Auth", false);
			shiba.$store("modal").SETKEYDATA("Auth", true);
			return;
		}
		uni.$store("app").SETKEYDATA("user_topic_id", item.id);
		uni.$emit("changeSwitch");
		uni.switchTab({
			url: "/pages/index/index",
		});
	};
</script>

<style lang="scss" scoped>
	.school-conetent {
		padding: 20rpx;
	}

	.school-item:last-child {
		border-bottom: none !important;
	}

	.school-item {
		border-radius: 10rpx;
		justify-content: space-between;
		margin: 20rpx auto;
		padding: 10rpx;
		height: 100rpx;
		display: flex;
		align-items: center;

		.school-content {
			padding: 0 10rpx;
			width: 370rpx;
			flex-shrink: 0;

			.title {
				height: 50rpx;
				line-height: 50rpx;
				font-weight: bold;
				font-size: 28rpx;
				color: #333333;
			}

			.label {
				margin: 20rpx 0;
				font-size: 22rpx;
				color: #666666;
			}
		}

		.school-img {
			width: 150rpx;
			height: 140rpx;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;

			.tag {
				position: absolute;
				z-index: 221;
				left: 0rpx;
				top: 0rpx;
				width: 70rpx;
				background-color: #1673fe;
				height: 28rpx;
				border-radius: 5rpx;
				color: #fff;
				font-size: 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.school-logos {
				position: absolute;
				z-index: 9;
			}
		}
	}

	.search-switch {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		margin: 0 auto;
	}
</style>
<style>
	page {
		background: url(../../static/public/new_page_bage.png);
		background-size: 100% 100%;
	}
</style>