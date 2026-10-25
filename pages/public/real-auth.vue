<template>
  <y-layout>
    <view class="auth-notice" v-if="authInfo.auth_status !== 2">
      <view class="notice-content" v-if="authInfo.auth_status === 1">
        <u-icon name="info-circle" color="#1673FE" size="32rpx"></u-icon>
        <text>您的实名认证正在审核中，请耐心等待</text>
      </view>
      <view class="notice-content" v-if="authInfo.auth_status === 0">
        <u-icon name="info-circle" color="#1673FE" size="32rpx"></u-icon>
        <text>请完成以下认证信息</text>
      </view>
      <view class="notice-content" v-if="authInfo.auth_status === 3">
        <u-icon name="info-circle" color="#1673FE" size="32rpx"></u-icon>
        <text>审核驳回：{{ authInfo.run_remark }}</text>
      </view>
      <view class="" style="color: red; font-weight: bold">
        <view>根据相关法律法规 请如实完成以下认证信息</view>
        <view>提交实名认证通过后即可发布</view>
        <view>虚假信息将会进行封禁处理</view>
      </view>
    </view>

    <view class="form-container">
      <view class="form-item">
        <view class="label">姓名</view>
        <view class="input-style">
          <u-input v-model="state.name" placeholder="请输入" :border="false" />
        </view>
      </view>

      <view class="form-item">
        <view class="label">学号</view>
        <view class="input-style">
          <u-input v-model="state.studentID" placeholder="请输入" :border="false" class="" />
        </view>
      </view>

      <view class="form-item">
        <view class="label">院系</view>
        <view class="input-style">
          <u-input v-model="state.college" placeholder="请输入" :border="false" class="" />
        </view>
      </view>

      <view class="upload-section">
        <view class="label">请上传学生证/毕业证/录取通知书</view>
        <up-upload
          class="upload-box"
          width="140rpx"
          height="140rpx"
          @afterRead="afterRead"
          @delete="deletePic"
          name="certificate"
          :maxCount="1"
          :fileList="modalImages.certificate"></up-upload>
      </view>
    </view>

    <y-fixed-bottom bottom="50rpx" v-if="authInfo.auth_status !== 2">
      <u-button v-if="authInfo.auth_status === 1" shape="circle" color="#1673FE" :customStyle="{ height: '88rpx', width: '630rpx' }">审核中</u-button>
      <u-button v-if="authInfo.auth_status === 0" shape="circle" color="#1673FE" @click="sendIdentityAuth" :customStyle="{ height: '88rpx', width: '630rpx' }">提交认证</u-button>
      <u-button v-if="authInfo.auth_status == 3" shape="circle" color="#1673FE" @click="sendIdentityAuth" :customStyle="{ height: '88rpx', width: '630rpx' }">重新提交</u-button>
    </y-fixed-bottom>
  </y-layout>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import shiba from "@/shiba";

const authInfo = reactive({
  auth_status: 0,
  reason: "",
  run_remark: "",
});

let paramsOpction = reactive({
  topic_id: "",
});

onLoad((opction) => {
  paramsOpction.topic_id = opction?.topic_id;
  getMyAuth();
});

const getMyAuth = async () => {
  const res = await shiba.$api.api.getMyAuth({
    topic_id: paramsOpction?.topic_id ? paramsOpction?.topic_id : topic_id.value,
  });
  console.log(res, "getMyAuth");
  if (res.data) {
    authInfo.auth_status = res.data.auth_status;
    authInfo.reason = res.data.reason;
    authInfo.run_remark = res.data.run_remark;

    // 回显表单数据
    state.name = res.data.name || "";
    state.studentID = res.data.studentID || "";
    state.college = res.data.college || "";

    // 回显图片数据
    if (res.data.certificate) {
      modalImages.certificate.push({
        url: uni.$y.oss(res.data.certificate),
        type: "image",
        thumb: uni.$y.oss(res.data.certificate),
        fileUrl: res.data.certificate,
        fullurl: uni.$y.oss(res.data.certificate),
        name: "certificate.png",
        size: 0,
      });
    }
  }
};

const topic_id = computed(() => shiba.$store("app").user_topic_id);
// 只保留需要的字段
const state = reactive({
  name: "",
  studentID: "",
  college: "",
});

// 上传图片
const modalImages = reactive({
  certificate: [],
});

// 上传钩子
const { deletePic, afterRead } = shiba.$hook.useUploadFile(modalImages.certificate);

// 提交认证
const sendIdentityAuth = async () => {
  if (!state.name) return uni.$u.toast("请输入姓名");
  if (!state.studentID) return uni.$u.toast("请输入学号");
  if (!state.college) return uni.$u.toast("请输入院系");
  if (modalImages.certificate.length === 0) return uni.$u.toast("请上传学校证明证件");

  const certificate = modalImages.certificate.map((item) => item.fileUrl).join(",");
  const params = {
    name: state.name,
    studentID: state.studentID,
    college: state.college,
    certificate,
    topic_id: paramsOpction?.topic_id ? paramsOpction?.topic_id : topic_id.value,
  };

  try {
    await shiba.$api.public.GetIdentityAuth(params);
    uni.$u.route({
      url: "/pages/public/result",
      type: "redirectTo",
      params: {
        // title: "已提交审核",
        // pageTitle: "实名认证",
        // success: true,
        // failReason: "我们将在尽快完成审核",

        // payType: "微信支付",
        title: "已提交审核 我们将尽快完成审核",
        pageTitle: "实名认证",
        success: true,
        showPay: false,
        showManagement: false,
        showHome: false,
        showBack: true,
      },
    });
  } catch (e) {
    uni.$u.toast("提交失败，请重试");
  }
};
</script>

<style lang="scss" scoped>
.auth-notice {
  background-color: #ebf3ff;
  padding: 24rpx 32rpx;
  margin-bottom: 20rpx;

  .notice-content {
    display: flex;
    align-items: center;
    gap: 12rpx;

    text {
      font-size: 28rpx;
      color: #333333;
    }
  }
}

.form-container {
  background-color: #fff;
  padding: 32rpx;
}

.form-item {
  margin-bottom: 40rpx;

  .label {
    font-weight: bold;
    font-size: 28rpx;
    color: #333;
    margin-bottom: 16rpx;
  }

  .input-style {
    background-color: #f8f9fc;
    border-radius: 8rpx;

    :deep(.u-input__input) {
      height: 80rpx;
      font-size: 28rpx;
    }
  }
}

.upload-section {
  margin-top: 60rpx;

  .label {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 24rpx;
  }

  .upload-box {
    :deep(.u-upload__wrap) {
      border-radius: 8rpx;
    }
  }
}
</style>

<style>
page {
  background-color: #f7f8fc;
}
</style>
