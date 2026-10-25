<template>
  <z-paging-swiper>
    <template #top>
      <view
        class="top_bg"
        :style="{
          background: `linear-gradient(to bottom, transparent 0%, transparent 500rpx, #fff 500rpx, #fff 100%), url(${$y.oss(ToPicState.back_image)}) no-repeat top / 100% 470rpx`,
        }">
        <!-- #ifdef MP-WEIXIN -->
        <y-status-navbar :isMenuPal="false"></y-status-navbar>
        <!-- #endif -->

        <view class="status-row">
          <view class="status-button" @click="$u.route('/pages/public/my-category')">
            切换
            <up-image width="27rpx" height="27rpx" src="/static/icon/icon_jh.png" mode="aspectFit"></up-image>
            <!-- <text class="shiba-refresh"></text> -->
          </view>
        </view>
        <y-status-navbar :isMenuPal="false"></y-status-navbar>

        <!-- 学校 -->
        <view class="university-card">
          <view class="university-info">
            <view class="university-image">
              <u-image radius="5" class="skeleton-circle" width="170rpx" height="170rpx" :src="$y.oss(ToPicState.icon)" mode="aspectFit"></u-image>
            </view>
            <view class="university-details">
              <view class="l-f l-j-between university-title">
                <view class="university-name skeleton-row text-cut-1">
                  {{ ToPicState.name }}
                </view>
                <view class="university-description skeleton-row" @click="stateInfo.show = true">
                  <u-image width="88rpx" height="48rpx" src="/static/icon/setting_all.png" mode="aspectFit"></u-image>
                </view>
              </view>
              <view class="university-members skeleton-row">
                <view class="university-num" @click="$u.route('/pages/public/circle-friend')">
                  已加入{{ ToPicState.user_count }}人
                  <text class="shiba-next"></text>
                </view>
                <view class="add" @click="messageAdd" v-if="ToPicState.is_join != 1">加入</view>
                <!-- <view class="add" @click="messageOut" v-else>退圈</view> -->
              </view>
            </view>
          </view>
        </view>
        <view class="l-bg-white">
          <view class="university-cell">
            <view class="university-cell-item skeleton-row" @click="$u.route('/pages/public/notice')">
              <view class="icon">
                <u-image width="74rpx" height="55rpx" src="/static/icon/icon-notice.png" mode="aspectFit"></u-image>
              </view>
              <view class="label">公告信息</view>
            </view>
            <view class="university-cell-item skeleton-row" @click="navigateToMiniProgram">
              <view class="icon">
                <u-image width="74rpx" height="55rpx" src="/static/icon/icon-xcx.png" mode="aspectFit"></u-image>
              </view>
              <view class="label">小程序</view>
            </view>
            <view class="university-cell-item skeleton-row" @click="$u.route('/pages/public/qrcode-group')">
              <view class="icon">
                <u-image width="74rpx" height="55rpx" src="/static/icon/icon-group.png" mode="aspectFit"></u-image>
              </view>
              <view class="label">扫码加群</view>
            </view>

            <view class="university-cell-item skeleton-row" @click="$u.route('/pages/public/paid-promotion')">
              <view class="icon">
                <u-image width="74rpx" height="55rpx" src="/static/icon/icon-fftg.png" mode="aspectFit"></u-image>
              </view>
              <view class="label">付费推广</view>
            </view>
          </view>
          <!-- 轮播区域 -->
          <view class="notice-cell skeleton-row">
            <y-notice :list="HotTopicNotice" keyName="title"></y-notice>
          </view>

          <u-sticky bg-color="#fff" :offsetTop="0" :customNavHeight="0">
            <!-- #ifdef MP -->
            <y-status-navbar :isMenuPal="false" v-if="stateInfo.pageYScroll > stateInfo.targetY"></y-status-navbar>
            <view class="status-row" v-if="stateInfo.pageYScroll > stateInfo.targetY">
              <view class="status-button" @click="$u.route('/pages/public/my-category')">
                切换
                <up-image width="27rpx" height="27rpx" src="/static/icon/icon_jh.png" mode="aspectFit"></up-image>
              </view>
            </view>
            <!-- #endif -->
            <!-- 切换分类区域 -->
            <view class="freshman_support_zone">
              <view class="freshman-classify skeleton-row">
                <u-tabs
                  @change="changeTab"
                  :current="current"
                  lineHeight="12rpx"
                  :lineColor="`url(../../static/icon/vector_bg.png) 100% 100%`"
                  :activeStyle="{ color: '#1673FE', fontSize: '36rpx', fontWeight: 'bold' }"
                  :list="list"></u-tabs>
              </view>
              <view class="search skeleton-row" @click="$u.route('/pages/public/search/search')">
                <text class="shiba-search"></text>
              </view>
            </view>
          </u-sticky>
        </view>
      </view>
    </template>
    <swiper @change="changeCurrent" class="swiper-box" :current="modelValue" :duration="500">
      <!-- 动态 -->
      <swiper-item>
        <y-swiper-item></y-swiper-item>
      </swiper-item>
    </swiper>
  </z-paging-swiper>
</template>
<script setup>
import { computed, nextTick, reactive, ref, watch } from "vue";
import shiba from "../../shiba";
import { onLoad, onPageScroll, onReady, onShow, onReachBottom, onPullDownRefresh, onShareAppMessage } from "@dcloudio/uni-app";

const appStore = computed(() => shiba.$store("app").user_topic_id);
const SystemStore = computed(() => shiba.$store("app").System);
let showInvite = ref(false);
let current = ref(0);

const message = shiba.$hook.useMessageBox();
const messageInfo = shiba.$hook.useMessageBox("selector_info");

// state 状态
const stateInfo = reactive({
  show: false,
  // 当前圈子动态选中的id
  grassLabelId: -1,
  // 付费置顶展示
  warmShow: false,
  TabCurrent: 0,
  targetY: 0,
  pageYScroll: 0,
});

let list = reactive([
  {
    id: 1,
    name: "圈子动态",
  },
  {
    id: 2,
    name: "跑腿",
  },
  {
    id: 3,
    name: "组局",
  },
]);

let condition = reactive([]);

let ToPicState = reactive({
  name: "",
  content: "",
  user_count: "",
  is_join: 0,
  icon: "",
  join_status: 0,
  back_image: "",
});

// 事件处理
const getTopic = async () => {
  console.log(uni.$y.oss("/uploads/logo.png"));
  try {
    const res = await shiba.$api.public.getGrassIndex({
      id: appStore.value,
    });

    ToPicState.back_image = res.data.back_image;
    ToPicState.user_count = res.data.user_count;
    ToPicState.name = res.data.name;
    ToPicState.content = res.data.content;
    ToPicState.is_join = res.data.is_join;
    ToPicState.join_status = res.data.join_status;
    ToPicState.icon = res.data.icon;
    AppID.value = res.data.AppID;
  } catch (error) {
    console.error("Failed to fetch topic data:", error);
  }
};

// 加入
const messageAdd = () => {
  message
    .confirm({
      title: "提示",
      content: "确认加入吗？",
      confirmText: "确认",
    })
    .then(() => {
      if (ToPicState.join_status == 1) {
        sendForm();
      } else {
        uni.$u.route({
          url: "/pages/public/join-circle",
          params: {
            id: appStore.value,
          },
        });
      }
    });
};
// 加入请求
const sendForm = async () => {
  const res = await shiba.$api.public.applyJoin({
    topic_id: appStore.value,
    content: "",
    image: "",
  });
  const messags = await message.confirm({
    title: "提示",
    content: "已加入圈子",
  });
  getTopic();
};

// 取消
const messageOut = async () => {
  try {
    await message.confirm({
      title: "提示",
      content: "确认退出吗？",
      confirmText: "确认退出",
    });
    await shiba.$api.public.GrassTopicOut({
      topic_id: appStore.value,
    });
    ToPicState.is_join = 0;
    message.alert({
      title: "提示",
      content: "退圈成功",
    });
  } catch (error) {
    console.error("Failed to exit topic:", error);
  }
};

const changeTab = (item) => {
  current.value = item.index;
};

// 获取圈子分类动态标签
let GrassLabel = ref([]);
let GrassPage = {
  page: 1,
  limit: 10,
};
const getGrassLabel = async () => {
  const res = await shiba.$api.public.getGrassLabel();
  GrassLabel.value = res.data;
  GrassLabel.value.unshift({
    title: "全部",
    id: -1,
  });
};

// 获取今日热门
let HotTopicNotice = ref([]);
const DayHotGrassTopic = async () => {
  const res = await shiba.$api.api.DayHotGrassTopic({
    topic_id: appStore.value,
  });
  HotTopicNotice.value = res.data;
};
onLoad((opction) => {
  console.log(opction, "opction");
  DayHotGrassTopic();
});

let TabConetntRef = ref(null);
onPullDownRefresh(() => {
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
  TabConetntRef.value.refreshCurrentTabData();
});
onShow(() => {
  nextTick(() => {
    TabConetntRef.value.refreshCurrentTabData();
  });
});
watch(
  () => appStore.value,
  (newValue) => {
    getTopic();
  },
  {
    immediate: true,
  }
);

// #ifdef MP-WEIXIN
// 写一个函数 用于生成微信小程序 分享
let shareState = reactive({
  title: "",
  imageUrl: "",
  path: "/pages/index/index",
});

const shareParams = () => {
  shareState.title = "分享";
  shareState.imageUrl = uni.$y.oss("/uploads/logo.png");
  // 此处是分享页面
  shareState.path = `/pages/index/index?pic_id=${appStore.value}`;
};
uni.showShareMenu({
  menus: ["shareAppMessage", "shareTimeline"],
});
onShareAppMessage(() => {
  return {
    type: 0,
    title: "邀请好友",
    imageUrl: uni.$y.oss("/uploads/logo.png"),
    path: `/pages/index/index?pic_id=${appStore.value}&type=share`,
  };
});
// #endif

let AppID = ref("");
const navigateToMiniProgram = () => {
  if (AppID.value) {
    wx.navigateToMiniProgram({
      appId: AppID.value,
      envVersion: "release",
      success(res) {
        // 打开成功
      },
      fail: () => {
        uni.showToast({
          title: "打开失败 请稍后再试",
          icon: "none",
        });
      },
    });
  } else {
    uni.showToast({
      title: "此圈子暂未开放此功能",
      icon: "none",
    });
  }
};
// 滑动区域
onReady((e) => {
  uni
    .createSelectorQuery()
    .select(".freshman_support_zone")
    .boundingClientRect((rect) => {
      if (rect) {
        stateInfo.targetY = rect.top;
        console.log(rect, "freshman_support_zone details");
      } else {
        console.error("Element not found: .freshman_support_zone");
      }
    })
    .exec();
});
onPageScroll((e) => {
  console.log(e, "onPageScrollonPageScrollonPageScroll");
  stateInfo.pageYScroll = e.scrollTop;
});
</script>

<style lang="scss" scoped>
.status-row {
  width: 710rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  position: relative;
  z-index: 9999;

  .status-button {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 55rpx;
    height: 55rpx;
    font-size: 25rpx;
    display: flex;
    gap: 5rpx;
    align-items: center;
    padding: 0 15rpx;
    color: #fff;
    font-weight: bold;
  }
  .switch-button {
    width: 126rpx;
    height: 54rpx;
    background: #f8f8f8;
    border-radius: 27rpx;
    display: flex;
    align-items: center;
    font-size: 24rpx;
    justify-content: center;
  }
}

.university-cell {
  background-color: #fff;
  padding: 10rpx 0;
  display: flex;

  .university-cell-item {
    width: 130rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .icon {
      margin-bottom: 10rpx;
    }

    .label {
      font-size: 24rpx;
    }
  }
}

.university-card {
  height: 200rpx;

  /* #ifdef H5 */
  margin-top: 200rpx;

  /* #endif */
  position: relative;
  z-index: 1111;
  &::before {
    position: absolute;
    width: 100%;
    bottom: 0;
    border-radius: 20rpx 20rpx 0 0;
    height: 100rpx;
    background-color: #fff;
    content: "";
  }

  .university-info {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 20rpx;
  }

  .university-image {
    width: 200rpx;
    height: 200rpx;
    border-radius: 10rpx;
    margin-right: 20rpx;
  }

  .university-details {
    position: relative;
    display: flex;
    width: calc(100% - 170rpx);
    flex-direction: column;
    justify-content: center;

    .university-title {
      height: 80rpx;
    }

    .university-name {
      font-size: 40rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
      line-height: 50rpx;
      width: 400rpx;
      height: 50rpx;
      color: #fff;
    }

    .university-description {
      font-size: 24rpx;
      color: #666;
      width: 88rpx;
      height: 48rpx;
      background-color: rgb(255, 217, 114, 0.3);
      text-align: center;
      margin-bottom: 10rpx;
      border-radius: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .university-members {
      font-size: 24rpx;
      color: #333;
      height: 70rpx;
      align-items: center;
      display: flex;
      justify-content: space-between;

      .university-num {
        font-size: 26rpx;
        color: #333333;
      }

      .add {
        padding: 5rpx 25rpx;
        height: 48rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fec93a;
        border-radius: 24rpx;
        color: #333333;
        font-weight: bold;
      }
    }
  }
}

.condition {
  .condition-scroll {
    display: flex;
    align-items: center;
    gap: 20rpx;
    flex-direction: row;
    height: 80rpx;
    padding: 0 20rpx;
  }

  .condition-item {
    flex-shrink: 0;
    background: #f6f7f9;
    border-radius: 28rpx;
    padding: 8rpx 10rpx;
    font-size: 22rpx;
  }

  .active {
    background-color: rgba(255, 212, 96, 0.3);
    color: #f5aa00;
    font-weight: bold;
  }
}

.freshman_support_zone {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10rpx;

  .freshman-classify {
    width: 600rpx;
  }

  .search {
    .shiba-search {
      color: #d9d9d9;
      font-size: 42rpx;
    }

    display: flex;
    align-items: center;
    justify-content: center;
    width: 70rpx;

    position: relative;

    &::before {
      position: absolute;
      content: "";
      width: 5rpx;
      height: 25rpx;
      background-color: #cdcdcd;
      left: 0;
      border-radius: 10rpx;
    }
  }
}

.message-card {
  width: 670rpx;
  margin: 0 auto;
  background-color: white;
  overflow: hidden;
  border-bottom: 1rpx solid #f8f8f8;
  padding-bottom: 10rpx;

  &__header {
    padding: 10rpx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .user-info {
      display: flex;
      align-items: center;

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 1rem;
      }

      .user-details {
        display: flex;

        .user-name {
          font-weight: bold;
          font-size: 28rpx;
        }

        .user-level {
          margin: 0 10rpx;
          font-size: 0.875rem;
        }
      }
    }

    .more-options {
      width: 120rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .opction-item {
        font-size: 35rpx;
        font-weight: bold;
      }
    }
  }

  .message-content {
    font-size: 28rpx;
    padding: 20rpx 0rpx;
    line-height: 1.6;
    color: #333333;
    font-weight: 600;

    .tag {
      background: rgba(254, 179, 36, 0.2);
      border-radius: 28rpx 28rpx 28rpx 28rpx;
      padding: 5rpx 20rpx;
      margin-right: 20rpx;
      font-size: 22rpx;
      color: #f5aa00;
    }
  }

  .media-gallery {
    gap: 10rpx;
    display: flex;
    flex-wrap: wrap;
  }

  .message-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx;

    .action-buttons {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48rpx;
      width: 180rpx;
      background: #f6f7f9;
      border-radius: 24rpx 24rpx 24rpx 24rpx;

      .button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        padding: 0 10rpx;
      }
    }

    .meta-info {
      gap: 20rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      color: #999999;

      .time-stamp {
        font-size: 22rpx;
      }

      .viewer-count {
        font-size: 22rpx;
      }
    }
  }
}

.stateInfo_content {
  width: 750rpx;
  height: 624rpx;
  padding: 20rpx;

  .close {
    display: flex;
    justify-content: flex-end;
  }

  .content {
    font-size: 28rpx;
    color: #666666;
    line-height: 1.5;
  }

  .cancel-out {
    margin: 20rpx 0;
  }

  .school-content-info {
    display: flex;
    height: 130rpx;
    justify-content: space-between;
    align-items: center;
    margin: 20rpx 0;

    .avatar {
      width: 100rpx;
    }

    .name {
      width: 450rpx;
      font-weight: bold;
      font-size: 32rpx;
      color: #333;
    }

    .share {
      width: 138rpx;
      height: 48rpx;
      background: #ffd972;
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

// 帮助
.message-card-errand {
  border-bottom: 1rpx solid #f9f9f9;

  .more-options {
    justify-content: flex-end;
  }

  .message-footer {
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;

    .price-content {
      .tips {
        font-size: 24rpx;
        color: #333333;
      }

      .price {
        color: #e81616;
        margin: 0 10rpx;
      }
    }
  }

  .state {
    width: 80rpx;
    height: 30rpx;
    font-size: 15rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffcfac;
    border-radius: 15rpx 15rpx 15rpx 15rpx;
  }
}

// 拼团
.group_booking {
  .message-footer {
    justify-content: flex-end;
  }

  .group-booking {
    width: 212rpx;
    height: 48rpx;
    background: #fec93a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rpx;
    font-weight: bold;
    border-radius: 24rpx;

    .label {
      font-size: 24rpx;
      color: #333333;
      text-align: center;
      width: 70rpx;
      flex-shrink: 0;
    }

    .user-list {
      display: flex;
      gap: 5rpx;
    }
  }

  .group-list {
    width: 192rpx;
    height: 48rpx;
    background: #fec93a;
    border-radius: 24rpx 24rpx 24rpx 24rpx;
  }
}

.create-popup {
  width: 750rpx;
  height: 556rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: 24rpx 24rpx 0rpx 0rpx;

  .action-item {
    margin: 20rpx 0;
    width: 686rpx;
    height: 117rpx;
    background: #f4f4f4;
    border-radius: 59rpx 59rpx 59rpx 59rpx;
    background-color: #f4f4f4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;

    .next {
      width: 50rpx;
      flex-shrink: 0;
      color: #333;
    }

    .content-info {
      width: 460rpx;

      .content-label {
        font-size: 28rpx;
        color: #333333;
        font-weight: bold;
      }

      .content-values {
        color: #999999;
        font-size: 24rpx;
      }
    }
  }
}

// 付费帮顶
.warm-content {
  height: 70vh;

  .title {
    height: 100rpx;
    color: #333;
    text-align: center;
    line-height: 100rpx;
    border-bottom: 1rpx solid #eeeeee;
  }

  .warm-prices {
    padding: 20rpx;

    .tips {
      font-size: 28rpx;
      color: #333333;
    }

    .foot-inform {
      .foot-left {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999999;

        text {
          color: #2999f8;
        }

        gap: 10rpx;
        font-size: 24rpx;
        height: 80rpx;
      }

      .btn {
        background-color: #ffd972;
        color: #333333;
        font-size: 32rpx;
        height: 88rpx;
        border-radius: 88rpx;
        width: 640rpx;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .price-list {
      margin-bottom: 30rpx;
      height: 560rpx;

      .active {
        border: 1rpx solid #1673fe;
      }

      .price-item {
        width: 686rpx;
        margin: 20rpx auto;
        height: 88rpx;
        background: #f5f5f5;
        border-radius: 20rpx 20rpx 20rpx 20rpx;
        border: 1rpx solid #f5f5f5;
        display: flex;
        padding: 0 10rpx;
        justify-content: space-between;
        align-items: center;
        position: relative;
        font-size: 28rpx;
        color: #333333;

        .tag {
          position: absolute;
          right: 0;
          content: "";
          top: 0;
          width: 80rpx;
          height: 32rpx;
          background: #1673fe;
          border-radius: 0rpx 20rpx 0rpx 20rpx;
          font-size: 19rpx;
          text-align: center;
          line-height: 32rpx;
        }

        .radio-txt {
          display: flex;

          .label_text {
            color: #333;
            font-weight: bold;
            padding-left: 20rpx;
          }
        }

        .price-num {
          color: #e81616;
          padding-right: 90rpx;
          font-size: 40rpx;
        }
      }
    }
  }
}

.notice-cell {
  padding: 0 20rpx;
}
.swiper-box {
  height: 100vh;
}
</style>
<style>
page {
  background-color: #fff;
}
</style>
