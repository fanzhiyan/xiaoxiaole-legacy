<template>
  <y-layout>
    <view class="gap">
      <view class="gap-time gap-item" @click="show = true">
        <view class="l-mr-sm">{{ state.starttime ? $u.timeFormat(state.timeDate, "yyyy-mm-dd") : "筛选日期" }}</view>
        <text class="shiba-down"></text>
      </view>
      <view class="gap-item gap-tab">
        <u-tabs @change="changeTab" :list="state.tabs" keyName="name"></u-tabs>
      </view>
    </view>
    <!-- 列表 -->
    <view class="wallet-list">
      <y-empty v-if="WithRawList.length == 0" title="暂无保证金记录"></y-empty>
      <view class="card-wallet-item" v-for="(item, index) in WithRawList" :key="index">
        <view class="wallet-item l-f l-j-between l-a-center">
          <view class="left-label">
            <view class="remark l-text-bold-xxl">{{ item.type == 3 ? "保证金提现" : "保证金充值" }}</view>
            <view class="time">{{ $u.timeFormat(item.createtime, "yyyy-mm-dd hh:MM:ss") }}</view>
          </view>
          <view class="left-label">
            <view class="remark l-text-right" style="color: red" v-if="item.type == 2 || item.type == 1">+{{ item.money }}</view>
            <view class="remark l-text-right" v-else>-{{ item.money }}</view>
            <view class="time l-text-right">
              {{ item.pay_status_text }}
            </view>
          </view>
        </view>
        <view class="btn-rpw">
          <u-button :customStyle="{ height: '70rpx', width: '400rpx' }" v-if="item.type == 3 && item.pay_status == 0" color="red" @click="confirmPay(item)">确认收款</u-button>
        </view>
      </view>
    </view>
    <up-datetime-picker v-model="state.timeDate" @cancel="show = false" @confirm="confirmPicker" :show="show" mode="date" :minDate="0"></up-datetime-picker>
  </y-layout>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import shiba from "@/shiba";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
const topic_id = computed(() => shiba.$store("app").user_topic_id);
let show = ref(false);
const confirmPicker = ({ value }) => {
  show.value = false;
  // 此处拿到的是当天0点时间戳 我想拿到当天23点59分59秒 此处的时间戳是毫秒 转为秒
  let endtime = new Date(value).setHours(23, 59, 59, 999);
  let starttime = new Date(value).setHours(0, 0, 0, 0);
  state.endtime = Math.floor(endtime / 1000);
  state.starttime = Math.floor(starttime / 1000);
  state.page = 1;
  WithRawList.length = 0;
  GetWithdrawInfo();
};
let state = reactive({
  page: 1,
  // 默认筛选
  type: 1,
  starttime: "",
  endtime: "",
  timeDate: new Date().getTime(),

  tabs: [
    {
      id: 1,
      name: "充值",
    },
    {
      id: 2,
      name: "提现",
    },
  ],
});
onLoad(() => {
  GetWithdrawInfo();
});
onReachBottom(() => {
  state.page++;
  GetWithdrawInfo();
});

const changeTab = (item) => {
  state.type = item.id;
  state.page = 1;
  WithRawList.length = [];
  GetWithdrawInfo();
};

let WithRawList = reactive([]);
const GetWithdrawInfo = async () => {
  // 构建请求参数，只有选择了时间才带上时间参数
  const params = {
    page: state.page,
    topic_id: topic_id.value,
    type: state.type,
  };

  // 只有当开始时间和结束时间都存在时，才添加时间筛选条件
  if (state.starttime && state.endtime) {
    params.starttime = state.starttime;
    params.endtime = state.endtime;
  }

  const res = await shiba.$api.api.earnestMoneyLog(params);
  res.data.data.map((items) => {
    WithRawList.push(items);
  });
};

const getDataHistory = async () => {};
const confirmPay = (item) => {
  console.log(item, "itemitemitemitem");
  // #ifdef MP-WEIXIN
  const accountInfo = wx.getAccountInfoSync();
  const SDKVersion = accountInfo.SDKVersion || "";
  // if (SDKVersion <= "2.16.0") {
  //   // 根据实际最低版本调整
  //   return uni.showModal({ content: "请升级微信至最新版本后使用提现功能" });
  // }
  uni.requestMerchantTransfer({
    mchId: item.mchId,
    package: item.wait_confirm_text.package_info,
    appId: item.appId,
    fail: (ress) => {
      console.log(ress, "-333---");
    },
    success: (res) => {
      state.type = item.id;
      state.page = 1;
      WithRawList.length = [];
      GetWithdrawInfo();
      uni.showToast({
        icon: "success",
        title: "已确认打款",
      });
    },
  });
  // #endif
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
  justify-content: space-between;

  .gap-item {
    display: flex;
    align-items: center;
    flex: 1;
  }
  .gap-tab {
    display: flex;
    justify-content: flex-end;
  }
}

.wallet-list {
  .card-wallet-item {
    background: #ffffff;
    padding: 20rpx 30rpx;
    position: relative;
  }

  .btn-rpw {
    display: flex;
    justify-content: center;
    padding: 20rpx 0 10rpx;

    :deep(.u-button) {
      border-radius: 35rpx;
      font-size: 28rpx;
      font-weight: normal;
      box-shadow: 0 4rpx 8rpx rgba(255, 77, 79, 0.2);
    }
  }

  .wallet-item {
    border-bottom: 1rpx solid #f5f5f5;
    padding-bottom: 20rpx;

    .left-label {
      .remark {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 10rpx;
        color: #333;
      }

      .time {
        font-size: 24rpx;
        color: #999;
      }
    }

    .amount {
      color: #000000;
      font-size: 32rpx;
      font-weight: bold;
    }
  }
}

.status-reject {
  color: #ff4d4f;
}

.status-pending {
  color: #faad14;
}

.status-processing {
  color: #1890ff;
}

.status-success {
  color: #52c41a;
}

.status-confirm {
  color: #13c2c2;
}

.status-expired {
  color: #bfbfbf;
}
</style>
