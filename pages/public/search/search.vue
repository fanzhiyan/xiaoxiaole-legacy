<template>
  <y-layout>
    <up-sticky bg-color="#fff">
      <view class="tabs-content">
        <up-tabs
          @change="changeTab"
          lineHeight="12rpx"
          :lineColor="`url(../../../static/icon/vector_bg.png) 100% 100%`"
          :activeStyle="{ color: '#1673FE', fontSize: '36rpx', fontWeight: 'bold' }"
          :list="list"></up-tabs>
      </view>
      <view class="search">
        <u-search @search="searchChange"></u-search>
      </view>
    </up-sticky>
    <block v-if="state.id == 1">
      <y-empty title="暂无动态数据" v-if="Data.list.length == 0"></y-empty>
      <view class="message-card" v-for="item in Data.list">
        <view class="message-card__header">
          <view class="user-info">
            <view class="user-avatar">
              <y-avatar size="64rpx" :auth_status="item.user.auth_status" :src="$y.oss(item.user.avatar)"></y-avatar>
            </view>
            <view class="user-details">
              <view class="user-name">
                <view class="name">
                  {{ item?.user?.nickname }}
                </view>
                <view class="time">
                  {{ item.time }}
                </view>
              </view>
              <view class="user-level">
                <y-grade :level_img="item.user.level_img" :level_text="item.user.level_text"></y-grade>
              </view>
            </view>
          </view>
          <!-- <view class="more-options">
            <view class="opction-item">
            </view>
            <view class="opction-item">
              <text class="shiba-checkmore" @click="report(item)"></text>
            </view>
          </view> -->
        </view>
        <view class="message-content" @click="$u.route(`/pages/management/management-info?id=${item.id}`)">
          <text class="tag">{{ item.label_text }}</text>
          {{ item.title }}
        </view>
        <view class="media-gallery" v-if="item?.imageArray?.length == 0" @click="$u.route('/pages/management/management-info')">
          <u-image width="216rpx" height="226rpx" :src="$y.oss(items)" mode="aspectFit" v-for="items in item.imageArray"></u-image>
        </view>
        <view class="message-footer">
          <view class="meta-info">
            <view class="time-stamp">{{ item.time }}</view>
            <view class="viewer-count">{{ item.browses }}人围观</view>
          </view>
        </view>
      </view>
    </block>
    <block v-if="state.id == 2">
      <view class="message-card group_booking" v-for="item in Data.list" @click="$u.route(`/pages/management/group-info?id=${item.id}`)">
        <view class="message-card__header">
          <view class="user-info">
            <view class="user-avatar">
              <y-avatar size="64rpx" :auth_status="item.user.auth_status" :src="$y.oss(item.user.avatar)"></y-avatar>
            </view>
            <view class="user-details">
              <view class="user-name">
                <view class="name">
                  {{ item?.user?.nickname }}
                </view>
                <view class="time">
                  {{ item.time }}
                </view>
              </view>
              <view class="user-level">
                <y-grade :level_img="item.user.level_img" :level_text="item.user.level_text"></y-grade>
              </view>
            </view>
          </view>
        </view>
        <view class="message-content">
          <text class="tag">{{ item?.grass_team_type?.name }}</text>
          {{ item.title }}
        </view>
        <view class="media-gallery">
          <u-image width="216rpx" height="226rpx" :src="$y.oss(img)" mode="aspectFit" v-for="img in item.images"></u-image>
        </view>
        <view class="message-footer">
          <view class="group-booking">
            <view class="label">{{ item.remain_number }}</view>
            <scroll-view scroll-x="true" :show-scrollbar="false" class="user-list">
              <view class="avatar-list-row">
                <u-avatar size="33rpx" :src="$y.oss(userTrem?.user?.avatar)" v-for="userTrem in item.treamList"></u-avatar>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
    </block>
    <block v-if="state.id == 3">
      <view class="message-card message-card-errand" v-for="item in Data.list">
        <view class="message-card__header">
          <view class="user-info">
            <view class="user-avatar">
              <y-avatar :auth_status="item.user.auth_status" :src="$y.oss(item?.user?.avatar)" size="64rpx"></y-avatar>
            </view>
            <view class="user-details">
              <view class="user-name">
                <view class="name">
                  {{ item?.user?.nickname }}
                </view>
                <view class="time">
                  {{ item.time }}
                </view>
              </view>
              <view class="user-level">
                <y-grade :level_img="item.user.level_img" :level_text="item.user.level_text"></y-grade>
              </view>
            </view>
          </view>
        </view>
        <view class="message-content" @click="$u.route(`/pages/management/errand-info?id=${item.id}`)">
          {{ item.content }}
        </view>

        <view class="message-footer">
          <view class="price-content">
            <text class="tips">佣金</text>
            <text class="l-price price">{{ item.price }}</text>
          </view>
        </view>
      </view>
    </block>
  </y-layout>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import shiba from "@/shiba";
const appStore = computed(() => shiba.$store("app").user_topic_id);
let list = ref([
  {
    id: 1,
    name: "动态",
  },
  {
    id: 2,
    name: "组局",
  },
  {
    id: 3,
    name: "跑腿",
  },
]);
let state = reactive({
  id: 1,
  type: "",
  page: 1,
  limit: 10,
  keyword: "",
});
const changeTab = (item) => {
  state.id = item.id;
  state.page = 1;
  Data.list = [];
  LoadData();
};
onLoad(() => {
  LoadData();
});

// 获取圈子动态

const searchChange = (key) => {
  state.keyword = key;
  state.page = 1;
  Data.list = [];
  LoadData();
};

let Data = reactive({
  list: [],
});
const LoadData = async () => {
  // 根据当前 分类id请求不同数据
  if (state.id == 1) {
    const res = await shiba.$api.public.GetGrassInfo({
      ...state,
      topic_id: appStore.value,
    });
    res.data.data.forEach((item) => {
      Data.list.push(item);
    });
  }
  if (state.id == 2) {
    const res = await shiba.$api.public.GrassTeamList({
      ...state,
      topic_id: appStore.value,
    });
    res.data.data.map((ii) => {
      let tream = new Array(ii.number);
      ii.team_user.map((items, index) => {
        tream[index] = items || {};
      });
      console.log(tream, "tream");
      Data.list.push({
        ...ii,
        images: ii.images.split(",").filter((item) => item != ""),
        // 等几人根据 numebr循环
        treamList: tream,
      });
    });
  }
  if (state.id == 3) {
    const res = await shiba.$api.public.GrassRunErrands({
      ...state,
      topic_id: appStore.value,
    });
    res.data.data.forEach((item) => {
      Data.list.push(item);
    });
  }
};
</script>

<style lang="scss" scoped>
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

.tabs-content {
  padding: 10rpx 0;
}

.search {
  padding: 20rpx;
}

.search-content {
  .message-item {
    min-height: 150rpx;
    border-bottom: 1rpx solid #eee;
    padding: 10rpx 20rpx;

    .message-title {
    }

    .message-content {
      margin: 10rpx 0;
      height: 90rpx;
      line-height: 30rpx;
      font-size: 28rpx;
    }

    .message-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40rpx;
    }
  }
}
.media-gallery {
  gap: 10rpx;
  display: flex;
  flex-wrap: wrap;
}

// 拼团
.group_booking {
  .message-footer {
    justify-content: flex-end;
  }

  .group-booking {
    width: 242rpx;
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
      width: 140rpx;

      .avatar-list-row {
        display: flex;
        gap: 15rpx;
      }
    }
  }

  .group-list {
    width: 192rpx;
    height: 48rpx;
    background: #fec93a;
    border-radius: 24rpx 24rpx 24rpx 24rpx;
  }
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
</style>
<style>
page {
  background-color: #fff;
}
</style>
