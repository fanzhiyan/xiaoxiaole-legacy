<template>
  <y-layout :coustom="true" class="skeleton-contaion">
    <y-status-navbar>
      <view class="search-box" @click="$u.route('/pages/errand/search')">
        <u-search placeholder="请输入关键字进行搜索" color="#A6CCFE" searchIconColor="#A6CCFE" bgColor="transparent" borderColor="#1673FE" :show-action="false"></u-search>
      </view>
    </y-status-navbar>
    <view class="swiper-banners">
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
    <!-- card index -->
    <view class="card-content">
      <view class="card-tabs">
        <u-tabs
          lineHeight="12rpx"
          :lineColor="`url(../../static/icon/vector_bg.png) 100% 100%`"
          :activeStyle="{ color: '#1673FE', fontSize: '36rpx', fontWeight: 'bold' }"
          :list="state.tabs"
          @change="changeTab"
          keyName="title"></u-tabs>
      </view>
      <y-empty icon="data" v-if="!isLoading && isComplete && DataList.length == 0" title="暂无内容"></y-empty>

      <view class="errand-card" v-for="item in DataList">
        <y-errand-card
          :create_time_text="item.create_time_text"
          :is_address="item.is_address"
          :content="item.content"
          :goods_id="item.id"
          :endaddress="item.endaddress"
          :startaddress="item.startaddress"
          :price="item.price"
          :status_text="item.status_text"
          :type_title="item.type_title"
          :user_id="item.user_id" />
        <up-gap bg-color="RGBA(247, 248, 252, 1)"></up-gap>
      </view>
    </view>
    <y-tabbar></y-tabbar>
  </y-layout>
</template>

<script setup>
import { onLoad, onShow } from "@dcloudio/uni-app";
import { reactive, ref, computed } from "vue";
import shiba from "@/shiba";
const topic_id = computed(() => shiba.$store("app").user_topic_id);
let state = reactive({
  type: "",
  tabs: [
    {
      id: "",
      title: "接单大厅",
    },
    // 1=未被接单，2=我发布的，3=我的接单
    {
      id: 1,
      title: "未被接单",
    },
    {
      id: 2,
      title: "我发布的",
    },
    {
      id: 3,
      title: "我的接单",
    },
  ],
});
const changeTab = (item) => {
  state.type = item.id;
  reset();
};
const {
  reset, // 重置函数
  TotalData, // 总数据条数 (ref)
  DataList, // 列表数据 (ref)
  isComplete, // 是否加载完毕 (ref)
  isLoading, // 是否正在加载 (ref)
} = shiba.$hook.useGetList(shiba.$api.api.GrassRunErrands, {
  manual: true,
  params: () => {
    return {
      topic_id: topic_id.value,
      type: state.type,
    };
  },
});

// 获取首页轮播图
let swiper = ref([]);
const getBanner = async () => {
  const res = await shiba.$api.api.GetSwiper({
    topic_id: topic_id.value,
    type: "run",
  });

  swiper.value = res.data.map((items) => {
    return {
      ...items,
      image_url: uni.$y.oss(items.image),
    };
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
onShow(() => {
  getBanner();
  reset();
});
onLoad(()=>{
	uni.$on('changePageRunner',(eee)=>{
		reset();
	})
})
</script>

<style lang="scss" scoped>
.search-box {
  height: 90rpx;
  display: flex;
  align-items: center;
  padding: 0 15rpx;
}
.swiper-banners {
  padding: 0 24rpx;
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
  .errand-card {
  }
}
</style>
<style>
page {
  background: url(../../static/public/new_page_bage.png);
  background-size: 100% 100%;
}
</style>
