<template>
  <y-layout :coustom="true">
    <up-navbar left-icon="" leftIconColor="#fff" title="我的消息" :placeholder="true" auto-back></up-navbar>
    <view class="container">
      <view class="notice-card" @tap="openMpGzh">
        <view class="notice-top">
          <view class="notice-title">开启消息提醒</view>
          <view class="notice-desc">
            <view class="">关注公众号"校小乐校园集市"</view>
            <view class="">实时接收消息提醒</view>
          </view>
        </view>
        <view>
          <u-button @tap="openMpGzh" color="#1673FE" shape="circle" text="点我关注"></u-button>
        </view>
      </view>
      <view class="cell-list">
        <view class="cell-item" @click="handleMessageClick('platform')">
          <view class="cell-left">
            <view class="icon platform-icon">
              <view class="badge">
                <u-badge max="99" :value="noticeSystem.bulletinCount"></u-badge>
              </view>
              <up-image width="96rpx" height="96rpx" src="/static/icon/message_notice.png" mode="aspectFit"></up-image>
            </view>
            <view class="content">
              <view class="title">平台消息</view>
              <view class="desc l-text-cuts">{{ state?.platform?.title || "暂无消息" }}</view>
            </view>
          </view>
          <view class="cell-right">
            <text class="time">{{ $u.timeFormat(state?.platform?.create_time, "yyyy-mm-dd hh:MM:ss") }}</text>
          </view>
        </view>
        <view class="cell-item" @click="handleMessageClick('like')">
          <view class="cell-left">
            <view class="icon like-icon">
              <view class="badge">
                <u-badge max="99" :value="noticeSystem.hudongCount"></u-badge>
              </view>
              <up-image width="96rpx" height="96rpx" src="/static/icon/message_dz.png" mode="aspectFit"></up-image>
            </view>
            <view class="content">
              <view class="title">收到点赞/评论</view>
              <view class="desc l-text-cuts">{{ state.hudong.content }}</view>
            </view>
          </view>
          <view class="cell-right">
            <text class="time">
              {{ $u.timeFormat(state.hudong.create_time, "yyyy-mm-dd hh:MM:ss") }}
            </text>
          </view>
        </view>
        <view class="cell-item" @click="handleMessageClick('order')">
          <view class="cell-left">
            <view class="icon order-icon">
              <view class="badge">
                <u-badge max="99" :value="noticeSystem.runOrderCount"></u-badge>
              </view>
              <up-image width="96rpx" height="96rpx" src="/static/icon/message_order.png" mode="aspectFit"></up-image>
            </view>
            <view class="content">
              <view class="title">跑腿订单消息</view>
              <view class="desc l-text-cuts">{{ state.runOrder.title }}</view>
            </view>
          </view>
          <view class="cell-right">
            <text class="time">{{ $u.timeFormat(state.runOrder.create_time, "yyyy-mm-dd hh:MM:ss") }}</text>
          </view>
        </view>

        <view class="cell-item" @click="handleMessageClick('payment')">
          <view class="cell-left">
            <view class="icon payment-icon">
              <view class="badge">
                <u-badge max="99" :value="noticeSystem.commonCount"></u-badge>
              </view>
              <up-image width="96rpx" height="96rpx" src="/static/icon/message_wall.png" mode="aspectFit"></up-image>
            </view>
            <view class="content">
              <view class="title">佣金到账</view>
              <view class="desc l-text-cuts">{{ state.commission.content || "暂无信息" }}</view>
            </view>
          </view>
          <view class="cell-right">
            <text class="time">{{ $u.timeFormat(state.commission.create_time, "yyyy-mm-dd hh:MM:ss") }}</text>
          </view>
        </view>
      </view>

      <view class="logo">
        <up-image :src="$y.oss('/uploads/logo.png')" width="300rpx" height="300rpx" mode=""></up-image>
      </view>

      <y-popup-notice></y-popup-notice>
      <y-tabbar></y-tabbar>

      <up-popup @close="state.postShow = false" :closeOnClickOverlay="true" :show="state.postShow" mode="center" round="20rpx" bgColor="transparent">
        <view class="group_poster">
          <image src="/static/public/group_bg_poster.png" mode="aspectFit" class="bg"></image>
          <view class="content">
            <view class="group_title">关注集市公众号</view>
            <view class="group_desc">实时通知帖子以及跑腿状态</view>
            <view class="group_code">
              <up-image width="300rpx" height="300rpx" :src="$y.oss(wechat_image)" mode="aspectFit"></up-image>
            </view>
            <view class="hint">长按二维码关注公众号</view>
          </view>
        </view>
      </up-popup>
    </view>
  </y-layout>
</template>

<script setup>
import { onLoad, onShow } from "@dcloudio/uni-app";
import { computed, reactive, ref } from "vue";
import shiba from "@/shiba";
const appStore = shiba.$store("app");
const noticeSystem = computed(() => shiba.$store("app").notice);
const wechat_image = computed(() => shiba.$store("app").wechat_image);

onShow(() => {
  appStore.init();

  getNoticeInfo();
});
const unreadCounts = reactive({
  platform: 2,
  like: 3,
  order: 1,
  payment: 5,

  // 总未读
  noteCount: 0,
  // 平台未读
  bulletinCount: 0,
  noteCount: 0,
  noteCount: 0,
});
let state = reactive({
  commission: {},
  hudong: {},
  platform: {},
  runOrder: {},
  postShow: false,
});

const handleMessageClick = (type) => {
  switch (type) {
    case "platform":
      uni.$u.route({
        url: "/pages/message/message-platform",
      });
      break;
    case "like":
    case "order":
    case "payment":
      uni.$u.route({
        url: "/pages/message/message-list",
        params: {
          type: type,
        },
      });
      break;
  }
};

const getNoticeInfo = async () => {
  const res = await shiba.$api.api.GetNoticeInfo({
    topic_id: shiba.$store("app").user_topic_id,
  });
  state.commission = res.data.commission || {
    content: "暂无信息",
    create_time: new Date().getTime(),
    commonCount: 0,
  };
  state.hudong = res.data.hudong || {
    content: "暂无信息",
    create_time: new Date().getTime(),
    noteCount: 0,
  };
  state.platform = res.data.platform || {
    title: "暂无信息",
    create_time: new Date().getTime(),
  };
  state.runOrder = res.data.runOrder || {
    title: "暂无信息",
    create_time: new Date().getTime(),
  };
};
const openMpGzh = () => {
  console.log(22222222);
  state.postShow = true;
  // uni.$y.ToWeChatFollowByArticle("BJXXLXYJS");
};
</script>

<style lang="scss" scoped>
.notice-card {
  width: 690rpx;
  height: 150rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f7f8fc;
  margin: 20rpx auto;
  padding: 0 30rpx;

  .notice-top {
    .notice-title {
      font-size: 30rpx;
      color: #333333;
      font-weight: bold;
      margin-bottom: 10rpx;
    }

    .notice-desc {
      font-size: 23rpx;
      color: #999999;
      line-height: 1.5;
    }
  }
}

.cell-list {
  margin: 0 auto;

  .cell-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-radius: 16rpx;

    .cell-left {
      display: flex;
      align-items: center;

      .icon {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20rpx;
      }

      .content {
        padding-left: 10rpx;
        width: 300rpx;

        .title {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
          margin-bottom: 8rpx;
        }

        .desc {
          font-size: 24rpx;
          color: #999;
        }
      }
    }

    .cell-right {
      text-align: right;

      .time {
        font-size: 22rpx;
        color: #999;
        display: block;
        margin-bottom: 8rpx;
      }

      .badge {
        background: #ff4d4f;
        color: #fff;
        font-size: 20rpx;
        padding: 2rpx 12rpx;
        border-radius: 20rpx;
        display: inline-block;
      }
    }
  }
}
.icon {
  position: relative;
  .badge {
    position: absolute;
    right: -10rpx;
    top: -10rpx;
  }
}
.logo {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.group_poster {
  width: 600rpx;
  height: 760rpx;
  position: relative;

  .bg {
    position: absolute;
    z-index: 11;
    width: 600rpx;
    height: 760rpx;
  }

  .content {
    position: absolute;
    z-index: 112;
    width: 100%;

    .group_title {
      color: #ffffff;
      font-size: 36rpx;
      text-align: center;
      font-weight: bold;
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
    }

    .group_desc {
      text-align: center;
      color: #ffffff;
    }

    .group_code {
      margin: 70rpx auto;
      width: 300rpx;
      height: 300rpx;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
    }

    .hint {
      text-align: center;
      color: #999999;
    }
  }
}
</style>
<style>
page {
  background-color: #fff !important;
}
</style>
