<template>
  <!-- 骨架屏的容器，当 loading 为 true 时显示 -->
  <view class="loading" :style="computedStyle" v-if="loading">
    <!-- 遍历矩形节点数组，生成对应的骨架屏元素 -->
    <view
      v-for="(item, index) in rectNodes"
      :key="index + 'Rect'"
      class="skeleton-fade"
      :style="{
        width: item.width + 'px',
        height: item.height + 'px',
        backgroundColor: elColor,
        position: 'absolute',
        top: item.top + 'px',
        left: item.left + 'px',
      }"></view>
    <!-- 遍历圆形节点数组，生成对应的骨架屏元素 -->
    <view
      v-for="(item, index) in circleNodes"
      :key="index"
      class="skeleton-fade"
      :style="{
        width: item.width + 'px',
        height: item.height + 'px',
        backgroundColor: elColor,
        borderRadius: item.width / 2 + 'px',
        position: 'absolute',
        top: item.top + 'px',
        left: item.left + 'px',
      }"></view>
  </view>
</template>

<script setup lang="ts">
import { watch, onMounted, ref, Ref, nextTick } from "vue";

// 定义组件的属性接口
interface Props {
  loading: boolean;
  bgColor: string;
  elColor: string;
}

// 定义组件的默认属性
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  bgColor: "#fff",
  elColor: "#f7f7f7",
});

// 定义节点类型
interface Node {
  width: number;
  height: number;
  top: number;
  left: number;
}

// 定义响应式变量
let computedStyle: Ref<Record<string, string>> = ref({});
let circleNodes: Ref<Node[]> = ref([]);
let rectNodes: Ref<Node[]> = ref([]);

// 初始化函数，获取系统信息并设置样式
const init = () => {
  const systemInfo = uni.getSystemInfoSync();
  computedStyle.value = {
    width: systemInfo.windowWidth + "px",
    height: systemInfo.windowHeight + "px",
    backgroundColor: props.bgColor,
    zIndex: "90001",
    top: "0",
    left: "0",
  };
};

// 防止重叠的函数
const preventOverlap = (nodes: Node[]): Node[] => {
  const margin = 5; // 边距，单位为rpx
  return nodes.map((node) => ({
    ...node,
    top: node.top + margin,
    left: node.left + margin,
    width: node.width - 2 * margin,
    height: node.height - 2 * margin,
  }));
  // return nodes;
};

// 获取矩形元素的位置和尺寸
const getRectEls = () => {
  let query = uni.createSelectorQuery();
  query
    .selectAll(".skeleton-contaion .skeleton-row")
    .boundingClientRect((res: Node[]) => {
      rectNodes.value = preventOverlap(res);
    })
    .exec();
};

// 获取圆形元素的位置和尺寸
const getCircleEls = () => {
  console.log(111);
  let query = uni.createSelectorQuery();
  query
    .selectAll(".skeleton-contaion .skeleton-circle")
    .boundingClientRect((res: Node[]) => {
      circleNodes.value = preventOverlap(res);
    })
    .exec();
};

watch(
  () => props.loading,
  (flag) => {
    if (flag) {
      console.log(flag, "loading");
      nextTick(() => {
        init();
        getRectEls();
        getCircleEls();
      });
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
}

.skeleton-fade {
  width: 100px; /* 可以根据需要调整宽度 */
  height: 100px; /* 可以根据需要调整高度 */
  background-color: white;
  animation: fadeInOut 2s infinite ease-in-out;
  border-radius: 10px; /* 可以根据需要调整圆角 */
}

@keyframes fadeInOut {
  0%,
  20% {
    background-color: #f1f2f4;
  }
  50% {
    background-color: #e6e6e6;
  }
  100% {
    background-color: #f1f2f4;
  }
}
</style>
