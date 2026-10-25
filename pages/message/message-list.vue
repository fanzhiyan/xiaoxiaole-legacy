<template>
  <view>
    <up-navbar autoBack :placeholder="true" :title="state.apiTypeText"></up-navbar>
    <view class="container">
      <view class="message-list">
        <!-- 点赞消息 -->
        <template v-if="state.type === 'like'">
          <view v-for="(item, index) in DataList" @click="routeMessage(item)" :key="index" class="like-item">
            <view class="user-info">
              <up-avatar class="avatar" :src="$y.oss(item.user.avatar) || '/static/default-avatar.png'" width="70rpx" height="70rpx" mode="aspectFill"></up-avatar>
              <view class="info">
                <view class="username">
                  <view class="nickname l-text-cut">
                    {{ item.user.nickname || "用户" }}
                  </view>
                  <view class="time">{{ $u.timeFormat(item.create_time, "yyyy-mm-dd hh:MM") }}</view>
                </view>
                <view class="message-content">
                  <view v-if="item.type != 'likes'" class="comment l-text-cut">{{ item.show_content }}</view>
                  <view class="images" v-if="item.show_images.length != 0 && item.type != 'likes'">
                    <up-image width="140rpx" height="140rpx" v-for="url in item.show_images" :src="$y.oss(url)" mode=""></up-image>
                  </view>
                  <view class="comment l-text-cut" v-if="item.type == 'likes'">{{ item.text }}</view>
                  <view class="original-post l-text-cut">{{ item.grass?.introduce }}</view>
                </view>
              </view>
            </view>
          </view>
        </template>

        <!-- 订单消息 -->
        <template v-else-if="state.type === 'order'">
          <view v-for="(item, index) in DataList" @click="goToOrderDetail(item)" :key="index" class="order-item">
            <view class="order-title">{{ item.title }}</view>
            <view class="order-time">{{ $u.timeFormat(item.create_time, "yyyy-mm-dd") }}</view>
            <view class="order-desc-card">
              <view class="order-desc">{{ item.content }}</view>
            </view>
          </view>
        </template>

        <!-- 佣金到账 -->
        <template v-else-if="state.type === 'payment'">
          <view v-for="(item, index) in DataList" :key="index" class="payment-item">
            <view class="payment-lable">
              <view class="label">{{ item.title }}</view>
              <view class="label_text">{{ $u.timeFormat(item.create_time, "yyyy-mm-dd hh:MM:ss") }}</view>
            </view>
            <view class="payment-value">
              {{ item.content }}
            </view>
          </view>
        </template>

        <!-- 加载更多 -->
        <u-loadmore
          v-if="DataList.length > 0"
          :status="isLoading ? 'loading' : isComplete ? 'nomore' : 'loadmore'"
          :loading-text="'加载中...'"
          :loadmore-text="'点击或上拉加载更多'"
          :nomore-text="'没有更多数据了'" />

        <!-- 空状态 -->
        <y-empty v-if="DataList.length === 0" icon="data" title="暂无消息"></y-empty>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad, onReachBottom, onPullDownRefresh } from "@dcloudio/uni-app";
import { reactive, ref, computed } from "vue";
import shiba from "@/shiba";
const topic_id = computed(() => shiba.$store("app").user_topic_id);
const state = reactive({
  apiType: "2",
  apiTypeText: "",
});

// 使用 useGetList hook 获取消息列表，设置 manual: true 实现手动控制
const { DataList, isLoading, isComplete, reset, GetData } = shiba.$hook.useGetList(shiba.$api.api.getNotification, {
  manual: true, // 添加手动控制参数
  params: () => {
    return {
      type: state.apiType,
      limit: 30,
      topic_id: topic_id.value,
    };
  },
});

// 跳转到订单详情
const goToOrderDetail = (item) => {
  // pages/management/errand-info?id=327&action=look&=
  uni.$u.route({
    url: "/pages/management/errand-info",
    params: {
      id: item.item_id,
    },
  });
};

// 初始化
onLoad((option) => {
  // 根据路由类型设置 API 类型
  switch (option.type) {
    case "like":
      state.apiType = "2";
      state.apiTypeText = "收到点赞/评论";
      break;
    case "order":
      state.apiType = "3";
      state.apiTypeText = "订单消息";
      break;
    case "payment":
      state.apiType = "4";
      state.apiTypeText = "佣金到账";
      break;
  }
  state.type = option.type;
  // 手动调用获取数据
  reset();
});

// 下拉刷新
onPullDownRefresh(() => {
  reset();
});
const routeMessage = (item) => {
  uni.$u.route({
    url: "/pages/management/management-info",
    params: {
      id: item?.grass.id,
    },
  });
};

// 上拉加载
onReachBottom(() => {
  if (!isComplete.value && !isLoading.value) {
    GetData();
  }
});
</script>

<style lang="scss" scoped>
// 点赞消息样式
.like-item {
  background: #fff;
  padding: 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
  transition: background-color 0.2s;

  &:active {
    background-color: #f9f9f9;
  }

  .user-info {
    display: flex;
    gap: 20rpx;
    align-items: flex-start;

    .avatar {
      width: 70rpx;
      height: 70rpx;
      border-radius: 50%;
      flex-shrink: 0;
      border: 2rpx solid #f5f5f5;
    }

    .info {
      flex: 1;
      overflow: hidden;

      .username {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12rpx;

        .nickname {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
          max-width: 60%;
        }

        .time {
          font-size: 24rpx;
          color: #999;
        }
      }

      .message-content {
        .images {
          display: flex;
          flex-wrap: wrap;
          gap: 12rpx;
          margin: 10rpx 0;
        }
        .comment {
          font-size: 28rpx;
          color: #333;
          line-height: 1.5;
          margin-bottom: 12rpx;
          padding-right: 20rpx;
        }

        .original-post {
          font-size: 26rpx;
          color: #666;
          line-height: 1.5;
          background: #f8f9fc;
          padding: 16rpx;
          border-radius: 8rpx;

          &::before {
            content: "原帖：";
            color: #999;
          }
        }
      }
    }
  }
}

// 订单消息样式
.order-item {
  border-bottom: 1rpx solid #f7f8fc;
  padding: 10rpx 20rpx;
  background: #fff;
  margin-bottom: 20rpx;
  border-radius: 12rpx;

  .order-title {
    font-size: 30rpx;
    color: #222;
    font-weight: bold;
    margin-bottom: 8rpx;
  }

  .order-time {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 16rpx;
  }

  .order-desc-card {
    background: #f7f8fc;
    border-radius: 10rpx;
    padding: 18rpx 16rpx;

    .order-desc {
      font-size: 26rpx;
      color: #888;
      line-height: 1.7;
    }
  }
}

// 佣金到账样式
.payment-item {
  padding: 20rpx;
  background: #fff;
  padding: 20rpx;
  height: 140rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #f9f9f9;
  .payment-lable {
    .lable {
      color: #333333;
      font-weight: bold;
      font-size: 30rpx;
    }
    .label_text {
      font-size: 24rpx;
      line-height: 1.5;
      color: #999999;
    }
  }
  .payment-value {
    font-size: 32rpx;
    color: #e4350c;
    font-weight: bold;
  }
}

.container {
  background: #fff;
  min-height: 100vh;

  .message-list {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
<style>
page {
  background-color: #fff;
}
</style>
