<template>
  <y-layout>
    <view class="gap" @click="show = true">
      <view class="l-mr-sm">{{ $u.timeFormat(state.timeDate, "yyyy-mm-dd") }}</view>
      <text class="shiba-down"></text>
    </view>

    <!-- 列表 -->
    <view class="wallet-list">
      <y-empty v-if="WithRawList.length == 0" title="暂无提现记录"></y-empty>
      <view class="wallet-item l-f l-j-between l-a-center" v-for="item in WithRawList">
        <view class="left-label">
          <view class="remark l-text-bold-xxl">{{ item.withdraw_type_text }}</view>
          <view class="time">{{ item.createtime }}</view>
        </view>
        <view class="left-label">
          <view class="remark l-text-right">-{{ item.amount }}</view>
          <u-button v-if="item.status == 3" @tap="confirmAmount(item)" color="#1e90ff" shape="circle" :customStyle="{ width: '140rpx', height: '50rpx' }">确认收款</u-button>
          <view class="time l-text-right" v-else :class="getStatusClass(item.status)">{{ item.status_text }}</view>
        </view>
      </view>
    </view>
    <up-datetime-picker v-model="state.timeDate" @cancel="show = false" @confirm="confirmPicker" :show="show" mode="date" :minDate="0"></up-datetime-picker>
  </y-layout>
</template>

<script setup>
import { reactive, ref } from "vue";
import shiba from "@/shiba";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";

let show = ref(false);
const confirmPicker = ({ value }) => {
  show.value = false;
  // 此处拿到的是当天0点时间戳 我想拿到当天23点59分59秒 此处的时间戳是毫秒 转为秒
  let end_time = new Date(value).setHours(23, 59, 59, 999);
  state.end_time = Math.floor(end_time / 1000);
  state.start_time = Math.floor(value / 1000);
  state.page = 1;
  WithRawList.length = 0;
  GetWithdrawInfo();
};
let state = reactive({
  page: 1,
  start_time: 0,
  end_time: 0,
  timeDate: 0,
});
onLoad(() => {
  // 获取今天0点 和 23点59分59秒
  let time = new Date().getTime();
  let start_time = new Date(time).setHours(0, 0, 0, 0);
  let end_time = new Date(time).setHours(23, 59, 59, 999);
  state.start_time = start_time;
  state.end_time = end_time;
  state.timeDate = start_time;
  GetWithdrawInfo();
});
onReachBottom(() => {
  state.page++;
  GetWithdrawInfo();
});

let WithRawList = reactive([]);
const GetWithdrawInfo = async () => {
  const res = await shiba.$api.public.GetWithdrawInfo(state);
  res.data.data.map((items) => {
    WithRawList.push(items);
  });
};

const getDataHistory = async () => {};

const getStatusClass = (status) => {
  switch (status) {
    case -1: // 已拒绝
    case 5: // 提现失败
      return "status-reject";
    case 0: // 待审核
      return "status-pending";
    case 1: // 处理中
      return "status-processing";
    case 2: // 已处理
      return "status-success";
    case 3: // 待确认收款
      return "status-confirm";
    case 4: // 过期
      return "status-expired";
    default:
      return "";
  }
};

const confirmAmount = (item) => {
  console.log(item, "itemitemitem");
  uni.requestMerchantTransfer({
    mchId: item.mchId,
    package: item.wait_confirm.package_info,
    appId: item.appId,
    fail: (e) => {
      console.log(e, "wait_confirm");
    },
    success: (res) => {
      uni.showToast({
        icon: "success",
        title: "已确认打款",
      });
      WithRawList.length = 0;
      GetWithdrawInfo();
    },
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

.status-reject {
  color: #ff4d4f; // 红色
}
.status-pending {
  color: #faad14; // 橙色
}
.status-processing {
  color: #1890ff; // 蓝色
}
.status-success {
  color: #52c41a; // 绿色
}
.status-confirm {
  color: #13c2c2; // 青色
}
.status-expired {
  color: #bfbfbf; // 灰色
}
</style>
