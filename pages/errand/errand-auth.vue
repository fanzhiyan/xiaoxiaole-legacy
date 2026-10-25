<template>
  <y-layout>
    <!-- Add notification section -->
    <view class="auth-notice" v-if="authInfo.run_auth_status !== 2">
      <view class="notice-content" v-if="authInfo.run_auth_status === 1">
        <u-icon name="info-circle" color="#1673FE" size="32rpx"></u-icon>
        <text>您的跑腿认证正在审核中，请耐心等待</text>
      </view>
      <view class="notice-content" v-if="authInfo.run_auth_status === 0">
        <u-icon name="info-circle" color="#1673FE" size="32rpx"></u-icon>
        <text>请完成以下认证信息</text>
      </view>
      <view class="notice-content" v-if="authInfo.run_auth_status === 3">
        <u-icon name="info-circle" color="#1673FE" size="32rpx"></u-icon>
        <text>审核驳回:{{ authInfo.run_remark }}</text>
      </view>
      <view class="" style="color: red; font-size: 26rpx; font-weight: bold">
        <view>请如实完成以下认证信息</view>
        <view>提交实名认证通过后即可接单</view>
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
        <view class="label">学院</view>
        <view class="input-style">
          <u-input v-model="state.college" placeholder="请输入" :border="false" class="" />
        </view>
      </view>

      <view class="form-item">
        <view class="label">手机号</view>
        <view class="input-style">
          <u-input v-model="state.phone" placeholder="请输入" :border="false" class="" />
        </view>
      </view>

      <view class="form-item">
        <view class="label">身份证号</view>
        <view class="input-style">
          <u-input v-model="state.IDCard" placeholder="请输入" :border="false" class="" />
        </view>
      </view>

      <view class="upload-section">
        <view class="label">请上传学生证/毕业证/录取通知书</view>
        <view class="upload-box small">
          <up-upload
            width="160rpx"
            height="160rpx"
            @afterRead="afterReadCertificate"
            @delete="deleteCertificate"
            name="certificate_image"
            :maxCount="1"
            :fileList="modalImages.certificate_image"></up-upload>
        </view>
      </view>

      <view class="upload-section">
        <view class="label">上传身份证照片</view>
        <view class="id-upload-wrap">
          <view class="id-upload-box">
            <up-upload
              width="542rpx"
              height="340rpx"
              @afterRead="afterReadPortrait"
              @delete="deletePicPortrait"
              name="portrait_image"
              :maxCount="1"
              :fileList="modalImages.portrait_image">
              <up-image src="/static/public/group_ghm.png" width="542rpx" height="340rpx"></up-image>
            </up-upload>
            <view class="pal">上传身份证国徽面</view>
          </view>
          <view class="id-upload-box">
            <up-upload
              width="686rpx"
              height="340rpx"
              @afterRead="afterReadUnportrait"
              @delete="deletePicUnportrait"
              name="unportrait_image"
              :maxCount="1"
              :fileList="modalImages.unportrait_image">
              <up-image src="/static/public/group_rxm.png" width="542rpx" height="340rpx"></up-image>
            </up-upload>
            <view class="pal">上传身份证人像面</view>
          </view>
        </view>
      </view>
    </view>

    <y-fixed-bottom bottom="50rpx" v-if="authInfo.run_auth_status == 0 || authInfo.run_auth_status == 3">
      <view class="protocol">
        <y-radio size="34rpx" v-model="modalState.agreement"></y-radio>
        勾选表示您已仔细阅读并同意
        <text @tap="$y.ViewProtocol('认证协议', 5)">《认证协议》</text>
      </view>
      <u-button shape="circle" color="#1673FE" @click="runAuth" :customStyle="{ height: '88rpx', width: '630rpx' }">提交认证</u-button>
    </y-fixed-bottom>
  </y-layout>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import shiba from "@/shiba";
const topic_id = computed(() => shiba.$store("app").user_topic_id);
const earnest_money = computed(() => shiba.$store("app").earnest_money);

const authInfo = reactive({
  run_auth_status: 0,
  auth_status: 0,
  reason: "",
  auth_remark: "",
  run_remark: "",
});

onLoad(() => {
  getMyAuth();
});

const getMyAuth = async () => {
  const res = await shiba.$api.api.getMyAuth({
    topic_id: topic_id.value,
  });
  console.log(res, "getMyAuth");
  if (res.data) {
    authInfo.run_auth_status = res.data.run_auth_status;
    authInfo.auth_status = res.data.auth_status;
    authInfo.reason = res.data.reason;
    authInfo.auth_remark = res.data.auth_remark;
    authInfo.run_remark = res.data.run_remark;

    // 回显表单数据
    state.name = res.data.name || "";
    state.studentID = res.data.studentID || "";
    state.college = res.data.college || "";
    state.phone = res.data.phone || "";
    state.IDCard = res.data.IDCard || "";

    // 回显图片数据
    if (res.data.certificate) {
      modalImages.certificate_image.push({
        url: uni.$y.oss(res.data.certificate),
        type: "image",
        thumb: uni.$y.oss(res.data.certificate),
        name: "certificate.png",
        fileUrl: res.data.certificate,
        fullurl: uni.$y.oss(res.data.certificate),
      });
    }
    if (res.data.portrait_image) {
      modalImages.portrait_image.push({
        url: uni.$y.oss(res.data.portrait_image),
        type: "image",
        thumb: uni.$y.oss(res.data.portrait_image),
        name: "portrait.png",
        fileUrl: res.data.portrait_image,
        fullurl: uni.$y.oss(res.data.portrait_image),
      });
    }
    if (res.data.unportrait_image) {
      modalImages.unportrait_image.push({
        url: uni.$y.oss(res.data.unportrait_image),
        type: "image",
        thumb: uni.$y.oss(res.data.unportrait_image),
        fullurl: uni.$y.oss(res.data.unportrait_image),
        fileUrl: res.data.unportrait_image,
        name: "unportrait.png",
      });
    }
  }
};

const state = reactive({
  /**
   * 院系
   */
  college: "",
  /**
   * 手机号
   */
  phone: "",
  /**
   * 证件号
   */
  IDCard: "",
  /**
   * 学号
   */
  studentID: "",
  /**
   * 学校ID
   */
  topic_id: "",
  /**
   * 姓名
   */
  name: "",
  /**
   * 证件人像面
   */
  portrait_image: "",
  /**
   * 证件非人像面
   */
  unportrait_image: "",
});

let modalState = reactive({
  agreement: false,
});

const rules = reactive({
  name: {
    required: true,
    type: "string",
    message: "请输入姓名",
    trigger: "blur",
  },
  phone: {
    required: true,
    type: "string",
    message: "请输入手机号",
    trigger: "blur",
  },
  college: {
    required: true,
    type: "string",
    message: "请输入院系",
    trigger: "change",
  },
  studentID: {
    required: true,
    type: "string",
    message: "请输入学号",
    trigger: "change",
  },
  IDCard: {
    required: true,
    type: "string",
    message: "请输入证件号",
    trigger: "change",
  },
  topic_id: {
    required: true,
    type: "string",
    message: "请输入学校ID",
    trigger: "change",
  },
});

const uForm = ref(null);

// 处理上传图片
let modalImages = reactive({
  portrait_image: [],
  unportrait_image: [],
  // 学生证通知书
  certificate_image: [],
});

// 学生证通知书
const { deletePic: deleteCertificate, afterRead: afterReadCertificate } = shiba.$hook.useUploadFile(modalImages.certificate_image);
// 上传身份证人像
const { deletePic: deletePicPortrait, afterRead: afterReadPortrait } = shiba.$hook.useUploadFile(modalImages.portrait_image);
// 上传身份证非人像面
const { deletePic: deletePicUnportrait, afterRead: afterReadUnportrait } = shiba.$hook.useUploadFile(modalImages.unportrait_image);

const runAuth = async () => {
  let images = {
    portrait_image: "",
    unportrait_image: "",
    certificate: "",
  };

  console.log(modalImages.portrait_image, "modalImages.portrait_image");
  if (modalImages.portrait_image.length === 0) return uni.$y.toast("请上传证件人像面");
  images.portrait_image = modalImages.portrait_image.map((item) => item.fileUrl).join(",");
  if (modalImages.portrait_image.length === 0) return uni.$y.toast("请上传证件人像面");
  images.certificate = modalImages.certificate_image.map((item) => item.fileUrl).join(",");

  if (modalImages.unportrait_image.length === 0) return uni.$y.toast("请上传证件非人像面");
  images.unportrait_image = modalImages.unportrait_image.map((item) => item.fileUrl).join(",");

  let params = {
    ...state,
    ...images,
    topic_id: topic_id.value,
  };

  if (!modalState.agreement) {
    return uni.$y.toast("请阅读协议后认证");
  }

  const res = await shiba.$api.api.runAuth(params);

  uni.$u.route({
    url: "/pages/public/result",
    type: "redirect",
    params: {
      title: "已提交审核 我们将尽快完成审核",
      pageTitle: "跑腿认证",
      success: true,
      showPay: false,
      showManagement: false,
      showHome: true,
      showBack: false,
    },
  });

  return;
  // 返回缴纳保证金内容
  uni.requestPayment({
    provider: "wxpay",
    ...res.data,
    success: function (res) {
      // 支付成功
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
  margin-bottom: 32rpx;

  .label {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 24rpx;
  }

  .upload-box {
  }

  .id-upload-wrap {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
  }

  .id-upload-box {
    width: 686rpx;
    margin: 20rpx 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    .pal {
      font-size: 28rpx;
      color: #999999;
      text-align: center;
      height: 50rpx;
      line-height: 50rpx;
    }
  }

  .upload-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fc;
    border: 2rpx dashed #dddddd;
    border-radius: 8rpx;

    .plus {
      font-size: 40rpx;
      color: #999;
    }

    .upload-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}

.protocol {
  margin-top: 40rpx;
  font-size: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  padding: 10rpx 0;

  text {
    color: #1673fe;
  }
}

// 覆盖上传组件默认样式
:deep(.up-upload) {
  .upload-list {
    margin: 0;
  }

  .u-upload__wrap {
    margin: 0;
  }
}
</style>

<style>
page {
  background-color: #f7f8fc;
}
</style>
