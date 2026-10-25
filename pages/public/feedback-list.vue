<template>
  <y-layout>
    <view>
      <u-gap height="20rpx" bgColor="#f3f3f3"></u-gap>
      <y-empty title="反馈记录不存在" v-if="list.length == 0"></y-empty>
      <view class="feedback-list">
        <view class="feedback-item" v-for="item in list">
          <view class="user">
            <view class="user-avatar">
              <u-avatar size="40rpx" :src="$y.oss(item?.avatar)"></u-avatar>
            </view>
            <view class="user-name">{{ item.nickname }}</view>
          </view>
          <view class="feedback-item-content">
            <view class="cause">
              {{ item.content }}
            </view>
            <view class="cause-imgs grid col-4 margin-top-xs" v-if="item.oss.length != 0">
              <view @click="$y.previewImages($y.oss(items))" class="img-item" v-for="items in item.oss">
                <u-image width="120rpx" height="120rpx" :src="$y.oss(items)" mode=""></u-image>
              </view>
            </view>
            <view class="causer-type">反馈类型： {{ item.type }}</view>
            <view class="causer-time">反馈时间：{{ $u.timeFormat(item.createtime, "yyyy年mm月dd日") }}</view>
            <view class="causer-remark" v-if="item.reply">
              平台回复：
              <text class="remark">{{ item.reply }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </y-layout>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import shiba from "@/shiba";
import { onLoad } from "@dcloudio/uni-app";
import { isEmpty } from "@/shiba/rules";
const { DataList } = shiba.$hook.useGetList(shiba.$api.api.GetFeedbackList);
const list = ref([]);
watch(
  () => DataList.value,
  (newValue) => {
    console.log(newValue, "newValue");
    if (newValue.length != 0) {
      list.value = newValue.map((item) => {
        return {
          ...item,
          oss: item.images?.split(",")?.filter((it) => it != "") || [],
        };
      });
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style lang="scss" scoped>
.feedback-list {
  .feedback-item {
    border-bottom: 1rpx solid #f3f3f3;
    padding-bottom: 20rpx;

    .user {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 20rpx;
      height: 70rpx;
    }

    .user-avatar {
      width: 70rpx;
    }

    .user-name {
      font-weight: bold;
    }

    background: #ffffff;

    .feedback-item-content {
      margin-left: 90rpx;
      width: 644rpx;

      .cause {
        font-weight: 500;
        font-size: 25rpx;
        color: #1c1c1c;
      }

      .causer-remark {
        padding: 0 20rpx;
        box-sizing: border-box;
        height: 70rpx;
        line-height: 70rpx;
        background: #f7f7f7;
        font-weight: 500;
        font-size: 21rpx;
        color: #42cfbc;
        border-radius: 6rpx;

        .remark {
          color: #454545;
        }
      }

      .causer-time,
      .causer-type {
        line-height: 40rpx;
        font-size: 21rpx;
        font-weight: 500;
        color: #333 !important;
      }
    }
  }
}

.form {
  padding: 20rpx;
  margin: 20rpx auto;
  width: 709rpx;
  height: 1022rpx;
  background: #ffffff;
  box-shadow: 0rpx 7rpx 20rpx 0rpx rgba(194, 199, 208, 0.1);
  border-radius: 13rpx;

  .form-title {
    height: 90rpx;
    line-height: 90rpx;
    font-size: 30rpx;
  }

  .form-imgs {
    padding: 20rpx 0;
  }

  .form-tag {
    display: flex;
    flex-wrap: wrap;

    .tag-item {
      text-align: center;
      margin: 10rpx 5rpx;
      padding: 0 10rpx;
      font-size: 22rpx;
      min-width: 140rpx;
      height: 53rpx;
      line-height: 53rpx;
      background: #f1f1f1;
      border-radius: 7rpx;
    }
  }
}
.cause-imgs {
  margin: 20rpx 0;
}
</style>

<style>
page {
  background-color: #fff;
}
</style>
