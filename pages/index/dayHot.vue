<template>
  <view class="indexsearch-page">
    <up-navbar title="今日热门" :autoBack="true" bgColor="transparent" placeholder></up-navbar>
    <view class="box-1">
      <view class="bg-img">
        <image src="/static/icon/rm-bg.png" mode=""></image>
      </view>
      <view class="text">
        <text class="t1">今日热门</text>
        <view class="t2">
          <up-notice-bar :text="data.DayHots" direction="column" icon color="#333333" bgColor="transparent"></up-notice-bar>
        </view>
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
            <y-empty icon="data" title="暂无热榜内容" v-if="data.list.length == 0"></y-empty>
            <view class="item" v-for="(item, index) in data.list" @click="$u.route(`/pages/management/management-info?id=${item.id}`)">
              <view class="left">
                <image src="/static/icon/rb-icon1.png" mode="" v-if="index == 0"></image>
                <image src="/static/icon/rb-icon2.png" mode="" v-else-if="index == 1"></image>
                <image src="/static/icon/rb-icon3.png" mode="" v-else-if="index == 2"></image>
                <text class="num" v-else>{{ index + 1 }}</text>
              </view>
              <view class="right">
                <text class="name" :class="[`text-${index + 1}`]">{{ item.introduce }}</text>
                <view class="b-b">
                  <view class="i-b">
                    <image src="/static/icon/message-chat-eye.png" mode=""></image>
                    <text>{{ item.browses }}</text>
                  </view>
                  <view class="i-b">
                    <image src="/static/icon/message-chat-thumbs.png" mode=""></image>
                    <text>{{ item.likes }}</text>
                  </view>
                  <view class="i-b">
                    <image src="/static/icon/message-chat-msg.png" mode=""></image>
                    <text>{{ item.comments }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import shiba from "@/shiba";
import { onLoad,onShareAppMessage, onShow } from "@dcloudio/uni-app";
const appStore = computed(() => shiba.$store("app").user_topic_id);
onShow(() => {
  getGrassInfo();
  GetHotNotice();
});
let introduceHot = ref("");
const topic_id = computed(() => shiba.$store("app").user_topic_id);
const data = reactive({
  list: [],
  DayHots: [],
  keyName: "",
  GrassInfo: {},
  text1: "",
});
// 获取首页详情
const getGrassInfo = async () => {
  const res = await shiba.$api.public.getGrassIndex({
    id: topic_id.value,
  });
  data.GrassInfo = res.data;
};

// 获取榜单
const GetHotNotice = async () => {
  const res = await shiba.$api.public.GetDayHot({
    topic_id: topic_id.value,
  });

  res.data.forEach((item) => {
    const cleanText = item.introduce.replace(/\s+/g, ' ').trim();
    data.DayHots.push(cleanText.length > 15 ? cleanText.substring(0, 10) + "..." : cleanText);
  });
};

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
    title: '集市今日十大神贴!',
    path: `/pages/index/dayHot?pic=${appStore.value}&type=share`,
  };
});
// #endif
</script>

<style>
page {
  background-color: #fff;
}

.indexsearch-page {
  background: url(../../static/public/new_page_bage.png);
  background-size: 100% 1134rpx;
  background-repeat: no-repeat;
}

.u-notice-bar {
  padding: 0;
}
</style>

<style lang="scss" scoped>
.indexsearch-page {
}

.box-1 {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 30rpx;
  position: relative;

  .bg-img {
    width: 690rpx;
    height: 88rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .text {
    position: absolute;
    left: 110rpx;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0 20rpx;
    padding-top: 12rpx;

    .t1 {
      font-weight: 800;
      font-size: 28rpx;
      color: #e4350c;
      flex-shrink: 0;
    }

    .t2 {
      width: 70%;
    }
  }
}

.main-box {
  // padding: 30rpx;
  margin-top: 30rpx;
}

.list {
  background: #ffffff;
  border-radius: 20rpx;
  // padding: 30rpx 22rpx;

  .title-box {
    position: relative;
    width: 100%;
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
        // align-items: center;
        gap: 0 24rpx;
        border-bottom: 1rpx solid #f8f8f8;
        padding: 15rpx 0;
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

        .right {
          .name {
            font-weight: 500;
            font-size: 28rpx;
            color: #333333;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            overflow: hidden;
            text-overflow: ellipsis;
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

          .b-b {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 0 20rpx;
            margin-top: 8rpx;

            .i-b {
              display: flex;
              align-items: center;
              gap: 0 4rpx;

              image {
                width: 28rpx;
                height: 28rpx;
              }

              text {
                font-weight: 500;
                font-size: 26rpx;
                color: #999999;
              }
            }
          }
        }
      }

      .item:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
