<template>
  <up-navbar :placeholder="true" auto-back>
    <template #center>
      <view class="" style="display: flex">
        <view>我的消息</view>
        <view>
          <u-icon name="edit-pen" size="40rpx"></u-icon>
        </view>
      </view>
    </template>
  </up-navbar>
  <y-empty title="暂无集市" v-if="Notification.length == 0"></y-empty>
  <view class="message-list">
    <view class="message-item" v-for="item in Notification" :key="item.id">
      <view class="message-avatar">
        <u-avatar size="72rpx" :src="$y.oss(item?.user?.avatar)"></u-avatar>
      </view>
      <view class="message-content">
        <view class="user-data">
          <view class="user-name">{{ item.user.nickname }}</view>
          <view class="hint">{{ item.text }} {{ item.create_time_text }}</view>
        </view>
        <view class="message-text">{{ item.grass.title }}</view>
        <view class="message-reply" v-if="item.type == 'reply'">
          <text class="reply_text"></text>
          <text>
            <up-parse :content="replaceEmojisWithImages(item.reply?.content || '')"></up-parse>
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import shiba from "../../shiba";
import { onLoad, onReachBottom, onShow } from "@dcloudio/uni-app";
import emojio from "@/shiba/utils/emjio";
const user = computed(() => shiba.$store("user").user);

// 转化emjio
function replaceEmojisWithImages(text) {
  // 创建一个从alt到url的映射对象
  const emojiMap = emojio.reduce(
    (acc, { url, alt }) => ({
      ...acc,
      [alt]: `<img class='emoji_img' width='25rpx' height='25rpx' src='${uni.$y.oss(`/uploads/emojis/${url}`)}' alt="${alt}" />`,
    }),
    {}
  );

  // 使用正确的正则表达式查找所有的表情符号，并用replace方法替换它们
  const result = text.replace(/\[(.*?)\]/g, (match, p1) => {
    const replacement = emojiMap[`[${p1}]`] || match;
    return replacement;
  });

  console.log(result, "resultresult");
  return result;
}
// 获取消息
let Notification = ref([]);
let noticePage = 1;
const GetNotification = async () => {
  const res = await shiba.$api.api.GetNotification({
    type: 2,
    page: noticePage,
  });
  res.data.data.map((items) => {
    Notification.value.push(items);
  });
};
onLoad(() => {
  GetNotification();
});
onReachBottom(() => {
  noticePage++;
  GetNotification();
});
</script>

<style lang="scss" scoped>
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
        min-height: 88rpx;
        background: #f6f7f9;
        border-radius: 10rpx 10rpx 10rpx 10rpx;

        .reply_text {
          color: #607fd0;
        }
      }
    }
  }
}
</style>
<style>
page {
  background-color: #fff;
}
</style>
