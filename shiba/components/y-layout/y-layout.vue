<template>
  <view>
    <slot name="navbar" v-if="!coustom">
      <up-navbar :title="NavbarTitle" :placeholder="true" auto-back></up-navbar>
    </slot>
    <slot />
    <!-- 弹窗 置顶 -->
    <y-message-box></y-message-box>
    <!-- <y-skelAeton :loading="loading"></y-skeleton> -->
    <!-- 兼容IOS底部导航栏 防止遮住 -->
    <y-auth mode="mode"></y-auth>
    <view class="bottomNavBarios" :style="{ height: bottomNavBarHeight }" v-if="bottomNavBarHeight > 0"></view>
    <y-create-post></y-create-post>
    <y-tabbar v-if="isTabbarPage" @centerClick="centerClickPost"></y-tabbar>
    <y-popup-notice></y-popup-notice>
  </view>
</template>

<script lang="ts" setup>
// 兼容ios 底部手势导航栏
import { ref, nextTick, watch, getCurrentInstance, onMounted, computed } from "vue";
import shiba from "@/shiba";
import { Props } from "./index";
// #ifdef MP||H5
import page from "@/pages.json";
// #endif
const topic_id = computed(() => shiba.$store("app").user_topic_id);
const useAuth = shiba.$hook.useAuth();

// 判断是否是 tabbar 页面
const isTabbarPage = computed(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const route = currentPage.route;
  // #ifdef MP-WEIXIN
  // 微信小程序
  return page.tabBar?.list?.some((item) => item.pagePath === route);
  // #endif
  // #ifndef MP
  return page.tabBar?.list?.some((item) => item.pagePath === route);
  // #endif
});

// 监听store是否需要弹出登录框
// const isAuth = computed({
// 	get: () => shiba.$store('modal').Auth,
// 	set: (value) => shiba.$store('modal').SETKEYDATA('Auth', value)
// });
const isAuth = computed(() => shiba.$store("modal").Auth);

watch(
  () => isAuth.value,
  (newValue) => {
    if (newValue) {
      useAuth
        .alert({
          mode: "login",
        })
        .then((ress) => {
          // console.log(ress, "onConfirm");
          // // 登录逻辑
          // uni.login({
          //   success: async (res) => {
          //     console.log(res, "datadatadatadata");
          //     const da = await shiba.$api.wechat.wxLogin({
          //       code: res.code,
          //       mobile: ress.value.code,
          //     });
          //     uni.$store("modal").SETKEYDATA("Auth", false);
          //     uni.$store("user").SETKEYDATA("isLogin", true);
          //     uni.$store("user").SETKEYDATA("token", da.data.userinfo.token);
          //   },
          //   fail: (err) => {
          //     console.log(err, "da");
          //   },
          // });
        })
        .catch((err) => {
          shiba.$store("modal").SETKEYDATA("Auth", false);
          // shiba.$store('modal').SETKEYDATA('Auth',false)
        });
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

// 小程序使用 消耗性能 尽量不使用
// #ifdef MP-WEIXIN

function generateRouteTable(config) {
  const routeTable = {};

  // Helper function to process pages array
  function processPages(pagesArray) {
    pagesArray.forEach((page) => {
      let fullPath = page.path;
      if (page.style && page.style.navigationBarTitleText) {
        routeTable[fullPath] = page.style.navigationBarTitleText;
      }
    });
  }

  // Process main pages
  processPages(config.pages);

  // Process subPackages
  if (config.subPackages) {
    config.subPackages.forEach((subPackage) => {
      // Prepend the root path to each page's path within the subPackage
      processPages(
        subPackage.pages.map((page) => ({
          ...page,
          path: `${subPackage.root}/${page.path}`,
        }))
      );
    });
  }

  return routeTable;
}
let routeWx = generateRouteTable(page);
// #endif

const props = withDefaults(defineProps<Props>(), {
  title: "",
  coustom: false,
  loading: false,
  data: {},
});

// 获取当前组件实例
const instance = getCurrentInstance();
// 定义响应式变量
let platform = ref("");
let bottomNavBarHeight = ref(0);
// 组件挂载时的生命周期钩子
onMounted(() => {
  // 获取系统信息
  const res = uni.getSystemInfoSync();
  // 设置底部导航栏高度
  bottomNavBarHeight.value = res.safeAreaInsets.bottom ? res.safeAreaInsets.bottom + "px" : 5;
  // 根据平台类型进行不同的初始化操作
  if (res.platform === "ios" || res.platform === "devtools") {
    platform.value = "ios";
  } else if (res.platform === "android") {
    platform.value = "android";
  }
  getPage();
});

// 获取配置项
let NavbarTitle = ref("");
const getPage = () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1]; // 获取当前页面实例
  // #ifdef MP-WEIXIN
  NavbarTitle.value = routeWx[currentPage.route];
  // #endif
  // #ifndef MP
  NavbarTitle.value = currentPage.$page.meta.navigationBar.titleText; // 获取当前页面的配置
  // #endif
  console.log(NavbarTitle.value, "NavbarTitleNavbarTitleNavbarTitle");
};

// 点击发布弹出
const createPostRef = shiba.$hook.useCreatePost();
const centerClickPost = () => {
  createPostRef.show({
    needAuth: true,
    needJoin: true,
    topicId: topic_id.value,
  });
};
</script>
