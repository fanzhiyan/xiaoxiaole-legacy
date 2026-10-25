<template>
  <y-layout>
    <up-sticky>
      <view class="l-bg-white">
        <u-tabs
          @change="changeTab"
          lineColor="#1673FE"
          lineHeight="12rpx"
          :lineColor="`url(../../static/icon/vector_bg.png) 100% 100%`"
          :activeStyle="{ color: '#1673FE', fontSize: '36rpx', fontWeight: 'bold' }"
          :list="list"
          :scrollable="false"></u-tabs>
      </view>
    </up-sticky>

    <up-gap bgColor="#F6F7F9"></up-gap>
    <!-- 列表 -->
    <y-empty v-if="WithRawList.length == 0" title="暂无提现记录"></y-empty>
    <view class="wallet-list">
      <view class="wallet-item l-f l-j-between l-a-center" v-for="item in WithRawList" :key="item.id">
        <view class="left-label">
          <view class="remark l-text-bold-xxl">{{ item.memo }}</view>
          <view class="time">{{ $u.timeFormat(item.createtime, "yyyy-mm-dd hh:MM:ss") }}</view>
        </view>
        <view class="wallet-nums" :style="{ color: item.money < 0 ? '#e81616' : '#1e90ff' }">{{ item.money }}</view>
      </view>
    </view>
    <up-datetime-picker @cancel="show = false" @confirm="confirmPicker" :show="show" :minDate="0" mode="date"></up-datetime-picker>
  </y-layout>
</template>

<script setup>
import { onLoad, onReachBottom, onShow } from "@dcloudio/uni-app";
import { reactive, computed, ref } from "vue";
const UseUserStore = uni.$store("user");
const UserStore = computed(() => UseUserStore.user);
import shiba from "@/shiba";

let list = reactive([
  {
    id: 0,
    name: "全部",
  },
  {
    id: 1,
    name: "收入记录",
  },
  {
    id: 2,
    name: "支出记录",
  },
]);
let show = ref(false);
const confirmPicker = (data) => {
  show.value = false;
  console.log(data);
};

onLoad(() => {
  GetWithdrawInfo();
  // 获取30天记录 先获取当前时间戳和30天前时间戳 开始时间戳应该是0点 结束时间戳应该是23点59分59秒
  // let time = new Date().getTime();
  // let time30 = time - 30 * 24 * 60 * 60 * 1000;
  // let start_time = new Date(time30).setHours(0, 0, 0, 0);
  // let end_time = new Date(time).setHours(23, 59, 59, 999);
  // state.start_time = start_time;
  // state.end_time = end_time;
});

onReachBottom(() => {
  state.page++;
  GetWithdrawInfo();
});

let state = reactive({
  page: 1,
  start_time: 0,
  end_time: 0,
  type: "",
});
const changeTab = (index) => {
  state.page = 1;
  state.type = index.id == 0 ? "" : index.id;
  WithRawList.length = 0;
  GetWithdrawInfo();
};
let WithRawList = reactive([]);
const GetWithdrawInfo = async () => {
  const res = await shiba.$api.public.MoneyLog(state);
  res.data.data.map((items) => {
    WithRawList.push(items);
  });
};
</script>

<style lang="scss" scoped>
.gap {
  width: 750rpx;
  height: 90rpx;
  background: #f5f5f5;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
}

.history-list {
  .history-item {
    height: 152rpx;
    background: #ffffff;
    border: solid;
  }
}

.wallet-list {
  .wallet-item {
    border-bottom: 1rpx solid #f9f9f9;
    padding: 0 15rpx;
    height: 152rpx;
    background: #ffffff;

    // border-radius: 0rpx 0rpx 0rpx 0rpx;
    .left-label {
      .remark {
        margin: 20rpx 0;
      }

      .time {
        font-size: 24rpx;
        color: #979797;
      }
    }

    .amount {
      color: #000000;
      font-size: 32rpx;
    }
  }
}
</style>
