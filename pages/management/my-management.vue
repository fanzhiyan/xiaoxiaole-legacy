<template>
  <y-layout>
    <up-sticky bgColor="#fff">
      <u-tabs
        :scrollable="false"
        lineHeight="12rpx"
        :lineColor="`url(../../static/icon/vector_bg.png) 100% 100%`"
        :activeStyle="{ color: '#1673FE', fontSize: '36rpx', fontWeight: 'bold' }"
        :list="tabs"
        @change="changeTab"
        keyName="name"></u-tabs>
    </up-sticky>
    <y-empty icon="data" v-if="DataList.length == 0" title="暂无内容"></y-empty>
    <view class="" v-if="activeId == 1">
      <view class="message-card" v-for="item in DataList" :key="item.id">
        <view class="" @click="$u.route(`/pages/management/management-info?id=${item.id}`)">
          <y-message-item
            :avatar="item?.user?.avatar"
            :nickname="item?.user?.nickname"
            :time="item.create_time_text"
            :content="item.introduce"
            :introduce="item.introduce"
            :tag="item.grass_type_text"
            :likes="item.likes"
            :grass_id="item.id"
            :is_top="item.is_top"
            :is_like="item.is_like"
            :comments="item.comments"
            :browses="item.browses"
            :imgs="item.images_url"></y-message-item>
        </view>

        <view class="top-hint">
          <view class="count-down">
            <block v-if="item.is_top == 1">
              剩余置顶时长：
              <u-count-down :time="getRemainMilliseconds(item.endtime)" format="HH:mm:ss"></u-count-down>
            </block>
          </view>
          <view class="button-group">
            <u-button @click="DeleteManagement(item)" plain text="删除" :customStyle="{ width: '160rpx', height: '56rpx' }" shape="circle" color="#E4350C"></u-button>
            <u-button @click="HelpBump(item)" text="置顶" :customStyle="{ width: '160rpx', height: '56rpx' }" shape="circle" color="#E4350C"></u-button>
          </view>
        </view>
      </view>
    </view>
    <view class="" v-if="activeId == 2">
      <view class="message-card" v-for="item in DataList" :key="item.id">
        <y-errand-card
          action="edit"
          :create_time_text="item.create_time_text"
          :is_address="item.is_address"
          :content="item.content"
          :goods_id="item.id"
          :endaddress="item.endaddress"
          :startaddress="item.startaddress"
          :price="item.price"
          :status_text="item.status_text"
          :type_title="item.type_title"
          :user_id="item.user_id"></y-errand-card>
      </view>
    </view>

    <y-roof></y-roof>
  </y-layout>
</template>

<script setup>
import { onLoad, onPullDownRefresh } from "@dcloudio/uni-app";
import { reactive, computed, ref } from "vue";
import shiba from "@/shiba";
const message = shiba.$hook.useMessageBox();
const topic_id = computed(() => shiba.$store("app").user_topic_id);
let tabs = reactive([
  {
    id: 1,
    name: "我的帖子",
  },
  {
    id: 2,
    name: "跑腿互动",
  },
]);
let activeId = ref(1);
// 获取我的发布的帖子
const GrassHook = shiba.$hook.useGetList(shiba.$api.api.myGrass, {
  manual: true,
  params: () => {
    return {
      grass_topic_id: topic_id.value,
    };
  },
});
// 获取我的跑腿的数据
const RunErrandsHook = shiba.$hook.useGetList(shiba.$api.api.GrassRunErrands, {
  manual: true,
  params: () => {
    return {
      type: "2",
      topic_id: topic_id.value,
    };
  },
});

// 删除
const DeleteManagement = async (item) => {
  await message.confirm({
    title: "温馨提示",
    content: "确定删除本条帖子？",
    confirmText: "确定",
  });
  const res = await shiba.$api.api.GrassDelItem({
    grass_id: item.id,
  });
  GrassHook.reset();
};

onLoad(() => {
  GrassHook.reset();
});

// 切换
const changeTab = (item) => {
  activeId.value = item.id;
  if (item.id == 1) {
    GrassHook.reset();
  }

  if (item.id == 2) {
    RunErrandsHook.reset();
  }
};

// 置顶\
const HelpBumpRef = shiba.$hook.useRoofBox();
const HelpBump = async (item) => {
  // 获取置顶价格
  const { data } = await shiba.$api.api.getTopUp();
  const res = await HelpBumpRef.confirm({
    data: data,
    grass_id: item.id,
    title: "付费置顶",
  });
};

/**
 * 计算剩余毫秒数，兼容秒和毫秒时间戳
 * @param {number} serverTime 服务器当前时间戳（秒或毫秒）
 * @param {number} expireTime 到期时间戳（秒或毫秒）
 * @returns {number} 剩余毫秒数（如果已到期则为0）
 */
function getRemainMilliseconds(expireTime) {
  let serverTime = ServiceTime.value;
  // 判断是否为秒级时间戳（10位数），如果是则转为毫秒
  if (serverTime < 1e12) serverTime *= 1000;
  if (expireTime < 1e12) expireTime *= 1000;
  const remain = expireTime - serverTime;
  return remain > 0 ? remain : 0;
}

const DataList = computed(() => (activeId.value == 1 ? GrassHook.DataList.value : RunErrandsHook.DataList.value));

const ServiceTime = computed(() => (activeId.value == 1 ? GrassHook.time.value : RunErrandsHook.time.value));
onPullDownRefresh(() => {
  setTimeout(() => {
    if (item.id == 1) {
      GrassHook.reset();
    }

    if (item.id == 2) {
      RunErrandsHook.reset();
    }
  }, 1000);
});
</script>

<style lang="scss" scoped>
.message-card {
  background-color: #fff;
  border-bottom: 1rpx solid #f8f8f8;
  :deep(.message-item-card) {
    margin: 0 !important;
    border-radius: 0 !important;
    box-shadow: none;
    border: none !important;
  }
  .top-hint {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70rpx;
    padding: 0 15rpx;
    .count-down {
      display: flex;
      color: red;
      font-size: 28rpx;
      font-weight: bold;
      :deep(.u-count-down__text) {
        color: red;
      }
    }
  }
}
.button-group {
  display: flex;
  gap: 20rpx;
}
</style>
