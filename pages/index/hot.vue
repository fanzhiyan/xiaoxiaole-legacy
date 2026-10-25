<template>
  <view>
    <up-navbar title="多校热门" :placeholder="true" left-icon=""></up-navbar>
    <view class="swiper-banners">
      <u-image width="710rpx" height="300rpx" :src="$y.oss(System.school_image)" mode="aspectFit"></u-image>
    </view>
    <view class="content">
      <view class="title">精选热榜</view>
      <view class="top-item" v-for="item in DataList" @click="$u.route(`/pages/management/management-info?id=${item.grass_id}`)">
        <view class="user">
          <view class="user-avatar">
            <u-avatar size="64rpx" :src="$y.oss(item.icon)"></u-avatar>
          </view>
          <view class="user-content">
            <view class="name">{{ item.name }}</view>
            <view class="sub-name">{{ item.create_time_text }}</view>
          </view>
        </view>
        <view class="top-row">
          <view class="hint-text">{{ item.title }}</view>
          <view class="num">
            <u-image width="22.19rpx" height="27rpx" src="/static/icon/public/hots.png" mode="aspectFit"></u-image>
            {{ item.hot_num }}
          </view>
        </view>
      </view>
    </view>
    <y-empty title="暂无内容" v-if="DataList.length == 0"></y-empty>
    <y-tabbar></y-tabbar>
  </view>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import shiba from "@/shiba";
const System = computed(() => shiba.$store("app").System);
onLoad(() => {
  getList();
});
const { DataList } = shiba.$hook.useGetList(shiba.$api.public.GetDayHot);
</script>
<style lang="scss" scoped>
.swiper-banners {
  width: 710rpx;
  margin: 0 auto;
  height: 340rpx;
}

.content {
  padding: 0 20rpx;

  .title {
    height: 70rpx;
    line-height: 70rpx;
    font-weight: bold;
    color: #333333;
    font-size: 36rpx;
  }

  .top-item {
    min-height: 196rpx;
    border-bottom: 1rpx solid #eeeeee;

    .user {
      display: flex;
      align-items: center;
      min-height: 130rpx;

      .user-avatar {
        width: 80rpx;
      }

      .user-content {
        .name {
          color: #333;
          font-size: 25rpx;
          margin-bottom: 5rpx;
          margin-bottom: 10rpx;
        }

        .sub-name {
          color: #a7a7a7;
          font-size: 22rpx;
          font-weight: 400;
        }
      }
    }

    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .hint-text {
        // font-weight: bold;
        font-size: 30rpx;
        color: #333333;
      }

      .num {
        display: flex;
        width: 120rpx;
        justify-content: center;
        gap: 5rpx;
        flex-shrink: 0;
        font-weight: bold;
        font-size: 24rpx;
        color: #f26418;
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
