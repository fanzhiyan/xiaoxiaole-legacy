<template>
  <view class="indexsearch-page">
    <up-navbar title="搜索" :autoBack="true" bgColor="transparent" placeholder></up-navbar>
    <view class="search">
      <view class="conten">
        <image src="/static/icon/search.png" mode=""></image>
        <input type="text" placeholder="输入关键词进行搜索" v-model="data.keyName" @confirm="tosearchRel" placeholder-class="place-class" />
      </view>
    </view>

    <view class="main-box">
      <view class="list">
        <view class="title-box">
          <image class="bg-img" src="/static/icon/rb-bg.png" mode=""></image>
          <text class="title">{{ data.GrassInfo.name }}集市今日热榜</text>
        </view>

        <view class="cont">
          <view class="item-box">
            <y-empty icon="soldout" v-if="data.list.length == 0" title="暂无今日热榜内容"></y-empty>
            <view class="item" v-for="(item, index) in data.list" @click="$u.route(`/pages/management/management-info?id=${item.id}`)">
              <view class="left">
                <image src="/static/icon/rb-icon1.png" mode="" v-if="index == 0"></image>
                <image src="/static/icon/rb-icon2.png" mode="" v-else-if="index == 1"></image>
                <image src="/static/icon/rb-icon3.png" mode="" v-else-if="index == 2"></image>
                <text class="num" v-else>{{ index + 1 }}</text>
              </view>

              <text class="name" :class="[`text-${index + 1}`]">{{ item.introduce }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, computed } from "vue";
import shiba from "@/shiba";
import { onLoad,onShareAppMessage } from "@dcloudio/uni-app";
const topic_id = computed(() => shiba.$store("app").user_topic_id);
const data = reactive({
  list: [],
  keyName: "",
  GrassInfo: {},
});

// 获取首页详情
const getGrassInfo = async () => {
  const res = await shiba.$api.public.getGrassIndex({
    id: topic_id.value,
  });
  data.GrassInfo = res.data;
};
// const {
// 	DataList,
// 	isLoading,
// 	isComplete,
// 	reset
// } = shiba.$hook.useGetList(shiba.$api.api.getGrass, {
// 	params: () => {
// 		return {
// 			topic_id: topic_id.value,
// 			keyword: GrassState.keyword,
// 			grass_type: GrassState.grass_type,
// 		};
// 	},
// });
// 获取列表
const getList = async (bool = true) => {
  const res = await shiba.$api.api.DayHotGrassTopic({
    topic_id: topic_id.value,
  });
  if (res.code == 1) {
    if (bool) {
      data.list = res.data;
    } else {
      data.list.push(...res.data);
    }
  }
};

const tosearchRel = () => {
  if (!data.keyName) return uni.$u.toast("请输入学校名称");
  uni.navigateTo({
    url: `/pages/index/searchRel?name=${data.keyName}`,
  });
};

onLoad(() => {
  getList();
  getGrassInfo();
});
// const {
// 	DataList,
// 	isLoading,
// 	isComplete,
// 	reset
// } = shiba.$hook.useGetList(shiba.$api.api.DayHotGrassTopic, {
// 	params: () => {
// 		return {};
// 	},
// });

// #ifdef MP-WEIXIN
// 写一个函数 用于生成微信小程序 分享
uni.showShareMenu({
  menus: ["shareAppMessage", "shareTimeline"],
});
onShareAppMessage(() => {
  return {
    type: 0,
    title: '校小乐校园集市',
    path: `/pages/index/index?pic=${topic_id.value}&type=share`,
  };
});
// #endif



</script>

<style lang="scss" scoped>
.search {
  padding: 0 30rpx;
  position: relative;
  z-index: 99999;

  .conten {
    display: flex;
    align-items: center;
    gap: 0 8rpx;
    box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(23, 116, 254, 0.1);
    border-radius: 200rpx;
    border: 2rpx solid #1673fe;
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

    input {
      font-weight: 500;
      font-size: 28rpx;
      color: #333;
    }

    .place-class {
      font-weight: 500;
      font-size: 28rpx;
      color: #a6ccfe;
    }
  }
}

.main-box {
  padding: 30rpx;
}

.list {
  background: #ffffff;
  border-radius: 20rpx;
  // padding: 30rpx 22rpx;

  .title-box {
    position: relative;
    width: 690rpx;
    height: 104rpx;
    padding: 20rpx 30rpx;

    .title {
      font-weight: 800;
      font-size: 32rpx;
      color: #e4350c;
      display: block;
      margin-bottom: 20rpx;
      position: relative;
      z-index: 999;
    }

    .bg-img {
      position: absolute;
      top: -20rpx;
      right: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // z-index: 9999999;
    }
  }

  .cont {
    // position: absolute;
    // z-index: 9999999;
    // top: 14rpx;
    // right: 0;
    // left: 0;
    // padding: 0 20rpx;
    // width: 100%;
    // background-color: #fff;
    padding: 0 20rpx;
    padding-bottom: 30rpx;

    .item-box {
      .item {
        display: flex;
        align-items: center;
        gap: 0 24rpx;
        padding-bottom: 4rpx;
        margin: 10rpx 0;
        border-bottom: 1rpx solid #f8f8f8;
        .left {
          width: 40rpx;
          height: 40rpx;
          flex-shrink: 0;
        }

        image {
          width: 100%;
          height: 100%;
        }

        .num {
          font-weight: 500;
          font-size: 32rpx;
          color: #333333;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .name {
          font-weight: 500;
          font-size: 28rpx;
          color: #333333;
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }

        .text-1 {
          color: #d17d30;
        }

        .text-2 {
          color: #576088;
        }

        .text-3 {
          color: #a95140;
        }
      }

      .item:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>

<style>
page {
  background-color: #f7f8fc;
}

.indexsearch-page {
  background: url(../../static/public/new_page_bage.png);
  background-size: 100% 1134rpx;
  background-repeat: no-repeat;
}
</style>
