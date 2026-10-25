<template>
  <y-layout coustom bg-color="transparent">
    <up-navbar bg-color="transparent" title="选择学校" :placeholder="true" :auto-back="true"></up-navbar>
    <view class="search-switch">
      <u-search
        @search="(e) => $u.route(`/pages/public/search-topic?keywords=${e}`)"
        icon-position="left"
        bgColor="#FFFFFF"
        placeholder-color="#A6CCFE"
        searchIconColor="#A6CCFE"
        placeholder="请输入名称搜索学校"
        :show-action="false"></u-search>
    </view>
	
    <up-cate-tab class="cate-tab" v-if="cateTabHeight" :height="cateTabHeight" :tabList="tabList" tabKeyName="title" itemKeyName="title">
      <template #itemList="{ item }">
        <view class="" v-if="item.children.length == 0">
          <y-empty :title="item.title + '暂无匹配学校'"></y-empty>
        </view>
        <view class="school-item" :key="items.id" v-else v-for="items in item.children" @click="setChange(items)">
			
          <view class="school-img">
            <view class="school-logos">
              <view class="tag" v-if="items?.grassTopicUser?.auth_status == 2 && isLogin">已认证</view>
              <view class="logo_images">
                <u-image :radius="5" width="100rpx" height="100rpx" :src="$y.oss(items.icon)" mode=""></u-image>
              </view>
            </view>
          </view>
          <view class="school-content">
            <view class="title">{{ items.name }}</view>
            <view class="label">{{ items.user_count }}位校友已加入</view>
          </view>
        </view>
      </template>
    </up-cate-tab>
  </y-layout>
</template>

<script setup>
import { onLoad, onReady } from "@dcloudio/uni-app";
import shiba from "@/shiba";
import { computed, reactive, ref, watch } from "vue";
const isLogin = computed(() => shiba.$store("user").isLogin);
watch(
  () => isLogin.value,
  (newValue) => {
    if (newValue) {
      getGrassClassify();
    }
  }
);
// 监听登录状态 监听登录后刷新页面
onLoad(() => {
  getGrassClassify();
});

// 获取列表

let state = reactive({
  limit: "",
  keyword: "",
});

// 获取
const getGrassClassify = async () => {
  tabList.value = [];
  const res = await shiba.$api.public.getGrassClassify(state);
  // const ress = await shiba.$api.public.getGrassTopic(state)
  res.data.map((item) => {
    tabList.value.push({
      title: item.name,
      id: item.id,
      children: item.children,
    });
  });
};

// 选择圈子
const setChange = (item) => {
  uni.$store("app").SETKEYDATA("user_topic_id", item.id);
  uni.$emit("changeSwitch");
  uni.switchTab({
    url: "/pages/index/index",
  });
  return;
  // 如果未登录 提示登录
  if (!isLogin.value) {
    shiba.$store("modal").SETKEYDATA("Auth", false);
    shiba.$store("modal").SETKEYDATA("Auth", true);
    return;
  }

  if (isLogin.value && item.is_join == 0) {
    uni.showModal({
      title: "温馨提示",
      content: `是否选择加入${item.name}？`,
      success: (res) => {
        if (res.confirm) {
          shiba.$api.public
            .applyJoin({
              topic_id: item.id,
            })
            .then((rrr) => {
              uni.$store("app").SETKEYDATA("user_topic_id", item.id);
              uni.$emit("changeSwitch");
              uni.switchTab({
                url: "/pages/index/index",
              });
            });
        }
      },
    });
    return;
  }

  // 如果登录 并且加圈了
  if (isLogin.value && item?.grassTopicUser?.auth_status == 2) {
    uni.$store("app").SETKEYDATA("user_topic_id", item.id);
    uni.$emit("changeSwitch");
    uni.switchTab({
      url: "/pages/index/index",
    });
    return;
  }
  // 如果登录 未认证 跳转此圈子认证
  if (isLogin.value && item?.grassTopicUser?.auth_status != 2) {
    uni.$u.route({
      url: "/pages/public/real-auth",
      params: {
        topic_id: item.id,
      },
    });
    return;
  }

  // 如果未登录 提示登录

  // else if (item.is_join == 0) {

  // } else {
  //   uni.$store("app").SETKEYDATA("user_topic_id", item.id);
  //   uni.switchTab({
  //     url: "/pages/index/index",
  //   });
  // }
};

const tabList = ref([]);

// const tabList = ref([{
// 	title: '河南',
// 	children: [{
// 		title: '中国政法大学',
// 		cover: '/static/public/de.png',
// 		joined: 2.9,
// 		percentage: 16.56
// 	}]
// }, {
// 	title: '河北',
// 	children: [{
// 			title: '上海大学',
// 			cover: '/static/public/de.png',
// 			joined: 2.9,
// 			percentage: 25.07
// 		}, {
// 			title: '上海大学',
// 			cover: '/static/public/de.png',
// 			joined: 2.9,
// 			percentage: 25.07
// 		}, {
// 			title: '上海大学',
// 			cover: '/static/public/de.png',
// 			joined: 2.9,
// 			percentage: 25.07
// 		}

// 	]
// }, {
// 	title: '北京',
// 	children: [{
// 		title: '天津工业大学',
// 		cover: '/static/public/de.png',
// 		joined: 2.9,
// 		percentage: null
// 	}]
// }, {
// 	title: '上海',
// 	children: [{
// 		title: '河南大学',
// 		cover: '/static/public/de.png',
// 		joined: 2.9,
// 		percentage: null
// 	}]
// }, {
// 	title: '广东',
// 	children: [{
// 		title: '郑州大学',
// 		cover: '/static/public/de.png',
// 		joined: 2.9,
// 		percentage: 68.47
// 	}]
// }]);
onReady(() => {
  getHeight();
});

// 获取高度
let cateTabHeight = ref("100%");
const getHeight = () => {
  const systemInfo = uni.getSystemInfoSync();
  const statusBarHeight = systemInfo.statusBarHeight; // 状态栏高度
  const navBarHeight = 44; // 假设导航栏固定高度为44px，可以调整或动态获取
  const screenHeight = systemInfo.screenHeight; // 屏幕高度
  // cateTabHeight.value = `calc(${screenHeight}px - ${statusBarHeight + navBarHeight - 100}px)`;
  cateTabHeight.value = screenHeight - (statusBarHeight + navBarHeight) - 80;
};
</script>

<style lang="scss" scoped>
.school-item:last-child {
  border-bottom: none !important;
}

.school-item {
  height: 140rpx;
  border-bottom: 1rpx solid #eeeeee;
  display: flex;
  align-items: center;

  .school-content {
    padding: 0 10rpx;
    width: calc(100% - 150rpx);
    border-bottom: 1rpx solid #eee;

    .title {
      height: 50rpx;
      line-height: 50rpx;
      font-weight: bold;
      font-size: 28rpx;
      color: #333333;
    }

    .label {
      margin: 20rpx 0;
      font-size: 22rpx;
      color: #666666;
    }
  }

  .school-img {
    width: 150rpx;
    height: 140rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .school-logos {
      z-index: 9;
      position: relative;
      .tag {
        position: absolute;
        z-index: 221;
        left: 0rpx;
        top: 0rpx;
        width: 70rpx;
        background-color: #1673fe;
        height: 28rpx;
        border-radius: 5rpx;
        color: #fff;
        font-size: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .logo_images {
        width: 100rpx;
        height: 100rpx;
      }
    }
  }
}

.search-switch {
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 690rpx;
  margin: 0 auto;
}

:deep(.u-cate-tab__item-active) {
  &::before {
    border-radius: 5rpx !important;
    background-color: rgba(22, 115, 254, 1) !important;
  }
}

:deep(.u-cate-tab__right-box) {
  background-color: #fff;
}
:deep(.u-cate-tab__page-item) {
  margin-bottom: 0;
  padding: 0;
}
</style>
<style>
page {
  background: url(../../static/public/new_page_bage.png);
  background-size: 100% 100%;
}
</style>
