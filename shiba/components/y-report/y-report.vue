<template>
  <!-- 举报 -->
  <up-popup @close="emits('update:modelValue', false)" :show="modelValue" zIndex="99999" :round="20">
    <view class="popup-content-report">
      <view class="header">
        <view class="header-title">举报</view>
        <view class="instructions-section">
          <view>请选择投诉类型并填写详情</view>
        </view>
        <view class="complaint-list">
          <view class="complaint-item" @click="state.complaintId = item.id" :class="{ active: state.complaintId == item.id }" v-for="item in state.complaint">
            {{ item.title }}
          </view>
        </view>
      </view>
      <u-gap bg-color="#F6F7F9"></u-gap>
      <view class="content-data">
        <u-textarea height="200rpx" v-model="state.body" maxlength="120" autoHeight placeholder="请填写投诉原因，以提高工作人员的核实效率"></u-textarea>
        <view class="attachment-section">
          <view class="upload-box">
            <up-upload @afterRead="afterRead" @delete="deletePic" name="" multiple :maxCount="6" :fileList="state.image"></up-upload>
          </view>
          <view class="upload-tips">最多选择6张</view>
        </view>
        <view class="send">
          <u-button @tap="submit" color="#1673FE" :customStyle="{ height: '90rpx', color: '#fff' }" text="提交" shape="circle"></u-button>
        </view>
      </view>
    </view>
  </up-popup>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import shiba from "@/shiba";
import { isEmpty } from "@/shiba/rules";
const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  // type
  mode: {
    type: [Number, String],
    default: "1",
  },
  grass_id: {
    type: [Number, String],
    default: "",
  },
});

const state = reactive({
  complaint: [],
  complaintId: "",
  image: [],
  body: "",
});
const { deletePic, afterRead } = shiba.$hook.useUploadFile(state.image);
// 获取举报类型
const GetGrassReportType = async () => {
  const res = await shiba.$api.public.GetGrassReportType();
  state.complaint = res.data;
};

const submit = async () => {
  if (isEmpty(state.complaintId)) return uni.$y.showToast("请选择举报类型");
  if (isEmpty(state.body)) return uni.$y.showToast("请输入举报内容");
  const res = await shiba.$api.public.reportGrass({
    grass_id: props.grass_id,
    type_id: state.complaintId,
    body: state.body,
    thumb: state.image.map((items) => items.fileUrl).join(","),
    type: props.mode,
  });

  if (res.code == 1) {
    console.log("res", res);
    state.complaintId = "";
    state.body = "";
    state.image = [];
    uni.$y.showToast("举报成功");
  }
  emits("update:modelValue", false);
};
onMounted(() => {
  GetGrassReportType();
});
</script>

<style lang="scss" scoped>
// 举报
.popup-content-report {
  .header {
    padding: 0 20px;

    .header-title {
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
    }

    .instructions-section {
      display: flex;

      .history {
        color: #607fd0;
      }

      justify-content: center;
      height: 80rpx;
      line-height: 80rpx;
    }

    .complaint-list {
      display: flex;
      flex-wrap: wrap;
      gap: 15rpx;
      padding-bottom: 20rpx;

      .active {
        background-color: #1673fe !important;
        color: #fff !important;
      }

      .complaint-item {
        transition: all 1s;
        width: 206rpx;
        background: #f6f7f9;
        color: #666666;
        font-weight: bold;
        border-radius: 8rpx 8rpx 8rpx 8rpx;
        height: 64rpx;
        font-size: 25rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .content-data {
    padding: 0 20rpx;

    .attachment-section {
      .upload-box {
        margin-bottom: 20rpx;
      }

      .upload-tips {
        height: 50rpx;
        line-height: 50rpx;
        color: #999999;
        font-size: 28rpx;
      }
    }

    .send {
      margin-top: 80rpx;
      padding-bottom: 30rpx;
    }
  }
}
</style>
