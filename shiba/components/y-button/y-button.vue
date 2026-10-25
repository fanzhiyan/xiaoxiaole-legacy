<template>
	<view>
		<button :style="customStyle" :type='type' :plain='plain'>
			<slot>{{text}}</slot>
		</button>
	</view>
</template>

<script setup lang="ts">
	const props = defineProps({
		customStyle: {
			type: Object,
			default: () => { }
		},
		color: {
			type: String,
			default: ''
		},
		text: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: 'default'
		},
		plain:{
			type: Boolean,
			default: false
		}
	})
</script>

<style lang="scss">

</style>