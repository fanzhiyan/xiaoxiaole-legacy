<template>
  <view class="withdrawal-container">
    <up-navbar @rightClick="$u.route('/pages/my/bind-qrcode')" zIndex="99999" :auto-back="true" title="保证金提现" :placeholder="true" bgColor="#ffffff"></up-navbar>

    <view class="card">
      <view class="card-title">
        <view class="label">退回保证金</view>
        <view class="hint" @click="$u.route('/pages/my/deposit-history')">保证金明细</view>
      </view>
      <view class="money-with">
        <view class="total-amount">
          <text class="price_dw">￥</text>
          <text class="amount">{{ state.earnest_money }}</text>
        </view>
      </view>
      <view class="hint">
        <up-parse :content="state.content"></up-parse>
      </view>
    </view>
    <y-fixed-bottom bottom="20rpx">
      <u-button
        @click="SendWalletDeposit"
        :customStyle="{ width: '686rpx', color: '#fff', height: '80rpx' }"
        color="var(--l-primary-color)"
        text="确认退回"
        shape="circle"></u-button>
    </y-fixed-bottom>
    <up-popup :show="state.show" :round="20" @close="state.show = false">
      <view class="workstation-popup">
        <view class="header">温馨提示</view>
        <view class="work-content">
          <!-- <view class="icon"> -->
          <!-- <image src="/static/icon/sucess.png" mode=""></image> -->
          <!-- </view> -->
          请确认收款，确认后我们将处理您的提现
        </view>
        <u-button color="#1673FE" :customStyle="{ width: '630rpx', height: '88rpx' }" @click="confirmRefund" text="确认收款" shape="circle"></u-button>
      </view>
    </up-popup>
  </view>
</template>

<script setup>
import shiba from "@/shiba";
import { onLoad } from "@dcloudio/uni-app";
import { computed, reactive } from "vue";
const UseUserStore = uni.$store("user");
const UserStore = computed(() => UseUserStore.user);
const topic_id = computed(() => shiba.$store("app").user_topic_id);
onLoad(() => {
  getInfo();
  getGrassInfo();
});
let state = reactive({
  earnest_money: 0,
  content: "",
  show: false,
  // 退款详情
  mchId: "",
  appId: "",
  package: "",
});
const SendWalletDeposit = async () => {
  const res = await shiba.$api.api.applyRefundEarnestMoney({
    topic_id: topic_id.value,
    earnest_money: state.earnest_money,
  });
  state.show = true;
  // #ifdef MP-WEIXIN
  state.mchId = res.data.mchId;
  state.appId = res.data.appId;
  state.package = res.data.wait_confirm_text.package_info;
  // #endif
};
// 确认退款
const confirmRefund = () => {
  uni.requestMerchantTransfer({
    mchId: state.mchId,
    package: state.package,
    appId: state.appId,
    fail: (ress) => {},
    success: (res) => {
      uni.showToast({
        icon: "success",
        title: "已确认打款",
      });
      state.show = false;
      getInfo();
      getGrassInfo();
    },
  });
};

const getInfo = async () => {
  const res = await shiba.$api.api.GetRichtext({
    id: 11,
  });
  state.content = res.data.content;
};

const getGrassInfo = async () => {
  const res = await shiba.$api.public.getGrassIndex({
    id: topic_id.value,
  });
  state.earnest_money = res.data.earnest_money * 1;
};
</script>

<style lang="scss" scoped>
.card {
  margin: 0rpx auto;
  background-color: #fff;
  padding: 20rpx 20rpx;

  .hint {
    padding: 10rpx 0;
    font-size: 24rpx;
    color: #7b7f96;
  }

  .border-bottom {
    border-bottom: 1rpx solid #eeeeee;
  }

  .card-title {
    color: #333333;
    font-size: 32rpx;
    height: 60rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .label {
      font-weight: bold;
    }
    .hint {
      font-size: 28rpx;
      color: #999999;
    }
  }

  .money-with {
    height: 116rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1rpx solid #eee;

    .total-amount {
      display: flex;
      align-items: center;
      .price_dw {
        font-size: 39rpx;
        font-weight: bold;
      }
      .amount {
        font-size: 39rpx;
        font-weight: bold;
        margin-left: 8rpx;
      }
    }
  }
}

.workstation-popup {
  width: 750rpx;
  height: 544rpx;
  border-radius: 40rpx 40rpx 0rpx 0rpx;
  .header {
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
  }
  .work-content {
    text-align: center;
    width: 70%;
    font-weight: bold;
    margin: 120rpx auto;
    .icon {
      width: 150rpx;
      height: 150rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20rpx auto;
      image {
        width: 120rpx;
        height: 120rpx;
      }
    }
    .desc {
      text-align: center;
      line-height: 90rpx;
    }
  }
  .btn-cancle {
  }
}

:deep(.pay-title) {
  display: none !important;
}
</style>
