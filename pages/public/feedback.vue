<template>
  <y-layout :coustom="!false" class="feedback-container">
    <u-navbar autoBack :placeholder="true" title="意见反馈"></u-navbar>
    <y-gap height="2rpx"></y-gap>
    <view class="feedback-type l-p l-bg-white">
      <view class="title">反馈类型</view>
      <view class="options l-f">
        <view class="option" @click="state.model.type = item.title" :class="{ active: state.model.type == item.title }" v-for="item in state.view.TypeList">
          {{ item.title }}
        </view>
      </view>
    </view>
    <view class="issue-description l-p l-bg-white">
      <view class="title">问题描述</view>
      <view class="textarea">
        <up-textarea v-model="state.model.content" class="textarea" placeholder="问题描述的越详细，有助于我们更快的解决问题"></up-textarea>
      </view>
    </view>
    <y-gap height="20rpx"></y-gap>
    <view class="upload-section l-p l-bg-white">
      <up-upload :fileList="state.view.fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple :maxCount="10"></up-upload>
      <view class="l-text-gray l-fs-sm">请上传应用截图，最多上传5张</view>
    </view>

    <u-button
      @click="SendFrom"
      shape="circle"
      :customStyle="{ width: '702rpx', margin: '30rpx auto', height: '88rpx' }"
      color="#1673FE"
      text="提交反馈"
      class="submit-button"></u-button>
    <u-button
      @click="$u.route('/pages/public/feedback-list')"
      shape="circle"
      :customStyle="{ width: '702rpx', height: '88rpx' }"
      color="#1673FE"
      plain
      text="反馈记录"
      class="submit-button"></u-button>

    <!-- <y-fixed-bottom bottom="20rpx" class="submit-section">
		
		
     
    </y-fixed-bottom> -->
  </y-layout>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import shiba from "@/shiba";
import { onLoad } from "@dcloudio/uni-app";
import { isEmpty } from "@/shiba/rules";
onLoad(() => {
  GetFeedBackType();
});
let state = reactive({
  view: {
    TypeList: [],
    fileList1: [],
  },
  model: {
    content: "",
    type: "",
    images: "",
  },
});
const { deletePic, afterRead } = shiba.$hook.useUploadFile(state.view.fileList1);
const GetFeedBackType = async () => {
  const res = await shiba.$api.api.GetFeedbackTypeList();
  state.view.TypeList = res.data;
};

// 提交内容
const SendFrom = async () => {
  state.model.images = state.view.fileList1.map((items) => items.fileUrl).join(",");
  if (isEmpty(state.model.type)) return uni.$y.toast("请选择反馈类型");
  if (isEmpty(state.model.content)) return uni.$y.toast("请输入反馈内容");
  const res = await shiba.$api.api.AddFeedback(state.model);
  uni.navigateBack();
  // uni.redirectTo({
  //   url: "/pages/public/result?icon=sucess&title=您的意见我们已收到&subTitle=我们工作人员将会对您的问题进行处理&type=common",
  // });
};
</script>

<style scoped lang="scss">
/* 您可以根据这些类名来编写相应的CSS样式 */
.feedback-container {
  /* 反馈容器的整体样式 */
}

.issue-description {
  .title {
    padding: 10rpx 0;
    font-size: 32rpx;
    color: #1a1a1a;
    font-weight: bold;
  }

  .textarea {
    min-height: 200rpx;

    ::v-deep(.u-textarea) {
      padding: 0;
    }
  }
}

.feedback-type {
  .title {
    padding: 10rpx 0;
    font-size: 32rpx;
    color: #1a1a1a;
    font-weight: bold;
  }

  .options {
    flex-wrap: wrap;
    gap: 10rpx;
    padding: 20rpx 0;

    .active {
      color: #de3625;
      border: solid #de3625 1rpx;
    }

    .option {
      background: rgba(224, 225, 226, 0.4);
      width: 206rpx;
      height: 64rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 32rpx;
    }
  }
}
</style>
