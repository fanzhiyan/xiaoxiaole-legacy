<template>
  <y-layout :coustom="true">
    <view class="info-content">
      <y-status-navbar></y-status-navbar>
      <view class="bg_us">
      </view>
      <view class="user-content">
        <view class="user">
          <view class="avatar">
            <y-avatar :auth_status="state?.user?.auth_status" :src="$y.oss(state.user.avatar)" avatarSize="160rpx" genderSize="40rpx"></y-avatar>
          </view>
          <view class="user-info">
            <view class="user-name">{{ state.user.nickname }}</view>
            <view class="user-scholl">{{ state?.user?.grass_topic }}</view>
          </view>
        </view>
        <view class="personalized">{{ state.user.bio }}</view>
      </view>
    </view>
    <view class="content">
      <view class="tab-title">
        <u-tabs
          :list="list"
          @change="changeTab"
          lineColor="#FFD460"
          lineHeight="12rpx"
          :lineColor="`url(../../static/icon/vector_bg.png) 100% 100%`"
          :activeStyle="{ color: '#1673FE', fontSize: '36rpx', fontWeight: 'bold' }"></u-tabs>
      </view>
      <view class="condition">
        <!-- 内容区域 消息卡片 -->
        <view class="message-card" v-for="item in state.GrassList">
          <view class="message-card__header">
            <view class="user-info">
              <view class="user-avatar">
                <y-avatar size="64rpx" :auth_status="state?.user?.auth_status" :src="$y.oss(state.user.avatar)"></y-avatar>
              </view>
              <view class="user-details">
                <view class="user-name">
                  <view class="name">
                    {{ state?.user?.nickname }}
                  </view>
                  <view class="time">
                    {{ item.time }}
                  </view>
                </view>
                <view class="user-level">
                  <!-- <y-grade :level_img="item.user.level_img" :level_text="item.user.level_text"></y-grade> -->
                </view>
              </view>
            </view>
            <view class="more-options">
              <view class="opction-item">
              </view>
              <view class="opction-item" @click="report(item)">
                <text class="shiba-checkmore"></text>
              </view>
            </view>
          </view>
          <view class="message-content" @click="$u.route(`/pages/management/management-info?id=${item.id}`)">
            <text class="tag">{{ item.label_text }}</text>
            {{ item.title }}
          </view>
          <view class="media-gallery" v-if="item?.imageArray?.length != 0" @click="$y.previewImages(item.imageArray)">
            <u-image width="216rpx" height="226rpx" :src="items" mode="aspectFit" v-for="items in item.imageArray"></u-image>
          </view>
          <view class="message-footer">
            <view class="meta-info">
              <view class="time-stamp">{{ item.time }}</view>
              <view class="viewer-count">{{ item.browses }}人围观</view>
            </view>
            <view class="action-buttons">
              <view class="footer-tag">
                <view class="tag-university">{{ state.user.grass_topic }}</view>
                <view class="tag-location-icon">
                  <u-image width="34rpx" height="34rpx" src="/static/icon/icon-location.png" mode="aspectFit"></u-image>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <y-report :grass_id="state.reportId" v-model="state.modalReport"></y-report>
  </y-layout>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import shiba from "@/shiba";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
let current = ref(1);
const changeTab = (ute) => {
  current.value = ute.id;
};
let list = reactive([
  {
    id: 1,
    name: "动态",
  },
]);
let state = reactive({
  user_id: "",
  GrassList: [],
  user: {
    gender: 1,
  },
  page: 1,
  reportId: "",
  modalReport: false,
});
onLoad((opction) => {
  state.user_id = opction?.user_id || "";
  getUser();
});
const getUser = async () => {
  const res = await shiba.$api.api.GetUserIndex({
    user_id: state.user_id,
    page: state.page,
  });
  state.user = res.data.user;
  res.data.grass.data.map((items) => {
    state.GrassList.push({
      ...items,
      imageArray: items.images_url
        .split(",")
        .filter((items) => items != "")
        .map((items) => uni.$y.oss(items)),
    });
  });
};

/**
 * ---------------
 * 举报
 * ---------------
 */
const report = (item) => {
  state.reportId = item.id;
  state.modalReport = true;
};

onReachBottom(() => {
  state.page++;
  getUser();
});
</script>

<style lang="scss" scoped></style>
<style lang="scss" scoped>
.info-content {
  position: relative;
  padding: 0 25rpx;
  height: 430rpx;

  .bg_us {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 550rpx;
    transform: scale(1.3);
  }

  .user-content {
    width: 100%;
    position: absolute;
    z-index: 99;
    left: 50%;
    padding: 0 20rpx;
    transform: translateX(-50%);

    .personalized {
      font-size: 28rpx;
      font-weight: 600;
      color: #fff;
    }

    .user {
      align-items: center;
      display: flex;
      height: 170rpx;

      .user-info {
        color: #fff;
        padding: 0 15rpx;

        .user-name {
          font-size: 40rpx;
          color: #fff;
          margin: 20rpx 0;
        }

        .user-scholl {
          // width: 184rpx;
          padding: 0 15rpx;
          height: 48rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 48rpx;
          font-size: 24rpx;
          color: #ffffff;
          background-color: rgba(255, 255, 255, 0.3);
        }
      }
    }

    .user-level {
      height: 100rpx;
      width: 702rpx;
      margin: 0 auto;
      position: relative;

      .bg_level {
        position: absolute;
        z-index: -1;

        .level-img {
          width: 702rpx;
          height: 140rpx;
        }
      }

      .level-info {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 100%;
        padding: 0 30rpx;

        .level-data {
          margin-left: 20rpx;

          .level-jy {
            color: #8d5710;
            margin: 10rpx 0;
            font-size: 24rpx;
            line-height: 40rpx;
            font-weight: 600;
          }
        }
      }
    }

    .user-tab {
      padding: 20rpx 0;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .tab-item {
        .icon {
          width: 100rpx;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .label {
          text-align: center;
          font-size: 26rpx;
          color: #fff;
          margin: 10rpx 0;
        }
      }
    }
  }
}

.content {
  position: relative;
  z-index: 100;
  /* #ifdef MP-WEIXIN */
  top: -20rpx;
  /* #endif */
  /* #ifndef MP-WEIXIN */
  top: -80rpx;
  /* #endif */
  z-index: 100;
  height: 180rpx;
  width: 100%;
  border-radius: 20rpx 20rpx 0 0;
  background-color: #fff;

  .tab-title {
    height: 120rpx;
  }

  .message-card {
    width: 720rpx;
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
            .name {
              font-weight: bold;
              font-size: 28rpx;
            }

            .time {
              font-size: 22rpx;
            }
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
      gap: 5rpx;
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
        // width: 80rpx;
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
}

.message-list {
  .message-item {
    display: flex;
    padding: 20rpx 20rpx;
    border-bottom: 1rpx solid #f8f8f8;

    .message-avatar {
      width: 90rpx;
    }

    .message-content {
      width: calc(100% - 90rpx);

      .user-data {
        .user-name {
          font-size: 28rpx;
          font-weight: bold;
        }

        .hint {
          font-size: 24rpx;
          color: #999999;
        }
      }

      .message-text {
        font-size: 28rpx;
        color: #333333;
        padding: 20rpx 0;
        line-height: 1.3;
      }

      .message-reply {
        display: flex;
        align-items: center;
        padding: 0 10rpx;
        height: 88rpx;
        background: #f6f7f9;
        border-radius: 10rpx 10rpx 10rpx 10rpx;

        .reply_text {
          color: #607fd0;
        }
      }
    }
  }
}

.footer-tag {
  color: #09121e;
  display: flex;
  background-color: #d2f4eb;
  padding: 5rpx 10rpx;
  align-items: center;
  justify-content: center;
  height: 47rpx;
  border-radius: 27rpx;
  font-size: 23rpx;

  .tag-location-icon {
    padding: 0 10rpx;
  }
}
</style>

<style>
page {
  background-color: #fff;
}
</style>
