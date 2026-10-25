<template>
  <y-layout>
    <view class="from-content">
      <view class="from-item">
        <view class="content-text">
          <view class="title">
            <u-input v-model="state.title" placeholder="添加标题(4-20字，精准概括需求)"></u-input>
          </view>
          <view class="textarea-content">
            <textarea v-model="state.content" placeholder="添加正文，详细描述你的需求，禁止填写个信息、禁止发布违反学校规定及涉嫌违法等信息"></textarea>
          </view>
        </view>
        <view class="upload">
          <up-upload @afterRead="afterRead" @delete="deletePic" name="" multiple :maxCount="6" :fileList="state.images"></up-upload>
          <view class="num">{{ state?.images?.length }}/6张</view>
        </view>
      </view>
      <view class="upload-from">
        <view class="from-title">基础信息</view>
        <view class="from-item">
          <view>活动主题</view>
          <view @click="stateModal.TypeGroupShow = true">
            {{ stateModal.ActiveType?.name ? stateModal.ActiveType?.name : "请选择" }}
            <text class="shiba-next"></text>
          </view>
        </view>
        <view class="from-item">
          <view>活动人数</view>
          <view>
            <up-number-box min="2" v-model="state.number"></up-number-box>
          </view>
        </view>
        <view class="from-item">
          <view>截止时间</view>
          <view @click="stateModal.TimeShow = true">
            {{ state.endtime ? state.endtime : "请选择" }}
            <text class="shiba-next"></text>
          </view>
        </view>
      </view>
    </view>
    <y-fixed-bottom bottom="20rpx">
      <u-button
        @click="send"
        shape="circle"
        :customStyle="{ width: '640rpx', height: '88rpx', color: 'rgba(51, 51, 51, 1)', fontSize: '32rpx', fontWeight: 'bold' }"
        color="rgba(255, 217, 114, 1)"
        text="发布"></u-button>
    </y-fixed-bottom>
    <up-picker @confirm="confirmType" @cancel="stateModal.TypeGroupShow = false" keyName="name" :show="stateModal.TypeGroupShow" :columns="stateModal.TypeGroup"></up-picker>
    <up-datetime-picker
      :minDate="new Date()"
      @cancel="stateModal.TimeShow = false"
      @confirm="confirmTime"
      :show="stateModal.TimeShow"
      v-model="stateModal.endTime"
      mode="datetime"></up-datetime-picker>
  </y-layout>
</template>
<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive } from "vue";
import shiba from "@/shiba";
import { formatTime } from "@/shiba/libs";
import { isEmpty } from "@/shiba/rules/from";
const state = reactive({
  /**
   * 标题
   */
  title: "",
  /**
   * 内容
   */
  content: "",
  /**
   * 结束时间
   */
  endtime: "",
  /**
   * 图片
   */
  images: [],
  /**
   * 人数
   */
  number: 2,

  /**
   * 主题id
   *
   */
  type_id: "",
});

let stateModal = reactive({
  // ---type
  TypeGroup: [[]],
  // 选中的type
  ActiveType: {
    id: "",
    name: "",
  },
  TypeGroupShow: false,
  // ---time
  TimeShow: false,
  endTime: 0,
});
const { deletePic, afterRead } = shiba.$hook.useUploadFile(state.images);
onLoad(() => {
  getType();
});
const getType = async () => {
  const res = await shiba.$api.public.getType();
  stateModal.TypeGroup[0] = res.data;
};
// 选择类型
const confirmType = (ee) => {
  stateModal.ActiveType = ee.value[0];
  stateModal.TypeGroupShow = false;
  state.type_id = stateModal.ActiveType.id;
};
// 选择时间
const confirmTime = (ee) => {
  state.endtime = formatTime(ee.value, "yyyy-mm-dd hh:MM");
  stateModal.TimeShow = false;
};
// 发布
const send = async () => {
  if (isEmpty(state.title)) return uni.$y.toast("请输入标题");
  if (isEmpty(state.content)) return uni.$y.toast("请输入组局内容");
  // if (isEmpty(stateModal.type_id)) return uni.$y.toast("请选择活动主题");
  const res = await shiba.$api.public.publishTeam({
    ...state,
    images: state.images.map((items) => items.fileUrl).join(","),
    topic_id: shiba.$store("app").user_topic_id,
  });
  uni.$u.route({
    url: "/pages/public/result",
    type: "redirect",
    params: {
      title: "发布成功",
      type: "unreturnable",
    },
  });
};
</script>

<style lang="scss" scoped>
.from-content {
  width: 694rpx;
  margin: 0 auto;

  .contact {
    min-height: 200rpx;
    display: flex;
    justify-content: space-between;
    height: 90rpx;
    flex-wrap: wrap;
    align-items: center;

    .from-row {
      justify-content: space-between;
      display: flex;
      width: 100%;
      flex-shrink: 0;
    }

    .value {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .from-item {
    border-bottom: 1rpx solid #eeeeee;

    .value {
      height: 81rpx;
      background: #f6f7f9;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
    }

    .tag-list {
      flex-wrap: wrap;
      display: flex;
      gap: 10rpx;

      .tag-item {
        font-size: 23rpx;
        color: #333333;
        background-color: #f6f7f9;
        padding: 10rpx 20rpx;
        border-radius: 28rpx 28rpx 28rpx 28rpx;
      }

      .active {
        font-size: 23rpx;
        color: #f5aa00;
        background-color: rgba(255, 212, 96, 0.2);
      }
    }

    .label {
      font-size: 28rpx;
      font-weight: 500;
      color: #333333;
      height: 70rpx;
      line-height: 70rpx;
      font-weight: bold;
    }

    .upload {
      padding: 20rpx 0;

      .num {
        width: 150rpx;
      }
    }

    .content-text {
      width: 694rpx;
      height: 334rpx;
      background: #f6f7f9;
      padding: 10rpx;
      border-radius: 16rpx 16rpx 16rpx 16rpx;

      .title {
        height: 80rpx;
        display: flex;
        align-items: center;
        border-bottom: 1rpx solid #eeeeee;
      }

      .textarea-content {
        padding: 10rpx;

        textarea {
          width: 100%;
        }
      }
    }
  }
}

.upload-from {
  width: 700rpx;
  height: 500rpx;

  .from-title {
    font-weight: bold;
    font-size: 32rpx;
    height: 60rpx;
    line-height: 60rpx;
  }

  .from-item {
    display: flex;
    height: 100rpx;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
<style>
page {
  background-color: #fff;
}
</style>
