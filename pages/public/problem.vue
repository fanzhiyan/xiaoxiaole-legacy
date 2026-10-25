<template>
	<y-layout>
		<view class="problem-list">
			<y-empty v-if="proBlemList.length==0" title='暂无常见问题'></y-empty>
			<view class="problem-item" v-for="item in proBlemList" @click="$u.route(`/pages/public/problem-info?id=${item.id}`)">
				<view class="problem-title">
					{{item.title}}
				</view>
				<view class="problem-hint">
					<u-parse :content="item.content"> </u-parse>
				</view>
			</view>
			
		</view>
	</y-layout>
</template>

<script lang="ts" setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad
	} from "@dcloudio/uni-app";
import shiba from '@/shiba';
	let list = ref([

	])

	onLoad((opction) => {
		getList()
	})

	let proBlemList = ref([])
	const getList = async () => {
		const res = await shiba.$api.api.GetCommonIndex()
		proBlemList.value = res.data
	}
</script>

<style lang="scss" scoped>
	.problem-list {
		width: 710rpx;

		margin: 10rpx auto;

		.problem-item {
			padding: 10rpx 20rpx;
			box-sizing: content-box;
			border-radius: 10rpx;
			margin: 20rpx 0;
			min-height: 99rpx;
			background-color: #fff;

			.problem-title {
				font-size: 30rpx;
				color: #1C1C1C;
				font-weight: bold;
				height: 40rpx;
				line-height: 40rpx;
			}

			.problem-hint {}
		}
	}
</style>
<style>
	page {
		background-color: #f8f8f8;
	}
</style>