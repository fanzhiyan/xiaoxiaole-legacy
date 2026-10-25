<template>
	<y-layout>
		<y-empty icon='address' v-if="state.list.length==0"></y-empty>
		<view class="address-list">
			<view class="address-item l-p-sm" v-for="item in state.list">
				<view class="address-content" @click="edit(item.id)">
					<view class="address-header  l-f l-a-center ">
						<view class="address-tag l-pr-sm l-pl-sm l-text-cut">{{item.label}}</view>
						<view class="address-name l-fs-lg l-pl-xs l-pr-xs l-text-bold">{{item.consignee}}</view>
						<view class="address-phone l-fs-df">{{item.mobile}}</view>
					</view>
					<view class="address-info l-text-cuts l-fs-sm l-text-cuts">
						{{item.address}}
					</view>
				</view>
				<view class="address-action l-f l-j-between l-a-center">
					<view class="l-f l-a-center l-fs-df" @click="SetDefault(item,()=>getList())">
						<y-radio :modelValue="item.is_default" size='45rpx'></y-radio> 默认地址
					</view>
					<view class="action-buttons l-f">
						<view class="l-fs-df l-mr-lg" @click="edit(item.id)">
							<text class="l-fs-df shiba-edit"></text>
							编辑
						</view>
						<view class="l-fs-df" @click="DeleteAddress(item.id,false,(res)=>Delete(item.id))">
							<text class="l-fs-df shiba-delete"></text>
							删除
						</view>
					</view>
				</view>
			</view>
		</view>
		<y-fixed-bottom bottom='20rpx'>
			<u-button @click="create" text='新增收货地址' :customStyle="{'width':'650rpx'}" color="var(--l-color-theme)" ></u-button>
		</y-fixed-bottom>
	</y-layout>
</template>

<script setup>
	import {
		reactive
	} from "vue";
	import shiba from "@/shiba"
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"
	onLoad(()=>{
		
	})
	onShow(() => {
		getList()
	})
	const {DeleteAddress,SetDefault} = shiba.$hook.useAddress()
	let state = reactive({
		list: []
	})
	// 获取列表
	const getList = async () => {
		const res = await shiba.$api.api.GetAddressList()
		state.list = res.data
	}
	// 前往创建地址
	const create = () => {
		uni.$u.route('/pages/my/add-address')
	}
	// 删除地址
	const Delete=(id)=>{
		let index=state.list.findIndex(items=>items.id==id)
		if(index!=-1){
			state.list.splice(index,1)
		}
	}
	// 编辑地址
	const edit = (id) => {
		uni.$u.route({
			url: '/pages/my/add-address',
			params: {
				id
			}
		})
	}
</script>

<style lang="scss" scoped>
	.address-list {
		width: 702rpx;
		margin: 20rpx auto;

		.address-item {
			margin-bottom: 20rpx;
			height: 240rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(0, 0, 0, 0.06);
			border-radius: 24rpx 24rpx 24rpx 24rpx;

			.address-content {
				height: 120rpx;
				border-bottom: 1rpx solid #f9f9f9;
				border-radius: 8rpx 8rpx 8rpx 8rpx;

				.address-header {
					.address-tag {
						color: #FF7B31;
						font-size: 24rpx;
						height: 40rpx;
						line-height: 40rpx;
						background: #FFF2EB;
						border-radius: 8rpx 8rpx 8rpx 8rpx;
					}
				}

				.address-info {
					word-break: break-word;
					padding: 10rpx 0;
				}
			}

			.address-action {
				height: 92rpx;
			}
		}

		.default {
			border: 2rpx solid #4BBE43;
		}
	}
</style>