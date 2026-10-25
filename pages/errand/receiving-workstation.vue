<template>
  <y-layout>
    <view class="content">
      <view class="card">
        <view class="card-item" @click="$u.route('/pages/errand/my-errand')">
          <view class="count-item">
            <up-count-to :startVal="0" bold color="#fff" :endVal="state.receive_order_count"></up-count-to>
          </view>
          <view class="label">已接订单</view>
        </view>
        <view class="card-item" @click="$u.route('/pages/my/wallet')">
          <view class="count-item"><up-count-to :decimals="2" bold color="#fff" :startVal="0" :endVal="user.money || 0"></up-count-to></view>
          <view class="label">我的钱包</view>
        </view>
        <view class="card-item" @click="$u.route('/pages/errand/my-errand?id=2')">
          <view class="count-item"><up-count-to bold color="#fff" :startVal="0" :endVal="state.complete_order_count"></up-count-to></view>
          <view class="label">已完成订单</view>
        </view>
      </view>
      <view class="cell-list">
        <view class="cell-item" @click="$u.route('/pages/errand/earnest')">
          <view class="label">保证金充值</view>
          <view><text class="shiba-next"></text></view>
        </view>
        <view class="cell-item" @click="$u.route('/pages/errand/withdrawal-deposit')">
          <view class="label">保证金提现</view>
          <view><text class="shiba-next"></text></view>
        </view>
        <view class="cell-item" @click="state.showWroks = true">
          <view class="label">本校区客服</view>
          <view><text class="shiba-next"></text></view>
        </view>
        <view class="cell-item" @click="$y.ToWeChatFollowByArticle('BJXXLXYJS')">
          <view class="label">平台客服</view>
          <view><text class="shiba-next"></text></view>
        </view>
        <view class="cell-item" @click="$u.route('/pages/errand/errand-auth')">
          <view class="label">认证信息</view>
          <view><text class="shiba-next"></text></view>
        </view>
      </view>
    </view>

    <!-- <up-popup :show="state.show" :round="20" @close="state.show = false">
      <view class="workstation-popup">
        <view class="header">温馨提示</view>
        <view class="work-content">
          <view class="icon">
            <image src="/static/icon/sucess.png" mode=""></image>
          </view>
          <view class="desc">已缴纳{{ state.earnest_money }}元保证金</view>
        </view>
        <u-button
          @click="(state.showWrok = true), (state.show = false)"
          color="#1673FE"
          plain
          :customStyle="{ width: '630rpx', height: '88rpx' }"
          text="申请退保证金"
          shape="circle"></u-button>
      </view>
    </up-popup> -->
    <!-- 保证弹窗 -->
    <!-- <up-popup mode="center" :closeable="true" @close="state.showWrok = false" :show="state.showWrok" bgColor="transparent">
      <view class="work-qrcode">
        <view class="qrcode-info">
          <up-image radius="10" :src="$y.oss(state.kefu_image)" width="300rpx" height="300rpx"></up-image>
        </view>
        <view class="qrcode-title">您的申请已提交</view>
        <view class="qrcode-value">长按识别二维码添加本校客服快速申退保证金</view>
      </view>
    </up-popup> -->
    <!-- 保证弹窗 -->
    <up-popup mode="center" :closeable="true" @close="state.showWroks = false" :show="state.showWroks" bgColor="transparent">
      <view class="work-qrcode">
        <view class="qrcode-info">
          <up-image radius="10" :showMenuByLongpress="true" :src="$y.oss(state.kefu_image)" width="300rpx" height="300rpx"></up-image>
        </view>
        <view class="qrcode-value">长按识别</view>
      </view>
    </up-popup>
  </y-layout>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { computed, reactive, ref } from "vue";
import shiba from "@/shiba";
const topic_id = computed(() => shiba.$store("app").user_topic_id);
const user = computed(() => shiba.$store("user").user);

/**
 * --
 * 经验 角色等级
 * --
 *
 */
onLoad(() => {
  getGrassInfo();
});
let state = reactive({
  // 已接数量
  receive_order_count: 0,
  // 完成
  complete_order_count: 0,
  // 客服img
  kefu_image: "",
  show: false,
  showWrok: false,
  showWroks: false,
  earnest_money: 0,
});
// 获取动态
// 获取首页详情
// run_auth_status：跑腿认证状态：0.未申请，1.待审核，2.审核通过
// auth_status：身份认证状态：0.未申请，1.待审核，2.审核通过
const getGrassInfo = async () => {
  const res = await shiba.$api.public.getGrassIndex({
    id: topic_id.value,
  });
  state.complete_order_count = res.data.complete_order_count;
  state.kefu_image = res.data.kefu_image;
  state.receive_order_count = res.data.receive_order_count;
  // state.earnest_money = res.data.earnest_money;
};
</script>

<style lang="scss" scoped>
.content {
  padding: 0 20rpx;
  .card {
    background: url(../../static/public/errand_wall_card.png);
    background-size: 100% 100%;
    height: 216rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;

    .card-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20rpx;
      .label {
        font-size: 28rpx;
        color: #fff;
      }
    }
  }
}
.cell-list {
  .cell-item {
    height: 120rpx;
    border-bottom: 1rpx solid #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label {
      font-weight: 500;
    }
  }
}

// 弹出保证金
.work-qrcode {
  width: 600rpx;

  border-radius: 20rpx;
  background: linear-gradient(180deg, #c6ddff 0%, #ffffff 22%);
  .qrcode-info {
    width: 300rpx;
    margin: 0 auto;
    padding-top: 100rpx;
    padding-bottom: 20rpx;
  }
  .qrcode-title {
    font-size: 28rpx;
    color: #999999;
    text-align: center;
  }
  .qrcode-value {
    height: 90rpx;
    font-size: 28rpx;
    color: #999999;
    text-align: center;
    line-height: 1.5;
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
</style>
<style>
page {
  background-color: #fff;
}
</style>
