<template>
  <view>
    <up-navbar autoBack title="我的资料" :placeholder="true"></up-navbar>
    <view class="profile-form">
      <view class="form-item">
        <text class="label">头像</text>
        <view class="avatar-wrapper">
          <!-- #ifdef MP -->
          <button class="avatar-upload" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
            <u-avatar width="80rpx" height="80rpx" :src="$y.oss(stateFrom.avatar)" mode="aspectFit"></u-avatar>
          </button>
          <!-- #endif -->
          <!-- #ifndef MP -->
          <button @click="onChangeAvatar" class="avatar-upload">
            <u-avatar width="80rpx" height="80rpx" :src="$y.oss(stateFrom.avatar)" mode="aspectFit"></u-avatar>
          </button>
          <!-- #endif -->
        </view>
      </view>

      <view class="form-item">
        <text class="label">昵称</text>
        <input v-model="stateFrom.nickname" placeholder="请输入昵称" class="input-field" />
      </view>

      <view class="form-item">
        <text class="label">手机号</text>
        <view class="mobile">
          <view class="" v-if="stateFrom.mobile">
            {{ stateFrom.mobile }}
          </view>
          <up-button
            v-else
            :customStyle="{ height: '80rpx', width: '340rpx', color: '#FFF', margin: '0' }"
            @getphonenumber="handlePhoneNumber"
            openType="getPhoneNumber"
            color="var(--l-primary-color)">
            授权绑定手机号
          </up-button>
        </view>
      </view>
    </view>
  </view>

  <y-fixed-bottom bottom="20rpx">
    <u-button shape="circle" @click="saveUserInfo" :custom-style="{ width: '702rpx', height: '90rpx' }" text="保存" color="var(--l-primary-color)"></u-button>
  </y-fixed-bottom>
</template>

<script setup>
import shiba from "@/shiba";
import { isEmpty } from "@/shiba/rules/from";
import { onLoad } from "@dcloudio/uni-app";
import { computed, reactive, ref, watch } from "vue";
const UseUserStore = uni.$store("user");
onLoad(() => {
  UseUserStore.GetUser();
});

// 视图
let state = reactive({
  birthdayShow: false,
});

// 表单项
let stateFrom = reactive({
  nickname: "",
  gender: "",
  birthday: "",
  avatar: "",
  mobile: "",
});

const confirmPicker = (type, event) => {
  if (type == "gender") {
    stateFrom.gender = event.value[0].value;
    state.gender.show = false;
  }
  if (type == "birthday") {
    stateFrom.birthday = uni.$y.formatTime(event.value, "yyyy-mm-dd");
    state.birthdayShow = false;
  }
};

// 保存
const saveUserInfo = async () => {
  if (isEmpty(stateFrom.nickname)) return uni.$y.toast("请输入昵称");
  if (isEmpty(stateFrom.mobile)) return uni.$y.toast("请输入手机号");
  const res = await shiba.$api.api.EditUserProfile(stateFrom);
  UseUserStore.GetUser();
  uni.navigateBack();
};

async function uploadAvatar(tempUrl) {
  if (!tempUrl) return;
  const res = await shiba.$api.upload.uploadFile(tempUrl);
  stateFrom.avatar = res.data.url;
}

// 更换头像
function onChooseAvatar(e) {
  const tempUrl = e.detail.avatarUrl || "";
  uploadAvatar(tempUrl);
}

//修改头像
function onChangeAvatar(source) {
  uni.chooseImage({
    count: 1,
    sourceType: [source],
    sizeType: ["original", "compressed"],
    success: async (chooseImageRes) => {
      const tempUrl = chooseImageRes.tempFilePaths[0];
      uploadAvatar(tempUrl);
    },
  });
}
// 正式逻辑
const handlePhoneNumber = async (e) => {
  if (e.detail.errMsg === "getPhoneNumber:ok") {
    console.log("用户手机号信息:", e.detail);
    // 这里可以将手机号信息发送到后台进行解密
    const res = await shiba.$api.api.BindWxCodePhone({
      code: e.detail.code,
    });
    uni.$store("user").Login();
  } else {
    uni.showToast({
      title: "绑定失败",
      icon: "none",
    });
  }
};

watch(
  () => UseUserStore.user,
  (newValue) => {
    stateFrom.nickname = newValue.nickname;
    stateFrom.avatar = newValue.avatar;
    stateFrom.mobile = newValue.mobile || "";
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style lang="scss" scoped>
.profile-form {
  background: #fff;
  padding: 20rpx;

  .form-item {
    display: flex;
    align-items: center;
    padding: 30rpx 0;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }
    .mobile {
      width: calc(100% - 140rpx);
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .label {
      width: 120rpx;
      font-size: 28rpx;
      color: #333;
    }

    .input-field {
      flex: 1;
      text-align: right;
      color: #666666;
      font-size: 28rpx;
      padding: 0 20rpx;
    }

    .avatar-wrapper {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .avatar-upload {
        background: transparent;
        padding: 0;
        margin: 0;
        line-height: 1;

        &::after {
          border: none;
        }
      }
    }
  }
}
</style>

<style>
page {
  background-color: #f8f8f8 !important;
}
</style>
