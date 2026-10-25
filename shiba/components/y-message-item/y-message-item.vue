<template>
  <view class="message-item-card">
    <!-- 置顶 -->
    <view class="top" v-if="is_top === 1">
      <up-image width="72rpx" height="72rpx" src="/static/icon/top.png" mode="aspectFit"></up-image>
    </view>
    <view class="messages-avatar">
      <y-avatar :is_official="is_official" :auth_status="auth_status" :src="$y.oss(avatar)"></y-avatar>
    </view>
    <view class="messages-content">
      <view class="user-info">
        <view class="user-nickname l-text-cut">{{ nickname }}</view>
        <view class="user-time">{{ $u.timeFormat(time,'yyyy-mm-dd hh:MM' ) }}</view>
      </view>
      <view class="message-info">
        <view class="message-desc">
          <text class="message-text">{{ content }}</text>
        </view>
        <view class="message-imgs" v-if="displayImgs.length > 0">
          <view 
            v-for="(img, idx) in displayImgs" 
            :key="idx" 
            class="img-wrapper"
            :class="{ 'last-img': idx === 2 && hasMoreImages }"
          >
            <up-image 
              :src="$y.oss(img)" 
              width="190rpx" 
              height="190rpx" 
              mode="aspectFill" 
              radius="5"
            ></up-image>
            <!-- 剩余数量遮罩 -->
            <view v-if="idx === 2 && hasMoreImages" class="remaining-count">
              剩余{{ remainingCount }}张
            </view>
          </view>
        </view>
      </view>
      <!-- 标签 -->
      <view class="message-footer">
        <view class="message-tag">#{{ tag }}</view>
        <view class="message-actions">
          <view class="message-action">
            <up-image width="24rpx" height="24rpx" src="/static/icon/message-chat-eye.png"></up-image>
            {{ browses }}
          </view>
          <view class="message-action" :class="{ active: state.is_like == 1 }" @click="TapLikes">
            <up-image width="24rpx" height="24rpx" src="/static/icon/message-chat-thumbs.png"></up-image>

            {{ likes }}
          </view>
          <view class="message-action">
            <up-image width="24rpx" height="24rpx" src="/static/icon/message-chat-msg.png"></up-image>
            {{ comments }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, watch, ref, computed } from "vue";
import shiba from "../..";

const props = defineProps({
  avatar: {
    type: String,
    default: "",
  },
  time: {
    type: String,
    default: "",
  },
  nickname: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
  browses: {
    type: Number,
    default: 0,
  },
  tag: {
    type: String,
    default: "",
  },

  is_official: {
    type: Number,
    default: -1,
  },
  comments: {
    type: Number,
    default: 0,
  },
  is_like: {
    type: Number,
    default: 0,
  },
  grass_id: {
    type: Number,
    default: 0,
  },

  likes: {
    type: Number,
    default: 0,
  },

  is_top: {
    type: Number,
    default: 0,
  },
  imgs: {
    type: String,
    default: "",
  },
  auth_status: {
    type: Number,
    default: -1,
  },
  item: {
    type: Object,
    default: () => ({
      avatar: "",
      nickname: "猪猪侠",
      time: "2022-12-21",
      content: "大山地啊搜到就怕搜",
      imgs: [],
      tag: "学习类",
      views: 0,
      likes: 0,
      comments: 0,
    }),
  },
});
let state = reactive({
  is_like: "",
});
watch(
  () => props.is_like,
  (newValue) => {
    state.is_like = newValue;
    console.log(newValue, "newValue");
  },
  {
    deep: true,
    immediate: true,
  }
);

const imgArr = ref([]);

watch(
  () => props.imgs,
  (newImgs) => {
    imgArr.value = newImgs ? newImgs.split(",") : [];
  },
  { immediate: true }
);

// 计算属性：显示的图片数组（最多3张）
const displayImgs = computed(() => {
  return imgArr.value.slice(0, 3);
});

// 计算属性：是否有更多图片
const hasMoreImages = computed(() => {
  return imgArr.value.length > 3;
});

// 计算属性：剩余图片数量
const remainingCount = computed(() => {
  return imgArr.value.length - 3;
});

const TapLikes = async () => {
  const res = await shiba.$api.api.likeGrass({
    grass_id: props.grass_id,
  });
  state.is_like = state.is_like == 1 ? 0 : 1;
  console.log(res);
};
</script>

<style lang="scss" scoped>
.message-item-card {
  width: 750rpx;
  min-height: 120rpx;
  background: #fff;
  border-radius: 16rpx;
  display: flex;
  flex-direction: row;
  padding: 12rpx 24rpx;
  margin-bottom: 24rpx;
  position: relative;
  border-bottom: 1rpx solid #f7f8fc;
  .top {
    right: 0;
    top: 0;
    position: absolute;
  }

  .messages-avatar {
    margin-right: 24rpx;
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    width: 60rpx;
  }

  .messages-content {
    width: calc(100% - 60rpx);
    .user-info {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 26rpx;
      color: #333;
      height: 64rpx;
      margin-bottom: 8rpx;
      justify-content: space-between;
      .user-nickname {
        font-weight: bold;
        margin-right: 16rpx;
        font-size: 28rpx;
        color: #333333;
        font-weight: 600;
        width: 400rpx;
        line-height: 64rpx;
      }

      .user-time {
		  flex-shrink: 0;
        color: #999;
        font-size: 24rpx;
      }
    }

    .message-info {
      margin-bottom: 12rpx;

      .message-desc {
        font-size: 28rpx;
        color: #222;
        margin-bottom: 12rpx;
        line-height: 1.6;

        .message-text {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4; /* 大约140字左右，按照每行35字计算 */
          line-clamp: 4;
          -webkit-box-orient: vertical;
        }
      }

      .message-imgs {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 12rpx;

        .img-wrapper {
          position: relative;
          border-radius: 8rpx;
          overflow: hidden;

          up-image {
            border-radius: 8rpx;
            overflow: hidden;
          }

          &.last-img {
            up-image {
              filter: brightness(0.6);
            }
          }

          .remaining-count {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            color: #fff;
            font-size: 24rpx;
            font-weight: bold;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 8rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.5);
            z-index: 2;
          }
        }
      }
    }

    .message-footer {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      .message-tag {
        color: #aaa;
        font-size: 22rpx;
        // background: #f0f6ff;
        border-radius: 8rpx;
        padding: 2rpx 12rpx;
        margin-right: 16rpx;
      }

      .message-actions {
        display: flex;
        flex-direction: row;
        gap: 14rpx;

        .message-action {
          display: flex;
          align-items: center;
          font-size: 22rpx;
          color: #999;
          gap: 20rpx;

          up-image {
            vertical-align: middle;
            margin-right: 4rpx;
          }
        }

        .active {
          color: #e34c4c; // 红色
          filter: brightness(0) saturate(100%) invert(32%) sepia(99%) saturate(7492%) hue-rotate(349deg) brightness(97%) contrast(101%);
        }
      }
    }
  }
}
</style>
