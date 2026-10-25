<template>
  <y-layout>
    <!-- 官方 -->
    <view class="gap">官方</view>
    <view class="user-list">
      <y-empty title="暂无数据" v-if="state.official.length == 0" icon="data"></y-empty>
      <view class="user-item" v-for="item in state.official">
        <view class="avatar"><u-avatar :src="$y.oss(item.user.avatar)" size="80rpx" shape="squre"></u-avatar></view>
        <view class="user-info">
          <view class="user-name text-cut1-1">{{ item.user.nickname }}</view>
          <view class="user-sub text-cut1-1">{{ item.level_text }}</view>
        </view>
      </view>
    </view>
    <!-- 管理员 -->
    <view class="gap">管理员</view>
    <view class="user-list">
      <view class="user-item" v-for="item in state.admin">
        <view class="avatar"><u-avatar :src="$y.oss(item.user.avatar)" size="80rpx" shape="squre"></u-avatar></view>
        <view class="user-info">
          <view class="user-name text-cut1-1">{{ item.user.nickname }}</view>
          <view class="user-sub text-cut1-1">{{ item.user.bio }}</view>
        </view>
      </view>
      <y-empty title="暂无管理员" v-if="state.admin.length == 0" icon="data"></y-empty>
    </view>
    <!-- 成员 -->
    <view class="gap">成员</view>
    <view class="user-list">
      <y-empty title="暂无成员" v-if="state.member.length == 0" icon="data"></y-empty>
      <view class="user-item" v-for="item in state.member">
        <view class="avatar"><u-avatar :src="$y.oss(item?.user?.avatar)" size="80rpx" shape="squre"></u-avatar></view>
        <view class="user-info">
          <view class="user-name text-cut1-1">{{ item?.user?.nickname }}</view>
          <view class="user-sub text-cut1-1">{{ item?.user?.bio }}</view>
        </view>
      </view>
    </view>
  </y-layout>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import shiba from "@/shiba";
const appStore = computed(() => shiba.$store("app").user_topic_id);
onLoad(() => {
  GrassTopicFriend();
});
let page = 1;
onReachBottom(() => {
  page++;
  GrassTopicFriend();
});

let state = reactive({
  admin: [],
  member: [],
  official: [],
});
const GrassTopicFriend = async () => {
  const res = await shiba.$api.public.GrassTopicFriend({
    topic_id: appStore.value,
    page: page,
  });
  if (page == 1) {
    state.admin = res.data.admin;
    state.official = res.data.official;
  }
  if (page) {
    res.data.member.data.map((items) => {
      state.member.push(items);
    });
  }
};
</script>

<style lang="scss" scoped>
.gap {
  height: 68rpx;
  background: #ededed;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
}

.user-list {
  padding: 0 30rpx;

  .user-item:last-child {
    .user-info {
      border-bottom: none !important;
    }
  }

  .user-item {
    min-height: 120rpx;
    background-color: #fff;
    display: flex;
    align-items: center;

    .avatar {
    }

    .user-info {
      border-bottom: 1rpx solid #eeeeee;
      margin: 0 20rpx;
      width: calc(100% - 80rpx);

      .user-sub {
        font-size: 23rpx;
        color: #666;
        height: 50rpx;
        line-height: 50rpx;
      }

      .user-name {
        font-size: 28rpx;
        color: #333;
        height: 70rpx;
        line-height: 70rpx;
        font-weight: bold;
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
