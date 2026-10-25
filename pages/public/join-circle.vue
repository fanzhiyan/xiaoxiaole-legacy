<template>
  <y-layout>
    <view class="content">
      <view class="content-tips">
        和任意上海大万能墙沟通的截图(包含自己的微信头像，不要只截图墙的，必须露出自己微信头像!!!)(微信表白墙，情报站，小黄鸭，墙墙墙是外校的别)一律不通过!如果没有墙的，请加微信号SHSHU2025
      </view>
      <view class="text-cause">
        <up-textarea maxlength="-1" auto-height v-model="state.content" placeholder="请输入内容"></up-textarea>
      </view>
      <view class="upload">
        <up-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="3" multiple :maxCount="10" :previewFullImage="true"></up-upload>
      </view>
    </view>
    <y-fixed-bottom bottom="30rpx">
      <u-button shape="circle" @click="sendForm" text="提交" :customStyle="{ width: '640rpx', height: '88rpx', color: '#333' }" color="#FFD972"></u-button>
    </y-fixed-bottom>
  </y-layout>
</template>

<script setup>
import { reactive, ref } from "vue";
import shiba from "@/shiba";
import { isEmpty } from "@/shiba/rules";
import { onLoad } from "@dcloudio/uni-app";
let state = reactive({
  topic_id: "",
  content: "",
  image: "2222",
});
let fileList1 = ref([]);
const { deletePic, afterRead } = shiba.$hook.useUploadFile(fileList1.value);
onLoad((opction) => {
  state.topic_id = opction?.id;
});

const sendForm = async () => {
  // state.image=fileList1.value.map(items=>items.url)
  if (isEmpty(state.content)) return uni.$y.toast("请输入内容");
  const res = await shiba.$api.public.applyJoin(state);
  console.log(res, "resresresres");
  uni.$u.route({
    url: "/pages/public/result",
    params: {
      title: "申请成功",
      subTitle: "平台正在审核中",
    },
  });
};
</script>

<style lang="scss" scoped>
.content {
  height: 220rpx;
  padding: 10rpx 20rpx;

  .content-tips {
    height: 220rpx;
    color: #666666;
    font-size: 28rpx;
  }

  .upload {
    padding: 20rpx 0;
  }

  .text-cause {
    min-height: 230rpx;
    padding: 20rpx;
    background: #f6f7f9;
    border-radius: 16rpx 16rpx 16rpx 16rpx;

    :deep(.u-textarea) {
      background: #f6f7f9;
      padding: 0;
    }
  }
}
</style>
<style>
page {
  background-color: #fff;
}
</style>
