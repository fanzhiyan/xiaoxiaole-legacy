<template>
  <y-layout :coustom="true">
    <up-navbar title="关键词" :placeholder="true" :auto-back="true">
      <template #center>
        <view class="">
          <u-search @search="getList" :show-action="false"></u-search>
        </view>
      </template>
    </up-navbar>

    <view class="cat-tab">
      <view class="tab-item" @click="$u.route('/pages/public/create-circle')">
        <up-image width="42rpx" height="42rpx" src="/static/icon/icon-add.png" mode="aspectFit"></up-image>
        创建圈子
      </view>
      <view class="tab-item" @click="$u.route('/pages/public/switch')">
        <up-image width="42rpx" height="42rpx" src="/static/icon/icon-location.png" mode="aspectFit"></up-image>
        圈子广场
      </view>
    </view>
    <view class="card">
      <view class="card-title">
        <u-image width="38.1rpx" height="32rpx" src="/static/icon/icon-user.png" mode="aspectFit"></u-image>
        我加入的圈子
      </view>
      <view class="card-list">
        <y-empty mode="content" width="700rpx" title="暂未加入任何圈子" v-if="list.length == 0"></y-empty>
        <view class="card-item" v-for="item in list">
          <view class="card-item-header">
            <view class="logo" @click="checkTopic(item)">
              <!-- :class="{ self: item.is_self == 1 }" -->
              <u-image radius="10" width="154rpx" height="154rpx" :src="$y.oss(item.icon)" mode="aspectFit"></u-image>
              <view class="self-text" v-if="item.is_self == 1">
                <!-- 先判断status '审核状态：0.待审核，1.审核通过，2.审核驳回' -->
                {{ item.status == 0 ? "审核中" : item.status == 1 ? "我创建的" : "审核驳回" }}
              </view>
            </view>
            <view class="all-icon" @click="checkAction(item)">
              <u-image width="50rpx" height="50rpx" src="/static/icon/icon-all.png" mode="aspectFit"></u-image>
            </view>
          </view>
          <view class="card-item__details" @click="checkTopic(item)">
            <view class="card-item__title l-cut-1">{{ item.name }}</view>
            <view class="card-item__stats">{{ item.grassCount }} 动态 | {{ item.topicCount }}成员</view>
          </view>
        </view>
      </view>
      <up-action-sheet @close="show = false" round="20" @select="selectAction" :actions="SheetList" :title="title" :show="show"></up-action-sheet>
    </view>
  </y-layout>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import shiba from "../../shiba";
import { reactive, ref } from "vue";
const message = shiba.$hook.useMessageBox();
let show = ref(false);
// 使用 ref 创建响应式数据
const title = ref("操作");
const SheetList = ref([
  {
    name: "退出圈子",
    color: "#333",
    fontSize: "16",
    action: "out",
  },
  {
    name: "取消",
    color: "#333",
    fontSize: "16",
    action: "cancel",
  },
]);
onLoad(() => {
  getList();
});

// 获取列表
let state = reactive({
  limit: "",
  keyword: "",
  // 操作的id
  actionId: "",
});
let list = ref([]);
const getList = async (keyword) => {
  const res = await shiba.$api.public.myGrassTopic({
    ...state,
    keyword: keyword ?? "",
  });
  list.value = res.data;
};
// 选择
const checkAction = (item) => {
  show.value = true;
  state.actionId = item.id;
};
const checkTopic = (item) => {
  uni.$store("app").SETKEYDATA("user_topic_id", item.id);
  uni.switchTab({
    url: "/pages/index/index",
  });
};

const selectAction = (eee) => {
  console.log(eee);
  if (eee.action == "out") {
    messageOut();
    show.value = false;
  }
  if (eee.action == "cancel") {
    show.value = false;
  }
};
// 取消
const messageOut = async () => {
  try {
    await message.confirm({
      title: "提示",
      content: "确认退出吗？",
      confirmText: "确认退出",
    });
    await shiba.$api.public.GrassTopicOut({
      topic_id: state.actionId,
    });
    message.alert({
      title: "提示",
      content: "退圈成功",
    });
    getList();
  } catch (error) {
    console.error("Failed to exit topic:", error);
  }
};
</script>

<style lang="scss" scoped>
.cat-tab {
  padding: 10rpx 30rpx;
  margin: 30rpx 0;
  display: flex;
  align-items: center;
  height: 80rpx;
  justify-content: space-between;

  .tab-item {
    gap: 10rpx;
    border-radius: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #333333;
    width: 336rpx;
    height: 72rpx;
    font-weight: bold;
    background: linear-gradient(to right, #ffd050, rgba(255, 186, 0, 0.2));
  }
}

.card {
  padding: 20rpx;
  width: 702rpx;
  // height: 812rpx;
  background: #ffffff;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  margin: 30rpx auto;

  .card-title {
    display: flex;
    color: #333333;
    gap: 15rpx;
    font-size: 32rpx;
    font-weight: bold;
  }

  .card-list {
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 10rpx 0;
    display: flex;

    .card-item {
      padding: 20rpx;
      width: 309rpx;
      height: 298rpx;
      background-color: rgba(255, 212, 96, 0.1);
      margin: 10rpx 0;

      .card-item-header {
        display: flex;
        justify-content: space-between;

        .logo {
          width: 154rpx;
          height: 154rpx;
          border-radius: 10rpx;
          position: relative;

          .self-text {
            position: absolute;
            width: 154rpx;
            height: 40rpx;
            font-weight: bold;
            font-size: 22rpx;
            z-index: 99;

            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0 0 10rpx 10rpx;
            background-color: rgba(255, 186, 0, 1);
          }
        }
      }

      .card-item__details {
        .card-item__title {
          height: 70rpx;
          color: #333333;
          font-weight: bold;
          line-height: 70rpx;
        }

        .card-item__stats {
          color: #999999;
          font-size: 24rpx;
        }
      }
    }
  }
}
</style>
