<template>
  <view class="empty-content">
    <y-image :width="coustomStyle.width" :height="coustomStyle.height" mode="aspectFit" :src="coustomStyle.src"></y-image>
    <view class="tip">
      {{ coustomStyle.title }}
    </view>
  </view>
</template>
<script lang="ts" setup>
/**
 * y-empty
 * @description empty展示图片
 * @property {icon}		icon   shiba-内置缺省  具体查看 当前组件枚举类型 如果传入路径 那么解析图片展示
 * @property {height}	height  shiba-高度-传入number自动转为rpx string赋值
 * @property {width }	width  shiba-宽度-传入number自动转为rpx string赋值
 * @property {tip}	    title    shiba-提示文案
 * @example 该组件后期可搭配骨架屏组件使用
 */
// 定义组件的默认属性
import { computed, ComputedRef } from "vue";
import { PartialProps, iconModeSrc, iconMode } from "./index.d";
import { isEnumKey, RpxPipeline } from "../libs/utils";

// 定义props的类型
const props = withDefaults(defineProps<PartialProps>(), {
  icon: "data",
  title: "",
  width: "300rpx",
  height: "200rpx",
});

// 定义计算属性的返回类型
interface CustomStyle {
  src: string;
  title: string;
  width: string;
  height: string;
}

// 根据传入的 icon 是mode 还是url 进行判断默认的 tip 如果有自定义
const coustomStyle: ComputedRef<CustomStyle> = computed(() => {
  let obj: CustomStyle = {
    src: "",
    title: "",
    width: RpxPipeline(props.width),
    height: RpxPipeline(props.height),
  };

  // 如果是枚举中定义过的类型
  if (isEnumKey(iconMode, props.icon)) {
    obj.src = iconModeSrc[props.icon];
    obj.title = props.title ?? iconMode[props.icon];
  }
  // 如果是自定义icon 那么传入的就是url 不需要处理
  else {
    obj.src = props.icon;
  }
  return obj;
});
</script>

<style lang="scss" scoped>
.empty-content {
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  min-height: 400rpx;

  .tip {
    padding: 20rpx 0;
    font-size: 27rpx;
    color: #333;
  }
}
</style>
