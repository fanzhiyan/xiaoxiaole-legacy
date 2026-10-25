<template>
  <view>
    <y-layout :coustom="true" class="skeleton-contaion">
      <y-status-navbar>
        <view class="header-box">
          <view class="header-icon" @click="toMessage">
            <view class="tag-item" v-if="bulletinCount > 0">{{ bulletinCount > 99 ? "99+" : bulletinCount }}</view>
            <up-image width="40rpx" height="40rpx" src="/static/icon/new_icon_index.png" mode="aspectFit"></up-image>
          </view>
          <view class="header-scholl" @click="changeSwitch">
            {{ state.GrassInfo.name }}
            <text class="shiba-next"></text>
          </view>
        </view>
      </y-status-navbar>
      <view class="search">
        <view class="conten" @tap="toPage_1">
          <image src="/static/icon/search.png" mode=""></image>
          <text>输入关键词进行搜索</text>
        </view>
      </view>
      <view class="swiper-box">
        <up-swiper
          @click="routeSwiper"
          indicator
          indicatorMode="line"
          circular
          width="690rpx"
          radius="5"
          bgColor="transparent"
          :list="swiper"
          keyName="image_url"
          height="280rpx"></up-swiper>
      </view>
      <view class="top-notice-card">
        <y-notices :list="state.DayHots" keyName="introduce"></y-notices>
        <!-- <view class="top-notice" v-if="state.DayHots.length > 0">
          <view class="notice-center">
            <up-notice-bar :text="state.DayHots" direction="column" icon color="#333333" bgColor="transparent"></up-notice-bar>
            <view class="all" @tap="$u.route('/pages/index/dayHot')">
              查看热榜
              <text class="shiba-next"></text>
            </view>
          </view>
        </view> -->
        <view class="top-scroll" :class="{ 'top-border': state?.DayHots?.length != 0 }">
          <view class="top-scroll-item" @click="routeClass(item)" v-for="item in state.ClassifyList">
            <view class="top-scroll-icon">
              <up-image width="72rpx" height="72rpx" :src="$y.oss(item.image)" mode="aspectFit"></up-image>
            </view>
            <view class="top-scroll-text">{{ item.title }}</view>
          </view>
        </view>
      </view>

      <!-- card index -->
      <view class="card-content">
        <view class="card-tabs">
          <u-tabs
            lineHeight="12rpx"
            :lineColor="`url(../../static/icon/vector_bg.png) 100% 100%`"
            :list="tabs"
            @change="changeTab"
            :activeStyle="{ color: '#1673FE', fontSize: '36rpx', fontWeight: 'bold' }"
            keyName="title"></u-tabs>
        </view>

        <y-empty icon="data" v-if="!isLoading && isComplete && DataList.length == 0" title="暂无内容"></y-empty>
        <view class="" @click="$u.route(`/pages/management/management-info?id=${item.id}`)" v-for="item in DataList">
          <y-message-item
            :is_official="item.type"
            :avatar="item.user.avatar"
            :nickname="item.user.nickname"
            :time="item.create_time"
            :content="item.introduce"
            :introduce="item.introduce"
            :tag="item.grass_type_text"
            :likes="item.likes"
            :grass_id="item.id"
            :is_like="item.is_like"
            :is_top="item.is_top"
            :comments="item.comments"
            :browses="item.browses"
            :auth_status="item.user?.auth_status || -1"
            :imgs="item.images_url"></y-message-item>
        </view>
      </view>
    </y-layout>
  </view>
</template>
<script setup>
import { computed, nextTick, reactive, ref, watch, onUnmounted } from "vue";
import shiba from "@/shiba";
import { onLoad, onPageScroll, onReady, onShow, onReachBottom, onPullDownRefresh, onShareAppMessage } from "@dcloudio/uni-app";

const topic_id = computed(() => shiba.$store("app").user_topic_id);
const SystemStore = computed(() => shiba.$store("app").System);

onShow(() => {
  GetHotNotice();
  GetClassify();
  getGrassInfo();
  GetGrassClassify();
  // 初始化应用数据存储
  shiba.$store("app").init();
  getBanner();
});
onLoad(()=>{
	console.log(shiba.$api.api.getGrass,'shiba.$api.api.getGrass')
	uni.$on('changePageDynamic',(eee)=>{
		reset();
	})
})
// 获取首页轮播图
let swiper = ref([]);
const getBanner = async () => {
  const res = await shiba.$api.api.GetSwiper({
    topic_id: topic_id.value,
    type: "index",
  });

  swiper.value = res.data.map((items) => {
    return {
      ...items,
      image_url: uni.$y.oss(items.image),
    };
  });
};

let tabs = ref([]);
let modal = reactive({
  tabs: [],
  GrassList: [],
});
let state = reactive({
  ClassifyList: [],
  GrassInfo: {},
  DayHots: [],
});
// 获取分类
const GetClassify = async () => {
  const res = await shiba.$api.api.GetClassify({ topic_id: topic_id.value });
  state.ClassifyList = res.data;
};
// 获取分类
const GetGrassClassify = async () => {
  const res = await shiba.$api.api.getGrassType();
  tabs.value = [
    {
      id: "",
      title: "全部",
      status: 1,
    },
    ...res.data,
  ];
};
// 获取首页详情
const getGrassInfo = async () => {
  const res = await shiba.$api.public.getGrassIndex({
    id: topic_id.value,
  });
  state.GrassInfo = res.data;
  shareParams();
};
const toPage_1 = () => {
  console.log("1111111111111");
  uni.navigateTo({
    url: "/pages/index/indexsearch",
  });
};
// 获取列表内容
let GrassState = reactive({
  topic_id: "",
  keyword: "",

  grass_type: "",
});

const { DataList, isLoading, isComplete, reset } = shiba.$hook.useGetList(shiba.$api.api.getGrass, {
  manual: true,
  params: () => {
    return {
      topic_id: topic_id.value,
      keyword: GrassState.keyword,
      grass_type: GrassState.grass_type,
    };
  },
});

const changeTab = (item) => {
  console.log("item: ", item);
  GrassState.grass_type = item.id;
  GrassState.page = 1;
  reset();
};

// 获取榜单
const GetHotNotice = async () => {
  state.DayHots = [];
  const res = await shiba.$api.public.GetDayHot({
    topic_id: topic_id.value,
  });

  res.data.forEach((item) => {
    state.DayHots.push(item);
  });
};

// 写一个函数 用于生成微信小程序 分享
let shareState = reactive({
  title: "",
  imageUrl: "",
  path: "",
});
const routeClass = (item) => {
  uni.$u.route({
    url: "/pages/promotion/promotion",
    params: {
      id: item.id,
      type: "classifyDetail",
    },
  });
};
const routeSwiper = (ee) => {
  let id = swiper.value[ee]?.id;
  uni.$u.route({
    url: "/pages/promotion/promotion",
    params: {
      id: id,
      type: "swiper",
    },
  });
};

const shareParams = () => {
  console.log("生成");
  shareState.title = state.GrassInfo.content;
  // 此处是分享页面
  shareState.path = `/pages/index/index?pic_id=${topic_id.value}&type=share`;
};
// #ifdef MP-WEIXIN
uni.showShareMenu({
  menus: ["shareAppMessage", "shareTimeline"],
});
onShareAppMessage(() => {
  return {
    type: 0,
    title: shareState.title,
    path: shareState.path,
  };
});
// #endif
let bulletinCount = ref(0);
const getInfo = async () => {
  const res = await shiba.$api.api.init();
  bulletinCount.value = res.data.bulletinCount;
};
const toMessage = () => {
  uni.switchTab({
    url: "/pages/message/message",
  });
};
let ids = 1;
// 切换地址
const changeSwitch = () => {
  uni.$once("changeSwitch", () => {
    reset();
  });
  uni.$u.route("/pages/public/switch");
};

onLoad((opction) => {
  reset();
});


</script>
<style lang="scss" scoped>
.header-box {
  width: 56rpx;
  height: 56rpx;
  height: 176rpx;
  display: flex;
  align-items: center;
  padding: 0 10rpx;
  width: 500rpx;

  .header-icon {
    width: 80rpx;
    height: 56rpx;
    border: 1rpx solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 20rpx 20rpx 20rpx 20rpx;
    position: relative;

    .tag-item {
      position: absolute;
      content: "";
      width: 30rpx;
      height: 30rpx;
      background-color: red;
      z-index: 9229;
      right: 0%;
      top: -10rpx;
      border-radius: 30rpx;
      font-size: 19rpx;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .header-scholl {
    padding: 0 18rpx;
    margin: 0 10rpx;
    border: 1rpx solid #fff;
    // width: 194rpx;
    height: 56rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20rpx 20rpx 20rpx 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
  }
}

.search {
  padding: 0 30rpx;
  position: relative;
  z-index: 99999;

  .conten {
    display: flex;
    align-items: center;
    gap: 0 8rpx;
    border-radius: 200rpx;
    border: 1rpx solid #1673fe;
    padding: 12rpx 30rpx;

    image {
      width: 40rpx;
      height: 40rpx;
    }

    text {
      font-weight: 500;
      font-size: 28rpx;
      color: #a6ccfe;
    }
  }
}

// 热门
.top-notice-card {
  width: 700rpx;
  margin: 0rpx auto;
  padding: 15rpx 0;

  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  border: solid #fff;

  .top-notice {
    height: 92rpx;
    background: url(../../static/icon/new_hot-top.png);
    background-size: 100% 100%;
    margin: 20rpx auto;
    display: flex;
    align-items: center;
    padding-left: 80rpx;
    padding-right: 20rpx;
    margin-top: -20rpx;

    .notice-center {
      width: 100%;
      display: flex;
      margin-top: 20rpx;
      align-items: center;
    }

    .all {
      color: #e4350c;
      font-size: 22rpx;
      line-height: 92rpx;
    }
  }
  .top-border {
    border-top: 1rpx solid #f8f8f8;
  }

  .top-scroll {
    padding: 10rpx 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .top-scroll-item {
      width: 138rpx;
      height: 110rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .top-scroll-icon {
      }

      .top-scroll-text {
        margin: 10rpx 0;
        color: #666666;
        font-size: 22rpx;
      }
    }
  }
}

.card-content {
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  overflow: hidden;
  margin: 20rpx 0;

  .card-tabs {
    height: 90rpx;
    background-color: #fff;
  }
}

.swiper-box {
  width: 700rpx;
  margin: 20rpx auto;
}
</style>
<style>
page {
  background: url(../../static/public/new_page_bage.png);
  background-size: 100% 100%;
}
</style>
