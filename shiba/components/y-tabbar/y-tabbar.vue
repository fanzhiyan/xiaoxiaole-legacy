<template>
  <view>
    <view class="" :style="{ height: PalHeight }"></view>
    <up-popup :show="true" :round="20" z-index="99909" :overlay="false">
      <view class="y-tabbar">
        <block v-for="(item, idx) in tabbarList">
          <y-tabbar-item v-if="idx !== 2" :key="item.pagePath" style="flex: 1" @changeTabbarItem="changeTabbar" :item="item" :activeUrl="curRoute" />
          <!-- 固定第三个为插槽 -->
          <view v-else class="issue" @click="onCenterClick">
            <view class="icon">
              <up-image :src="item.iconPath" mode="aspectFit" width="70rpx" height="70rpx"></up-image>
            </view>
            <view class="issue-text">
              {{ item.text }}
            </view>
          </view>
        </block>
      </view>
    </up-popup>
  </view>
</template>

<script setup>
// 导入必要的模块和函数
import pageJson from "@/pages.json";
import { reactive, ref, onMounted, nextTick, getCurrentInstance } from "vue";

const emits = defineEmits(["centerClick"]);
// 初始化标志位
let initFlag = ref(false);
// 获取当前页面路由
let routes = getCurrentPages();
const instance = getCurrentInstance();
let curRoute = routes[routes.length - 1]?.route || "";

// 定义组件属性
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

// 组件挂载后执行初始化函数
onMounted(() => {
  init();
});

// 读取pageJson配置项
let tabbarList = ref([]);
const init = () => {
  tabbarList.value = pageJson.tabBar.list;
};

// 切换Tabbar项
const changeTabbar = (e) => {
  uni.switchTab({
    url: `/${e.pagePath}`,
  });
};

// 平台类型和底部导航栏高度
let platform = ref("ios");
let bottomNavBarHeight = ref("ios");

// 组件挂载后获取系统信息并初始化
onMounted(() => {
  const res = uni.getSystemInfoSync();
  bottomNavBarHeight.value = res.safeAreaInsets.bottom;

  if (res.platform === "ios" || res.platform === "devtools") {
    platform.value = "ios";
    nextTick(() => {
      initPal(res.platform, bottomNavBarHeight.value);
    });
  } else if (res.platform === "android") {
    platform.value = "android";
    nextTick(() => {
      initPal(res.platform, 0);
    });
  }

  // 隐藏默认的TabBar
  uni.hideTabBar();
});

// Pal高度
let PalHeight = ref("0px");

// 初始化Pal高度
const initPal = (type, BarHeight) => {
  console.log(type, "---");
  uni
    .createSelectorQuery()
    .in(instance)
    .select(".y-tabbar")
    .boundingClientRect((data) => {
      PalHeight.value = `${data.height + 10 + BarHeight}px`;
      initFlag.value = true;
    })
    .exec();
};

// 抛出center点击事件
const onCenterClick = () => {
  emits("centerClick");
};
</script>

<style lang="scss">
.showModal {
  bottom: 0 !important;
}

.y-tab-container {
  transition: all 0.5s;
  box-sizing: content-box;
  height: 110rpx;
  position: fixed;
  bottom: -110rpx;
  width: 100%;
  display: flex;
  background-color: #fff;
  border-radius: 33rpx 33rpx 0rpx 0rpx;
}

.pal {
  height: v-bind(PalHeight);
}

.y-tabbar {
  display: flex;
  align-items: center;
  min-height: 118rpx;
  border-radius: 30rpx 30rpx 0 0;
  /* #ifdef MP-WEIXIN */
  padding-bottom: 30rpx;
  /* #endif */
  box-shadow: 0rpx 5rpx 20rpx 0rpx #e8eaef;
}
.issue {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
  .icon {
    margin-top: -40rpx;
    margin-bottom: 20rpx;
  }
  .issue-text {
    font-size: 20rpx;
    color: #1673fe;
    font-weight: 600;
  }
}
</style>
