<template>
  <!-- 评论弹窗 -->
  <up-popup :round="20" :closeable="true" bgColor="#fff" :show="modelValue" z-index="99999" @close="emits('update:modelValue', false)" mode="bottom">
    <view class="emjio-content" :style="{ paddingBottom: keyboardHeight + 'px' }">
      <view class="title">{{ replyType == 0 ? "发表评论" : "发表回复" }}</view>
      <view class="reply-text l-text-cuts" v-if="replyType != 0">
        {{ replyText }}
      </view>
      <view class="text-content">
        <view class="textarea-box">
          <up-textarea
            count
            auto-height
            maxlength="200"
            :adjust-position="false"
            :show-confirm-bar="false"
            v-show="modelValue"
            auto-focus
            :focus="state.focus"
            v-model="state.content"
            :placeholder="placeholder"></up-textarea>
        </view>
        <!-- 上传图片 -->
        <view class="content-imgs">
          <view class="lable">上传图片</view>
          <up-upload @afterRead="afterRead" @delete="deletePic" multiple :maxCount="10" :file-list="state.images" width="140rpx" height="140rpx" max-count="5">
            <up-image width="140rpx" height="140rpx" src="/static/icon/upload_bg.png" mode=""></up-image>
          </up-upload>
        </view>
      </view>
      <!--   <view class="is_anonymity">
        <u-switch :active-value="1" :inactiveValue="0" v-model="state.is_anonymity"></u-switch>
        <text>匿名评论</text>
      </view> -->
      <view class="action-send">
        <!--  <view class="left-action" @click="state.modalShowEmjio = !state.modalShowEmjio">是否匿名</view>
        <view class="btn-send" :class="{ 'disble-sucess': state.content }" @click="sendForm">发布</view> -->
        <u-button @click="sendForm" shape="circle" color="#1673FE" :customStyle="{ width: '630rpx', height: '88rpx' }">提交评论</u-button>
      </view>
      <!-- <scroll-view scroll-y="true" class="scroll-emjio" v-show="state.modalShowEmjio">
        <view class="emjios">
          <view class="emjio-item" @click="emjioAdd(item)" v-for="(item, index) in emojio" :key="index">
            <u-image width="60rpx" height="60rpx" :src="$y.oss(`/uploads/emojis/${item.url}`)" mode="aspectFit"></u-image>
          </view>
        </view>
      </scroll-view> -->
    </view>
  </up-popup>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import emojio from "@/shiba/utils/emjio";
import shiba from "@/shiba";

const props = defineProps({
  placeholder: {
    type: String,
    default: "请输入内容",
  },
  replyText: {
    type: String,
    default: "",
  },
  replyType: {
    type: Number,
    default: 0,
  },
  // 展示一隐藏
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["send"]);
let state = reactive({
  modalShowEmjio: false,
  content: "",
  images: [],
  focus: false,
  // 是否匿名评论
  is_anonymity: 0,
});

const keyboardHeight = ref(0);

const keyboardHeightChangeHandler = (res) => {
  keyboardHeight.value = res.height;
  console.log("键盘高度变化：", res.height, keyboardHeight.value);
};

const { deletePic, afterRead } = shiba.$hook.useUploadFile(state.images);

// 表情包添加
const emjioAdd = (item) => {
  console.log(item);
  if ((state.content + item.alt).length > 110) {
    return uni.showToast({
      icon: "none",
      title: "超出最大字数限制",
    });
  }
  state.content += item.alt;
};
// 发送
const sendForm = () => {
  if (!state.content && state.images.length == 0)
    return uni.showToast({
      icon: "none",
      title: "图片或文本评论至少一项内容不为空",
    });
  emits("send", {
    content: state.content,
    is_anonymity: state.is_anonymity,
    images: state.images
      .map((items) => items.fileUrl)
      .filter((item) => item != "")
      .join(","),
  });
  state.is_anonymity = 0;
  state.content = "";
  state.images.length = 0;
  state.modalShowEmjio = false;
};
watch(
  () => props.modelValue,
  (ee) => {
    nextTick(() => {
      state.focus = ee;
    });
  }
);

onMounted(() => {
  // Register keyboard height listener
  uni.onKeyboardHeightChange(keyboardHeightChangeHandler);
});

// Remove the listener when the component is unmounted
onUnmounted(() => {
  uni.offKeyboardHeightChange(keyboardHeightChangeHandler);
});
</script>

<style lang="scss" scoped>
.comment-input {
  width: 750rpx;
  height: 104rpx;
  background: #ffffff;
  box-shadow: 0rpx -2rpx 4rpx 1rpx rgba(0, 0, 0, 0.06);
  border-radius: 0rpx 0rpx 0rpx 0rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10rpx;

  .home {
    width: 110rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .input_text {
    padding: 0 20rpx;
    width: 614rpx;
    height: 72rpx;
    background: #f6f7f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 36rpx 36rpx 36rpx 36rpx;

    .placeholder {
      display: flex;
      gap: 15rpx;
      font-size: 28rpx;
      color: #999999;
    }

    .icon {
      display: flex;
      gap: 20rpx;
    }
  }
}

.emjio-content {
  padding: 0 20rpx;

  transition: padding-bottom 0.2s ease-out;
  .reply-text {
    height: 60rpx;
    color: #999999;
    font-size: 28rpx;
    line-height: 30rpx;
    margin-bottom: 10rpx;
  }
  .title {
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    color: #333333;
    font-size: 32rpx;
    font-weight: 700;
  }
  .is_anonymity {
    display: flex;
    align-items: center;
    gap: 15rpx;
    color: #999999;
    font-size: 28rpx;
    height: 90rpx;
    font-weight: 600;
  }
  .action-send {
    padding: 15rpx 0;
  }
  .text-content {
    padding-bottom: 20rpx;
    border-radius: 20rpx;
    overflow: hidden;
    background-color: #fff !important;

    .content-imgs {
      // height: 150rpx;
      .lable {
        height: 80rpx;
        font-size: 28rpx;
        line-height: 80rpx;
      }
    }
  }

  .icon-action {
    display: flex;
    justify-content: space-between;
    height: 90rpx;
    align-items: center;

    .left-action {
      padding: 20rpx 0;
      display: flex;
      gap: 20rpx;
    }

    .btn-send {
      background-color: #1673fe;
      width: 100rpx;
      height: 50rpx;
      border-radius: 50rpx;
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 27rpx;
      justify-content: center;
    }
  }

  .scroll-emjio {
    height: 260rpx;

    .emjios {
      display: flex;
      flex-wrap: wrap;

      .emjio-item {
        width: calc(100% / 10);
        height: 70rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.disble-sucess {
  background: #1673fe !important;
  color: #fff !important;
}

.textarea-box {
  padding: 20rpx;
  background: #f7f8fc;

  :deep(.u-textarea) {
    width: 100%;
    // height: 260rpx;
    padding: 15rpx 10rpx;
    background: #f7f8fc;
  }
}
</style>
