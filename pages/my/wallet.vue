<template>
  <view>
    <up-navbar zIndex="99999" :placeholder="true" :auto-back="true" title="我的钱包" bgColor="transparent"></up-navbar>
    <!-- <view class="wallet-page">
      <view class="wallet-page__background">
        <u-image width="100%" height="519rpx" src="/static/public/wall_bg.png" mode="widthFix"></u-image>
      </view>
      <view class="wallet-page__content">
        <y-status-navbar></y-status-navbar>
        <view class="wallet-page__balance">
          <up-count-to @click="$u.route('/pages/my/wallet-history')" color="#333333" :startVal="0" font-size="80rpx" :endVal="UserStore.money"></up-count-to>
          <view class="wallet-page__balance-tip">余额（元）</view>

          <view class="wallet-page-button">
            <u-button
              @click="$u.route('/pages/my/bind-qrcode')"
              shape="circle"
              :customStyle="{ width: '180rpx', height: '60rpx' }"
              color="linear-gradient( 130deg, #FF896E 0%, #F52C2C 100%)"
              text="绑定账户"></u-button>
            <u-button
              @click="$u.route('/pages/my/wallet-deposit')"
              shape="circle"
              :customStyle="{ width: '120rpx', height: '60rpx' }"
              color="linear-gradient( 130deg, #FF896E 0%, #F52C2C 100%)"
              text="提现"></u-button>
          </view>
        </view>
      </view>
    </view> -->
    <view class="wallet-card-box">
      <image class="bg_img" src="/static/public/wall_card_bg.png" mode="aspectFit"></image>
      <view class="wallect-content">
        <view class="wallect-left">
          <view class="count-num"><u-count-to color="#fff" bold font-size="60rpx" :startVal="0" :endVal="UserStore.money" :decimals="2"></u-count-to></view>
          <view class="desc">余额（元）</view>
        </view>
        <view class="">
          <view class="btns" @click="$u.route('/pages/my/wallet-deposit')">提现</view>
          <!-- <view class="btns" @click="$u.route('/pages/my/bind-qrcode')">账户</view> -->
        </view>
      </view>
    </view>
    <view class="wallet-content">
      <view class="title">
        <view class="label">近30天记录</view>
        <view class="next" @click="$u.route('/pages/my/wallet-history')">
          查看全部
          <text class="shiba-next"></text>
        </view>
      </view>
      <y-empty v-if="WithRawList.length == 0" title="暂无提现记录"></y-empty>
      <view class="wallet-item" v-for="item in WithRawList">
        <view class="wallet-left">
          <view class="label-text">{{ item.memo }}</view>
          <view class="time">{{ $u.timeFormat(item.createtime, "yyyy-mm-dd hh:MM:ss") }}</view>
        </view>
        <view class="wallet-nums" :style="{ color: item.money < 0 ? '#e81616' : '#1e90ff' }">{{ item.money }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { onLoad, onReachBottom, onShow } from "@dcloudio/uni-app";
import shiba from "@/shiba";
const UseUserStore = uni.$store("user");
const UserStore = computed(() => UseUserStore.user);
onLoad(() => {
  GetWithdrawInfo();
  // 获取30天记录 先获取当前时间戳和30天前时间戳 开始时间戳应该是0点 结束时间戳应该是23点59分59秒
  let time = new Date().getTime();
  let time30 = time - 30 * 24 * 60 * 60 * 1000;
  let start_time = new Date(time30).setHours(0, 0, 0, 0);
  let end_time = new Date(time).setHours(23, 59, 59, 999);
  state.start_time = start_time;
  state.end_time = end_time;
});
onShow(() => {
  UseUserStore.GetUser();
});

onReachBottom(() => {
  state.page++;
  GetWithdrawInfo();
});

let state = reactive({
  page: 1,
  start_time: 0,
  end_time: 0,
  content: "",
  type: "",
});

let WithRawList = reactive([]);
const GetWithdrawInfo = async () => {
  const res = await shiba.$api.public.MoneyLog(state);
  res.data.data.map((items) => {
    WithRawList.push(items);
  });
};
</script>

<style lang="scss" scoped>
.wallet-page {
  position: relative;
  height: 520rpx;

  .wallet-page__background {
    position: absolute;
    width: 100%;
    z-index: 1;
    height: 520rpx;
  }

  .wallet-page__content {
    position: absolute;
    width: 100%;
    height: 520rpx;
    z-index: 111;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .wallet-page__balance {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .wallet-page__balance-tip {
        margin: 20rpx 0;
        text-align: center;
      }
    }
    .wallet-page-button {
      display: flex;
      gap: 20rpx;
    }
  }
}

.wallet-content {
  position: relative;
  border-radius: 20rpx 20rpx 0 0;
  top: -20rpx;
  z-index: 111;
  height: 100rpx;
  background-color: #fff;

  .title {
    padding: 0 20rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label {
      font-weight: bold;
    }
    .next {
      color: #999999;
    }
  }

  .wallet-item {
    border-bottom: 1rpx solid #ebebeb;
    height: 158rpx;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24rpx;

    .wallet-left {
      .label-text {
        font-size: 32rpx;
        color: #333333;
        font-weight: bold;
        margin: 10rpx 0;
      }

      .time {
        color: #999999;
      }
    }

    .wallet-nums {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }

    .ad {
      color: #e81616;
    }
  }
}
.wallet-center-nav {
  display: flex;
  gap: 30rpx;
}
.wallet-card-box {
  width: 690rpx;
  height: 240rpx;
  position: relative;
  margin: 0 auto;
  .bg_img {
    position: absolute;
    left: 50%;
    z-index: 11;
    transform: translateX(-50%);
    width: 690rpx;
    height: 240rpx;
  }
  .wallect-content {
    position: absolute;
    width: 690rpx;
    height: 240rpx;
    padding: 0 30rpx;
    z-index: 222;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .wallect-left {
      .count-num {
      }
      .desc {
        margin-top: 5rpx;
        font-size: 24rpx;
        color: #ffffff;
      }
    }

    .btns {
      width: 172rpx;
      height: 66rpx;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      border: 2rpx solid rgba(255, 255, 255, 0.3);
      color: #ffffff;
      line-height: 66rpx;
      text-align: center;
      margin: 10rpx 0;
    }
  }
}
</style>
<style>
page {
  background: linear-gradient(to bottom, transparent 0%, #fff 100%), url(../../static/public/bg_top.png) no-repeat top / 100% 412rpx;
}
</style>
