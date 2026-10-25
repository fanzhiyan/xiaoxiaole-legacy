<template>
	<y-layout>
		<view class="card-cell l-f l-f-row l-a-center l-j-between l-pl-sm l-pr-sm">
			<view class="left-cell l-f  l-a-center">
				<view class="label l-pl-sm l-text-bold-lg">
					标签
				</view>

			</view>
			<view class="center-cell tag-contaion l-f l-j-between">
				<scroll-view scroll-x="true" class="tag-row">
					<view class="tag-coustom">
						<view class="tag-coustom-item l-f-center" @longpress="DeleteTag(item)" @click="selectTag(item)"
							:class="{'active':item.id==state.model.label_id}" v-for="(item) in tagList">
							{{item.label}}
						</view>
					</view>
				</scroll-view>
				<view class="add l-f-center color-gray" @click="AddTag">
					<text class='shiba-increase'></text>
				</view>
			</view>
			<view class="next">
				<text class="shiba-next"></text>
			</view>
		</view>
		<view class="card-cell l-f l-f-row l-a-center l-j-between l-pl-sm l-pr-sm">
			<view class="left-cell l-f  l-a-center">
				<view class="label l-pl-sm l-text-bold-lg">
					收货人
				</view>
			</view>
			<view class="center-cell">
				<u-input v-model="state.model.consignee" placeholder="请输入收货人姓名"></u-input>
			</view>
			<view class="next">
				<text class="shiba-next"></text>
			</view>
		</view>

		<view class="card-cell l-f l-f-row l-a-center l-j-between l-pl-sm l-pr-sm">
			<view class="left-cell l-f  l-a-center">
				<view class="label l-pl-sm l-text-bold-lg">
					手机号
				</view>
			</view>
			<view class="center-cell">
				<u-input v-model="state.model.mobile" placeholder="请输入手机号"></u-input>
			</view>
			<view class="next">
				<text class="shiba-next"></text>
			</view>
		</view>
		<view class="card-cell l-f l-f-row l-a-center l-j-between l-pl-sm l-pr-sm" @click="open">
			<view class="left-cell l-f  l-a-center">
				<view class="label l-pl-sm l-text-bold-lg">
					省市区
				</view>
			</view>
			<view class="center-cell l-fs-sm input_color">
				<!-- {{state.model.region?state.model.region:"请选择省市区信息"}} -->
				<u-input :disabled="true" disabledColor='#fff' :modelValue="state.model.region"
					placeholder="请选择省市区信息"></u-input>
			</view>
			<view class="next">
				<text class="shiba-next"></text>
			</view>
		</view>
		<view class="card-cell l-f l-f-row l-a-center l-j-between l-pl-sm l-pr-sm">
			<view class="left-cell l-f  l-a-center">
				<view class="label l-pl-sm l-text-bold-lg">
					详细地址
				</view>
			</view>
			<view class="center-cell">
				<u-input v-model='state.model.address' placeholder="请输入详细地址"></u-input>
			</view>
			<view class="next">
				<text class="shiba-address l-fs-xxl"></text>
			</view>
		</view>
		<up-gap bg-color="#F9F9F9" height="20rpx"></up-gap>
		<view class="card-cell l-f l-f-row l-a-center l-j-between l-pl-sm l-pr-sm">
			<view class=" l-f  l-a-center">
				<view class="label l-pl-sm l-text-bold-lg">
					设为默认地址
				</view>
			</view>
			<up-switch v-model="state.model.is_default"></up-switch>
		</view>
		<y-picker-area @confirm="AreaConfirm" v-model="state.showRegion"></y-picker-area>
		<y-fixed-bottom bottom='20rpx'>
			<u-button @click="saveAddress" text='保存地址' :custom-style="{'width':'702rpx'}"
				color="var(--l-color-theme)"></u-button>
			<u-button v-if="id" @click="DeleteAddress" text='删除地址'
				:custom-style="{'margin-top':'30rpx','width':'702rpx'}"></u-button>
		</y-fixed-bottom>
	</y-layout>
</template>

<script setup lang="ts">
	import { ref, watch, reactive } from "vue"
	import { onLoad } from "@dcloudio/uni-app"
	import shiba from "@/shiba"
	const { tagList,
		AddTag,
		GetTagList,
		CreateAddress,
		DeleteAddress,
		UpdateEdit,
		GetInfo,
		DeleteTag,
		state } = shiba.$hook.useAddress()
	let label = ref('')

	let id = ref(null)
	onLoad((opction) => {
		if (opction?.id) {
			id.value = opction.id
			GetInfo(id.value)
		}
		GetTagList()
	})

	// 选择地址
	const AreaConfirm = async (data) => {
		state.model.province_name = data.province_name
		state.model.province_id = data.province_id
		state.model.city_id = data.city_id
		state.model.city_name = data.city_name
		state.model.district_name = data.district_name
		state.model.district_id = data.district_id
		state.model.region = data.region
	}

	// 打开弹窗
	const open = () => {
		console.log(1111111)
		state.showRegion = true
	}
	// 选择
	const selectTag = async (item) => {
		state.model.label = item.label
		state.model.label_id = item.id
	}

	const saveAddress = () => {
		if (id.value) {
			UpdateEdit(id.value)
		} else {
			CreateAddress()
		}
	}
</script>

<style lang="scss" scoped>
	.card-cell {
		height: 114rpx;
		background-color: #fff;
	}

	.tag-contaion {
		.tag-row {
			width: calc(100% - 90rpx);
			flex-shrink: 0;

			.tag-coustom {
				display: flex;
				align-items: center;

				.tag-coustom-item {
					flex-shrink: 0;
					font-size: 24rpx;
					margin-right: 10rpx;
					padding: 0 20rpx;
					height: 50rpx;
					border: 2rpx solid #C1CAD4;
					background: #fff;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
				}
			}




		}

		.active {
			background: #FFF2EB !important;
			color: #FF7B31 !important;
			border: solid 1rpx #ff9f50 !important;
		}

		.add {
			border: 2rpx solid #C1CAD4;
			border-radius: 8rpx 8rpx 8rpx 8rpx;
			border: solid 2rpx #C1CAD4;
			flex-shrink: 0;
			height: 50rpx;
			padding: 5rpx !important;
			border-radius: 10rpx;
			width: 80rpx !important;
		}
	}

	.input_color {}
</style>