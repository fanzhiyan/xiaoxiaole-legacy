<template>
  <up-navbar @rightClick="$u.route('/pages/my/bind-qrcode')" zIndex="99999" :auto-back="true" title="我的钱包" :placeholder="true" bgColor="#ffffff"></up-navbar>

  <view class="card">
    <view class="card-title">
      <view class="label">输入提现金额</view>
      <view class="hint" @click="$u.route('/pages/my/withdraw-history')">明细</view>
    </view>
    <view class="money-with">
      <u-input v-model="state.money" border="bottom" :placeholder="`账户余额${UserStore.money}`">
        <template #prefix>
          <view class="price_dw">￥</view>
        </template>
        <template #suffix>
          <view class="all" @click="state.money = UserStore.money">全部</view>
        </template>
      </u-input>
    </view>

    <view class="hint">
      <up-parse :content="state.content"></up-parse>
    </view>
  </view>
  <view class="card">
    <view class="card-title">
      <view class="label">选择提现方式</view>
    </view>
    <y-pay v-model="state.type"></y-pay>
  </view>
  <y-fixed-bottom bottom="20rpx">
    <u-button @click="SendWalletDeposit" :customStyle="{ width: '686rpx', color: '#fff', height: '80rpx' }" color="var(--l-primary-color)" text="提现" shape="circle"></u-button>
  </y-fixed-bottom>
</template>

<script setup>
import shiba from "@/shiba";
import { onLoad } from "@dcloudio/uni-app";
import { computed, reactive } from "vue";
const UseUserStore = uni.$store("user");
const UserStore = computed(() => UseUserStore.user);
onLoad(() => {
  getInfo();
});
let state = reactive({
  money: 0,
  type: "wechat",
  content: "",
});
const SendWalletDeposit = async () => {
  const res = await shiba.$api.public.ApplyWithDraw(state);
  uni.showModal({
    title: "温馨提示",
    content: "提现申请成功，请稍后前往提现记录查看",
    confirmText: "立即查看",
    success: (res) => {
      if (res.confirm) {
        uni.$u.route({
          url: "/pages/my/withdraw-history",
        });
      }
    },
  });
};
const getInfo = async () => {
  const res = await shiba.$api.api.GetRichtext({
    id: 7,
  });
  state.content = res.data.content;
};
</script>

<style lang="scss" scoped>
.card {
  margin: 0rpx auto;
  background-color: #fff;
  padding: 20rpx 20rpx;

  .hint {
    padding: 10rpx 0;
    // height: 100rpx;
    // line-height: 100rpx;
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
    .price_dw {
      font-size: 39rpx;
      font-weight: bold;
    }
  }

  .all {
    font-size: 28rpx;
    color: #1673fe;
    font-weight: bold;
  }
}

:deep(.pay-title) {
  display: none !important;
}
</style>
