<template>
  <y-layout>
    <view class="earnest-container">
      <!-- Current Amount Display -->
      <view class="amount-info">
        <view class="amount-label">
          保证金余额：
          <text class="l-price">{{ earnest_money }}</text>
        </view>
        <view class="amount-hint">充值保证金会提高您的信用额度</view>
        <view class="amount-hint">保证金余额越高，信用额度越高</view>
        <view class="amount-hint">信用额度过低将无法接单或封禁处理</view>
      </view>
      <view class="min_money">保证金余额最低为{{ min_earnest_money }}元</view>
      <view class="custom-amount-input">
        <input type="number" v-model="selectedAmount" placeholder="请输入充值金额" @input="handleCustomInput" class="amount-input" />
      </view>
      <view class="text-hint-red">最大可充值金额 {{ MaxEarnestMoney - earnest_money }} 元</view>
      <view class="amount-grid">
        <view v-for="amount in amountOptions" :key="amount" class="amount-option" :class="{ active: selectedAmount === amount }" @click="selectAmount(amount)">
          {{ amount }}
        </view>
      </view>

      <!-- Submit Button -->
      <button class="submit-btn" @click="RechargeMoney">确认充值</button>
    </view>
  </y-layout>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive, computed, ref } from "vue";
import shiba from "@/shiba";
const topic_id = computed(() => shiba.$store("app").user_topic_id);
const MaxEarnestMoney = computed(() => shiba.$store("app").earnest_money);
onLoad(() => {
  getGrassInfo();
});
let earnest_money = ref(0);

let min_earnest_money = ref(0);
const remainingTimes = ref(3);
const selectedAmount = ref(100);
const customInputAmount = ref("");

const amountOptions = [5, 20, 50, 100, 150, 200];

const handleCustomInput = (e) => {
  const value = e.detail.value;

  if (customInputAmount.value) {
    selectedAmount.value = parseInt(customInputAmount.value);
  }
};

const selectAmount = (amount) => {
  selectedAmount.value = amount;
  // customInputAmount.value = amount.toString();
};

const RechargeMoney = () => {
  if (!selectedAmount.value) {
    uni.showToast({
      title: "请选择充值金额",
      icon: "none",
    });
    return;
  }
  uni.showModal({
    title: "确认充值",
    content: `确认充值${selectedAmount.value}元保证金？`,
    success: (res) => {
      if (res.confirm) {
        // Handle payment logic here

        payEarnestMoney();
      }
    },
  });
};

// 确认充值
const payEarnestMoney = async () => {
  try {
    const res = await shiba.$api.api.payEarnestMoney({
      topic_id: topic_id.value,
      earnest_money: selectedAmount.value,
	  is_edit:1
    });
    uni.requestPayment({
      provider: "wxpay",
      ...res.data,
      success: function (res) {
        // 支付成功
        uni.$u.route({
          url: "/pages/public/result",
          type: "redirect",
          params: {
            title: "充值成功",
            pageTitle: "跑腿保证金充值",
            success: true,
            showPay: false,
            showManagement: false,
            showHome: true,
            showBack: true,
          },
        });
      },
      fail: () => {
        uni.$u.route({
          url: "/pages/public/result",
          type: "redirect",
          params: {
            title: "支付失败",
            pageTitle: "跑腿认证",
            success: false,
            showPay: false,
            showManagement: false,
            showHome: true,
            showBack: true,
          },
        });
      },
    });
  } catch (error) {}
};

// 获取动态
// 获取首页详情
// run_auth_status：跑腿认证状态：0.未申请，1.待审核，2.审核通过
// auth_status：身份认证状态：0.未申请，1.待审核，2.审核通过
const getGrassInfo = async () => {
  const res = await shiba.$api.public.getGrassIndex({
    id: topic_id.value,
  });
  earnest_money.value = res.data.earnest_money;
  min_earnest_money.value = res.data.min_earnest_money;
};
</script>

<style lang="scss" scoped>
.min_money {
  margin-bottom: 20rpx;
  color: red;
}
.earnest-container {
  padding: 20px;
  .text-hint-red {
    color: red;
    padding-bottom: 20rpx;
  }
  .amount-info {
    margin-bottom: 20px;

    .amount-label {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;

      .currency-icon {
        font-size: 16px;
        margin-right: 4px;
      }
    }

    .amount-hint {
      font-size: 14px;
      color: #666;
    }
  }

  .custom-amount-input {
    margin-bottom: 20px;

    .amount-input {
      width: 100%;
      height: 44px;
      background-color: #f5f5f5;
      border-radius: 8px;
      padding: 0 15px;
      font-size: 16px;
      border: 1px solid #eee;

      &:focus {
        border-color: #2b85e4;
        background-color: #fff;
      }
    }
  }

  .max-amount-notice {
    background-color: #f5f5f5;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #666;
  }

  .amount-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 30px;

    .amount-option {
      background-color: #f5f7fa;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 16px;

      &.active {
        background-color: #e6f0ff;
        color: #2b85e4;
      }
    }
  }

  .submit-btn {
    background-color: rgb(22, 115, 254);
    color: white;
    height: 44px;
    line-height: 44px;
    border-radius: 22px;
    font-size: 16px;

    &:active {
      opacity: 0.8;
    }
  }
}
</style>

<style>
page {
  background-color: #fff;
}
</style>
