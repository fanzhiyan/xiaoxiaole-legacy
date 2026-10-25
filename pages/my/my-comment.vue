<template>
  <y-layout>
    <y-empty icon="comment" title="暂未评论" v-if="DataList.length == 0"></y-empty>
    <view class="comment-list">
      <!-- @longpress="onLongPress(item)" -->
      <view class="comment-item" v-for="item in DataList" :key="item.id" style="position: relative">
        <view class="left">
          <u-avatar size="80rpx" :src="$y.oss(item?.user?.avatar)"></u-avatar>
        </view>
        <view class="right">
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
            <view class="original-post l-text-cut" @click="$u.route(`/pages/management/management-info?id=${item.grass.id}`)">{{ item.grass?.introduce }}</view>
          </view>
          <!-- <view class="header">
            <text class="username">{{ item.user.nickname }}</text>
            <text class="time">{{ item.create_time_text }}</text>
          </view>
          <view class="content" @click="$u.route(`/pages/management/management-info?id=${item.grass.id}`)">
            评论了帖子
            <text style="color: #000; width: 400rpx" class="ow-break">{{ item?.grass?.introduce }}</text>
          </view>
          <view class="detail-content">
            <view>{{ item.show_content }}</view>
            <view class="images" v-if="item.show_images.length != 0">
              <up-image width="140rpx" height="140rpx" v-for="url in item.show_images" :src="$y.oss(url)" mode=""></up-image>
            </view>
          </view> -->

          <view v-if="longPressId === item.id" class="delete-popover">
            <view class="delete-btn" @click="onDelete(item)">删除评论</view>
          </view>
        </view>
      </view>
    </view>
  </y-layout>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive, computed, ref } from "vue";
import shiba from "@/shiba";
const topic_id = computed(() => shiba.$store("app").user_topic_id);
const { isComplete, DataList, reset } = shiba.$hook.useGetList(shiba.$api.api.GetMyComment, {
  manual: true,
  params: () => {
    return {
      topic_id: topic_id.value,
    };
  },
});
const longPressId = ref(null);
function onLongPress(item) {
  longPressId.value = item.id;
}
function hideDelete() {
  longPressId.value = null;
}
async function onDelete(item) {
  await shiba.$api.api.delComment({
    topic_id: topic_id.value,
    type: item.type,
    item_id: item.item_id,
  });
  uni.showToast({ title: "删除成功" });
  hideDelete();
  reset();
}
onLoad(() => {
  reset();
});
</script>

<style lang="scss" scoped>
.comment-list {
  .comment-item {
    border-bottom: 1rpx solid #f8f8f8;
    display: flex;
    background-color: #fff;
    padding: 20rpx;
    border-radius: 12rpx;
    position: relative;
    .left {
      margin-right: 20rpx;

      .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
      }
    }

    .right {
      width: calc(100% - 100rpx);
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
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10rpx;

        .username {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
        }

        .time {
          font-size: 24rpx;
          color: #999;
        }
      }

      .content {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 10rpx;
      }

      .detail-content {
        font-size: 26rpx;
        color: #999;
        background-color: #f5f5f5;
        padding: 16rpx;
        border-radius: 8rpx;
      }
    }
  }
}
.delete-popover {
  position: absolute;
  top: 0rpx;
  right: 20rpx;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 90%;
  .delete-btn {
    color: #fff;
    background: #fff;
    height: 76rpx;
    width: 176rpx;
    border-radius: 16rpx;
    font-size: 26rpx;
    color: #333;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &::before {
    content: "";
    position: absolute;
    bottom: 100%; // 让三角在按钮上方
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 16rpx solid transparent;
    border-right: 16rpx solid transparent;
    border-bottom: 16rpx solid #fff; // 朝上，颜色和按钮一致
  }
}
</style>
