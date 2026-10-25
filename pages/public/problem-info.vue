<template>
	<u-navbar :title='title' autoBack :placeholder='true'></u-navbar>
	<u-gap bgColor="#f9f9f9"></u-gap>
	<view class="l-p">
		<u-parse :content="content"></u-parse>
	</view>
</template>

<script lang="ts" setup>
	import {onLoad} from "@dcloudio/uni-app"
import { ref } from "vue";
import shiba from "@/shiba";
	let problemId=null
	onLoad((opction)=>{
		problemId=opction?.id
		getInfo()
	})
	
	let content=ref('')
	let title=ref('问题详情')
	const getInfo=async()=>{
		const res = await shiba.$api.api.GetCommonDetail({
			id:problemId
		})
		content.value=res.data.content
		title.value=res.data.title
	}
</script>

<style lang="scss">

</style>
<style>
	page{
		background-color: #fff;
	}
</style>