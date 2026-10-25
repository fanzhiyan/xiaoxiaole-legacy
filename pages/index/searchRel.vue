<template>
	<view class="search-page">
		<up-navbar title="搜索结果" :autoBack="true" bgColor="#FFFFFF" placeholder></up-navbar>

		<view class="search">
			<view class="conten">
				<image src="/static/icon/search.png" mode=""></image>
				<input type="text" placeholder="输入学校名称进行搜索" v-model="data.keyName" @confirm="tosearchRel"
					placeholder-class="place-class" />
			</view>
		</view>

		<view class="y-message-row" v-for="item in DataList" @click="toRoute(item)">

			<y-message-item :avatar="item.user.avatar" :nickname="item.user.nickname" :time="item.create_time_text"
				:content="item.introduce" :introduce="item.introduce" :tag="item.grass_type_text" :likes="item.likes"
				:grass_id="item.id" :is_like="item.is_like" :comments="item.comments"
				:browses="item.browses"></y-message-item>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		computed
	} from "vue";
	import shiba from "@/shiba";
	import {
		onLoad
	} from "@dcloudio/uni-app";
	const topic_id = computed(() => shiba.$store("app").user_topic_id);
	onLoad((op) => {
		data.keyName = op.name;
	});
	const data = reactive({
		list: [],
		keyName: "",
	});

	const tosearchRel = () => {
		reset();
	};

	const {
		DataList,
		isLoading,
		isComplete,
		reset
	} = shiba.$hook.useGetList(shiba.$api.api.getGrass, {
		params: () => {
			return {
				topic_id: topic_id.value,
				keyword: data.keyName,
			};
		},
	});
	const toRoute = (item) => {
		uni.$u.route(`/pages/management/management-info?id=${item.id}`)
	}
</script>
<style lang="scss" scoped>
	.search {
		padding: 0 30rpx;
		position: relative;
		z-index: 99999;

		.conten {
			display: flex;
			align-items: center;
			gap: 0 8rpx;
			box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(23, 116, 254, 0.1);
			border-radius: 200rpx;
			border: 2rpx solid #1673fe;
			padding: 12rpx 30rpx;

			image {
				width: 40rpx;
				height: 40rpx;
			}

			text {
				font-weight: 500;
				font-size: 28rpx;
				color: #a6ccfe;
			}

			input {
				font-weight: 500;
				font-size: 28rpx;
				color: #333;
			}

			.place-class {
				font-weight: 500;
				font-size: 28rpx;
				color: #a6ccfe;
			}
		}
	}
</style>

<style>
	page {
		background-color: #ffffff;
	}
</style>