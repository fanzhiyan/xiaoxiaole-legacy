<template>
  <y-layout>
    <!-- <view class="card">
      <view class="title">第一步 上传微信收款二维码</view>
      <view class="sub-title">上传二维码</view>
      <view>
        <up-upload width="206rpx" height="172rpx" :fileList="stateFileList.fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple :maxCount="1">
          <u-image width="206rpx" height="172rpx" src="/static/icon/upload_bind.png" mode="aspectFit"></u-image>
        </up-upload>
      </view>
    </view> -->
    <view class="card">
      <view class="title">第一步</view>
      <view class="sub-title">填写提现账户信息</view>
      <view class="form-cell-group">
        <view class="form-cell-item">
          <view class="label">真实姓名</view>
          <view class="value">
            <up-input v-model="state.realname" input-align="right" placeholder="请输入账户实名人姓名"></up-input>
          </view>
        </view>
        <view class="form-cell-item">
          <view class="label">提现账户</view>
          <view class="value">
            <up-input v-model="state.reserve_mobile" input-align="right" placeholder="请输入提现账户"></up-input>
          </view>
        </view>
        <!-- <view class="form-cell-item">
          <view class="label">所属银行</view>
          <view class="value">
            <up-input v-model="state.bank_name" input-align="right" placeholder="请输入所属银行"></up-input>
          </view>
        </view>
        <view class="form-cell-item">
          <view class="label">开户行</view>
          <view class="value">
            <up-input v-model="state.open_bank" input-align="right" placeholder="请输入开户行"></up-input>
          </view>
        </view>
        <view class="form-cell-item">
          <view class="label">银行卡号</view>
          <view class="value">
            <up-input v-model="state.bank_card" input-align="right" placeholder="请输入银行卡号"></up-input>
          </view>
        </view> -->
      </view>
    </view>
    <y-fixed-bottom bottom="20rpx">
      <u-button
        @click="submitData"
        shape="circle"
        :customStyle="{ width: '640rpx', height: '88rpx', color: 'rgba(51, 51, 51, 1)', fontSize: '32rpx', fontWeight: 'bold' }"
        color="rgba(255, 217, 114, 1)"
        text="保存"></u-button>
    </y-fixed-bottom>
  </y-layout>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import shiba from "@/shiba";
import { reactive } from "vue";
import { isEmpty } from "@/shiba/rules/from";
onLoad(() => {
  getInfo();
});

let state = reactive({
  type: "alipay",
  pic: "",
  realname: "",
  reserve_mobile: "",
  bank_name: "",
  open_bank: "",
  bank_card: "",
});
let stateFileList = reactive({
  fileList1: [],
});
const { afterRead, deletePic } = shiba.$hook.useUploadFile(stateFileList.fileList1);
const getInfo = async () => {
  const res = await shiba.$api.public.GetBindPayInfo(state);

  // res.data.pic
  //   .split(",")
  //   .map((items) => {
  //     // console.log( uni.$y.oss(items),' uni.$y.oss(items)')
  //     return {
  //       type: "image",
  //       url: items,
  //       thumb: uni.$y.oss(items),
  //       size: 6505,
  //       name: "3.png",
  //       file: {},
  //       status: "success",
  //       message: "",
  //       fullurl: uni.$y.oss(items),
  //     };
  //   })
  //   .map((items) => {
  //     stateFileList.fileList1.push(items);
  //   });
  state.realname = res.data.realname;
  state.reserve_mobile = res.data.reserve_mobile;
  // state.bank_name = res.data.bank_name;
  // state.open_bank = res.data.open_bank;
  // state.bank_card = res.data.bank_card;
};

const submitData = async () => {
  if (isEmpty(state.realname)) {
    uni.$y.toast("请输入支付宝实名人姓名");
    return;
  }
  if (isEmpty(state.reserve_mobile)) {
    uni.$y.toast("请输入提现账户");
    return;
  }
  // if (isEmpty(stateFileList.fileList1.length == 0)) {
  //   uni.$y.toast("请上传二维码");
  //   return;
  // }

  const res = await shiba.$api.public.BindPay({
    ...state,
    // pic: stateFileList.fileList1[0].url,
  });

  uni.navigateBack();
  console.log(res, "resresresresres");
};
</script>

<style lang="scss" scoped>
.card {
  width: 710rpx;
  min-height: 352rpx;
  background: #ffffff;
  border-radius: 13rpx;
  padding: 15rpx;
  margin: 20rpx auto;

  .title {
    font-size: 28rpx;
    color: #1c1c1c;
    font-weight: bold;
    line-height: 70rpx;
  }

  .sub-title {
    height: 50rpx;
    line-height: 50rpx;
    color: #898989;
    font-size: 28rpx;
  }
}

.form-cell-group {
  .form-cell-item {
    height: 80rpx;
    align-items: center;
    display: flex;
    justify-content: space-between;
    border-bottom: 1rpx solid #f8f8f8;

    .label {
      font-size: 27rpx;
      width: 140rpx;
      font-weight: 600;
    }
  }
}
</style>
