<template>
  <y-layout>
    <view class="content">
     
      <y-empty v-if="list.length == 0" title="暂无今日热门"></y-empty>
      <view class="hot-list">
        <view class="hot-item" v-for="(item, index) in list" @click="$u.route(`/pages/management/management-info?id=${item.id}`)">
          <view class="num">{{ index + 1 }}</view>
          <view class="title text-cut-1">{{ item.title }}</view>
          <view class="circusee">
            <u-image width="22.19rpx" height="27rpx" src="/static/icon/public/hots.png" mode="aspectFit"></u-image>
            {{ item.hot_num }}
          </view>
        </view>
      </view>
    </view>
  </y-layout>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import shiba from "@/shiba";
import { computed, ref } from "vue";
const System = computed(() => shiba.$store("app").System);
const appStore = computed(() => shiba.$store("app").user_topic_id);
onLoad(() => {
  GetHot();
});
let list = ref([]);
const GetHot = async () => {
  const res = await shiba.$api.public.GetDayHot({
    topic_id: appStore.value,
  });
  list.value = res.data;
};
</script>

<style lang="scss" scoped>
.content {
  .swiper-img {
    height: 334rpx;
    width: 750rpx;
  }

  .hot-list {
    padding: 10rpx 20rpx;

    .hot-item {
      margin: 10rpx 0;
      border-radius: 10rpx;
      height: 88rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10rpx;
      background: linear-gradient(to right, rgba(255, 177, 132, 0.3), rgba(255, 177, 132, 0.1));

      .title {
        width: 550rpx;

        font-size: 28rpx;
        color: #333333;
      }

      .circusee {
        color: #e89700;
        font-size: 26rpx;
        display: flex;
        gap: 10rpx;
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
