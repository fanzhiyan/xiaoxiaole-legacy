<template>
	<!-- 金刚区：滚动列表展示区域 -->
	<view class="scroll-list">
		<up-scroll-list :indicatorActiveColor='indicatorActiveColor'>
			<!-- 使用v-for循环渲染每个页面的项目 -->
			<block v-for="page in state.list" :key="page">
				<view class="scroll-row">
					<!-- 单个项目 -->
					<view 
						class="scroll-item" 
						v-for="(item, index) in page" 
						:key="index"
						:style="{ width: `calc(100% / ${colNum})` }"
					>
						<!-- 图标 -->
						<view class="icon">
							<u-image 
								:width="customStyle.width" 
								:height="customStyle.height" 
								:src="item.url" 
								mode="aspectFit"
							></u-image>
						</view>
						<!-- 标签 -->
						<view class="label l-pt-sm l-pb-sm">{{ item.name }}</view>
					</view>
				</view>
			</block>
		</up-scroll-list>
	</view>
</template>

<script lang="ts" setup>
import { reactive, watch, computed } from 'vue';
import { deepClone } from "@/shiba/libs/index";

// 组件属性接口定义
interface Props {
	list: any[];
	heightNum: number;
	pageNum: number;
	imgSize: string | number;
	indicatorActiveColor: string 
}

// 设置默认属性值
const props = withDefaults(defineProps<Props>(), {
	list: () => [],
	heightNum: 2,
	pageNum: 10,
	imgSize: '50rpx',
	indicatorActiveColor:'var(--l-color-theme)'
});

// 解析图片尺寸，确保格式正确
const sizeMatch = props.imgSize.toString().match(/(\d*\.?\d+)(r?px)/)
	? props.imgSize
	: `${props.imgSize}rpx`;

// 反应式状态对象
const state = reactive({
	list: [] as any[][]
});

// 动态计算列数
const colNum = computed(() => Math.floor(props.pageNum / props.heightNum));

// 计算图片的自定义样式
const customStyle = computed(() => ({
	width: sizeMatch,
	height: sizeMatch
}));

// 将一维数组转换为二维数组（分页）
const convertTo2DArray = (data: any[]) => {
	if (Array.isArray(data)) {
		state.list = deepClone(splitArrayIntoChunks(data, props.pageNum));
	}
};

// 将数组分割成指定大小的块
const splitArrayIntoChunks = (array: any[], chunkSize: number): any[][] => {
	let result: any[][] = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		result.push(array.slice(i, i + chunkSize));
	}
	return result;
};

// 当props.list改变时，更新state.list
watch(() => props.list, (newValue) => {
	convertTo2DArray(newValue);
}, { immediate: true, deep: true });

</script>

<style lang="scss" scoped>
/* 滚动行 */
.scroll-row {
	width: 100%;
	flex-shrink: 0;
	display: flex;
	align-items: flex-start;
	flex-wrap: wrap;
	/* 滚动项 */
	.scroll-item {
		
		flex-shrink: 0;
		flex-direction: column;
		display: flex;
		align-items: center;
		justify-content: center;
		/* 图标 */
		.icon {
			flex-shrink: 0;
		}
		/* 标签 */
		.label {
			
			color: #333333;
			font-size: 24rpx;
		}
	}
}
</style>