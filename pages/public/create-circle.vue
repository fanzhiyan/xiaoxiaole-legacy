<template>
  <up-navbar title="创建圈子" :placeholder="true" :auto-back="true"></up-navbar>

  <view class="form">
    <view class="form-item">
      <view class="label">圈子头像</view>
      <view class="value">
        <up-upload @afterRead="afterRead" @delete="deletePic" name="" multiple :maxCount="1" :fileList="state.icon"></up-upload>
      </view>
    </view>
    <view class="form-item textarea-box">
      <up-textarea placeholder-class="textarea-box-place" placeholder="请输入内容" v-model="state.content"></up-textarea>
    </view>
    <view class="form-item">
      <view class="label">所在地点</view>
      <view class="value" @click="chossLocation">
        {{ state.address ? state.address : "请选择" }}
        <text class="shiba-next"></text>
      </view>
    </view>

    <view class="form-item">
      <view class="label">微信号</view>
      <view class="value">
        <u-input input-align="right" placeholder="请输入微信号" v-model="state.wechatNo"></u-input>
        <text class="shiba-next"></text>
      </view>
    </view>
  </view>
  <y-fixed-bottom bottom="20rpx">
    <u-button shape="circle" @click="createFormSend" :customStyle="{ color: '#000', width: '640rpx', height: '88rpx' }" color="#FFD972" text="提交"></u-button>
  </y-fixed-bottom>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import shiba from "@/shiba";
import { reactive, ref } from "vue";
const createFormSend = async () => {
  const res = await shiba.$api.public.CreateGrass_topic({
    ...state,
    icon: state.icon.map((items) => items.fileUrl).join(","),
  });
  console.log(res, "resresresres");
  uni.$u.route({
    params: {
      title: "我们已收到您的圈子创建申请，请耐心等待审核",
    },
    url: "/pages/public/result",
    type: "redirect",
  });
};

// 选择位置
let state = reactive({
  address: "",
  content: "",
  lng: "",
  lat: "",
  wechatNo: "",
  icon: [],
});
const { deletePic, afterRead } = shiba.$hook.useUploadFile(state.icon);
const chossLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      state.address = res.address;
      state.lng = res.longitude;
      state.lat = res.latitude;
    },
  });
};
</script>

<style lang="scss" scoped>
.form {
  .form-item {
    width: 694rpx;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eeeeee;

    .value {
      color: #999999;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}

.textarea-box {
  width: 694rpx;
  height: 204rpx !important;
  background: #f6f7f9;
  margin: 30rpx auto;
  border-radius: 16rpx;

  :deep(.u-textarea) {
    background-color: #f6f7f9;
    padding: 0 !important;
    padding: 20rpx !important;
  }
}
</style>
<style>
page {
  background-color: #fff;
}
</style>
