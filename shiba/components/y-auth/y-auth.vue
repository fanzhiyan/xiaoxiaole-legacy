<template>
  <view>
    <u-popup @close="(stateOption.show = false), toggleModal('error')" :round="20" :zIndex="99999" :show="showLogin" :overlay-opacity="0.4">
      <view class="auth-container">
        <!-- WX.LOGIN-->
        <view class="button-wrapper" v-if="stateOption.mode === Mode.LOGIN">
          <up-button :customStyle="{ height: '80rpx', color: '#FFF' }" @tap="handleWxLogin" color="var(--l-primary-color)">
            {{ buttonText }}
          </up-button>
          <view class="policy-container">
            <y-radio v-model="stateData.isRule" size="30rpx"></y-radio>
            <view class="policy-text">
              我已阅读
              <text class="policy-link" @click="$y.ViewProtocol('用户协议', 1)">《用户协议》</text>
              与
              <text class="policy-link" @click="$y.ViewProtocol('隐私政策', 2)">《隐私政策》</text>
            </view>
          </view>
        </view>
        <!-- 获取手机号 -->
        <view class="button-wrapper" v-if="stateOption.mode === Mode.PHONE">
          <up-button :customStyle="{ height: '80rpx', color: '#FFF' }" @getphonenumber="handlePhoneNumber" openType="getPhoneNumber" color="var(--l-primary-color)">
            {{ buttonText }}
          </up-button>
          <view class="policy-container">
            <y-radio v-model="stateData.isRule" size="30rpx"></y-radio>
            <view class="policy-text">
              我已阅读
              <text class="policy-link" @click="$y.ViewProtocol('用户协议', 1)">《用户协议》</text>
              与
              <text class="policy-link" @click="$y.ViewProtocol('隐私政策', 2)">《隐私政策》</text>
            </view>
          </view>
        </view>
        <!-- 获取头像 -->
        <view class="button-wrapper" v-if="stateOption.mode === Mode.AVATAR">
          <up-button
            :customStyle="{ height: '80rpx', color: 'var(--l-color-theme)' }"
            @chooseAvatar="handleChooseAvatar"
            openType="chooseAvatar"
            color="var(--l-primary-color)"
            :text="buttonText"></up-button>
          <view class="policy-container">
            <y-radio v-model="stateData.isRule" size="30rpx"></y-radio>
            <view class="policy-text">
              我已阅读
              <text class="policy-link" @click="$y.ViewProtocol('用户协议', 1)">《用户协议》</text>
              与
              <text class="policy-link" @click="$y.ViewProtocol('隐私政策', 2)">《隐私政策》</text>
            </view>
          </view>
        </view>
        <!-- 获取昵称 -->
        <view class="button-wrapper" v-if="stateOption.mode === Mode.NAME">
          <view class="avatar-box">
            <u-avatar size="120rpx"></u-avatar>
          </view>
          <up-button
            :customStyle="{ height: '80rpx', color: '#fff' }"
            @getUserInfo="handleChooseName"
            openType="getUserInfo"
            color="var(--l-primary-color)"
            :text="buttonText"></up-button>
          <view class="policy-container">
            <y-radio v-model="stateData.isRule" size="30rpx"></y-radio>
            <view class="policy-text">
              我已阅读
              <text class="policy-link" @click="$y.ViewProtocol('用户协议', 1)">《用户协议》</text>
              与
              <text class="policy-link" @click="$y.ViewProtocol('隐私政策', 2)">《隐私政策》</text>
            </view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { isFunction } from "../libs/utils";
import { ref, inject, reactive, watch, computed } from "vue";
import { AvatarEvent, PhoneNumberEvent, Props, UserInfoEvent, MessageOptions, Mode, MessageResult, MessageMerge } from "./type.d";
import { defaultOptions, messageDefaultOptionKey } from "./index";
import shiba from "../..";
const showLogin = computed(() => shiba.$store("modal").Auth);
// 定义组件的默认属性
const props = withDefaults(defineProps<Props>(), {
  selector: "",
});
// 根据 selector 获取对应的 message 选项 key
const popupOptionKey = props.selector ? `${messageDefaultOptionKey}${props.selector}` : messageDefaultOptionKey;
// 注入 message 选项
const messageOption = inject(popupOptionKey, ref<MessageOptions>(defaultOptions));
/**
 * 定义响应式的 stateOption，用于存储 message 选项的状态
 */
let stateOption = reactive<Omit<MessageOptions & MessageMerge, "onConfirm" | "onCancel">>({
  title: "授权登录",
  show: false,
  mode: Mode.PHONE,
  type: "alert",
});

// 计算按钮文本
const buttonText = computed(() => {
  switch (stateOption.mode) {
    case Mode.PHONE:
      return "授权登录";
    case Mode.AVATAR:
      return "授权获取头像";
    case Mode.NAME:
      return "授权获取昵称";
    default:
      return "授权登录";
  }
});

/**
 * 如果是输入框时候值
 * @param
 */
let PromptValue = ref("");
/**
 * 处理确认操作
 * @param result - 确认结果
 */
const handleConfirm = (result: MessageResult) => {
  stateOption.show = false;
  if (isFunction(onConfirm)) {
    onConfirm(result);
  }
};

/**
 * 处理取消操作
 * @param result - 取消结果
 */
const handleCancel = (result: MessageResult) => {
  stateOption.show = false;
  if (isFunction(onCancel)) {
    onCancel(result);
  }
};

// 定义确认和取消的回调函数
let onConfirm = (result: MessageResult) => {};
let onCancel = (result: MessageResult) => {};

/**
 * 点击操作
 * @param action 操作类型 ('confirm' | 'cancel')
 */
function toggleModal(action: "success" | "error", data: any) {
  const payload = { action, value: data };

  switch (action) {
    case "success":
      handleConfirm(payload);
      break;
    case "error":
      handleCancel(payload);
      break;
  }
}

// 正式逻辑
const handlePhoneNumber = (e: PhoneNumberEvent) => {
  if (!stateData.isRule)
    return uni.showToast({
      icon: "none",
      title: "请阅读并同意协议",
    });
  if (e.detail.errMsg === "getPhoneNumber:ok") {
    console.log("用户手机号信息:", e.detail);
    // 这里可以将手机号信息发送到后台进行解密
    toggleModal("success", e.detail);
  } else {
    console.error("获取手机号失败:", e.detail.errMsg);
    toggleModal("error");
  }
};

// login 直接登录
const handleWxLogin = async () => {
  if (!stateData.isRule)
    return uni.showToast({
      icon: "none",
      title: "请阅读并同意协议",
    });
  const LOGINRES = await uni.login();
  console.log(LOGINRES, "LOGINRES");
  if (LOGINRES.errMsg === "login:ok") {
    // 这里可以将手机号信息发送到后台进行解密
    const da = await shiba.$api.wechat.wxLogin({
      code: LOGINRES.code,
    });
    uni.$store("modal").SETKEYDATA("Auth", false);
    uni.$store("user").SETKEYDATA("isLogin", true);
    uni.$store("user").SETKEYDATA("token", da.data.userinfo.token);
    uni.$store("user").Login();
    toggleModal("success");
  } else {
    toggleModal("error");
  }
};

const handleChooseAvatar = (e: AvatarEvent) => {
  console.log("用户头像信息:", e.detail.avatarUrl);
  // 这里可以将头像信息发送到后台进行处理
};

const handleChooseName = (e: UserInfoEvent) => {
  console.log("用户昵称信息:", e.detail.userInfo.nickName);
};

let stateData = reactive({
  isRule: false,
});

/**
 * 初始化 message 选项
 * @param option - message 选项
 */
const initMessage = (option: MessageOptions & MessageMerge) => {
  if (!option) return;
  stateOption.show = option.show;
  stateOption.mode = option.mode as Mode;
  stateOption.title = option.title;
  stateOption.type = option.type;
  onCancel = option.onCancel;
  onConfirm = option.onConfirm;
};

watch(
  () => messageOption,
  (newValue) => {
    initMessage(newValue.value as MessageOptions & MessageMerge);
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.auth-container {
  min-height: 320rpx;
  display: flex;
  align-items: center;
}

.button-wrapper {
  width: 70%;
  margin: 20rpx auto;
}

.policy-container {
  align-items: center;
  display: flex;
  justify-content: center;
  height: 80rpx;
  color: #999;
}

.policy-text {
  margin-left: 10rpx;
  font-size: 25rpx;
  color: #000;
}

.policy-link {
  color: red;
}

.avatar-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20rpx auto;
}

.action-btn {
  width: 90%;
  margin: 20rpx auto;
}
</style>
