<template>
  <y-layout>
    <view class="from-content">
      <view class="from-item">
        <view class="content-text">
          <view class="title">
            <u-input placeholder="添加标题(4-20字，精准概括需求)" v-model="title"></u-input>
          </view>
          <view class="textarea-content">
            <textarea placeholder="添加正文，详细描述你的需求，禁止填写个信息、禁止发布违反学校规定及涉嫌违法等信息" v-model="introduce"></textarea>
          </view>
        </view>
        <view class="upload">
          <up-upload width="150rpx" height="150rpx" :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="1" multiple :maxCount="6"></up-upload>
          <view class="num">{{ fileList.length }}/6张</view>
        </view>
      </view>
      <view class="from-item">
        <view class="label">选择标签</view>
        <view class="tag-list">
          <view class="tag-item" :class="{ active: item.id == label }" v-for="item in tagList" :key="item.id" @click="selectTag(item)">{{ item.title }}</view>
        </view>
      </view>
      <!-- 联系方式 -->
      <view class="from-item contact">
        <view class="from-row">
          <view class="label">选择标签</view>
          <view class="label" @click="showContactPicker = true">
            {{ contactTypeText }}
            <text class="shiba-next"></text>
          </view>
        </view>
        <view class="value">
          <u-input placeholder="请输入联系方式" v-model="contactNo"></u-input>
        </view>
      </view>
      <!-- 推广价格 -->
      <view class="from-item prom">
        <view class="from-row">
          <view class="label">推广价格</view>
        </view>
        <view class="tag">
          <view class="tag-item" :class="{ 'tag-item-active': item.id == cycleId }" v-for="item in cycleList" :key="item.id" @click="selectCycle(item)">
            <view class="day">{{ item.title }}</view>
            <view class="price l-price">{{ item.price }}</view>
            <view class="ribbon" v-if="item.discount">
              <text>{{ item.discount }}折</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <y-fixed-bottom bottom="20rpx">
      <u-button
        shape="circle"
        :customStyle="{ width: '640rpx', height: '88rpx', color: 'rgba(51, 51, 51, 1)', fontSize: '32rpx', fontWeight: 'bold' }"
        color="rgba(255, 217, 114, 1)"
        text="发布"
        @click="submitForm"></u-button>
    </y-fixed-bottom>

    <!-- 联系方式选择器 -->
    <u-picker :show="showContactPicker" :columns="contactTypeColumns" @confirm="confirmContactType" @cancel="showContactPicker = false"></u-picker>
  </y-layout>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import shiba from "@/shiba";
// 标题
const title = ref("");
// 内容
const introduce = ref("");
// 联系方式
const contactNo = ref("");
// 联系方式类型：1.微信，2.QQ，3.手机号
const contactType = ref(1);
const contactTypeText = ref("微信");
const showContactPicker = ref(false);
const contactTypeColumns = ref([
  [
    { id: 1, text: "微信" },
    { id: 2, text: "QQ" },
    { id: 3, text: "手机号" },
  ],
]);
// 图片列表
const fileList = ref([]);
// 选中的标签
const label = ref("");
// 标签列表
const tagList = ref([]);
// 选中的推广周期
const cycleId = ref("");
// 推广周期列表
const cycleList = ref([]);
// 测试数据，可以删除
const mockTagList = [
  { id: 1, title: "找学习" },
  { id: 2, title: "找资料" },
  { id: 3, title: "找课程" },
  { id: 4, title: "找书籍" },
  { id: 5, title: "找工具" },
];
const mockCycleList = [
  { id: 1, title: "1天", price: "10.00", discount: "3" },
  { id: 2, title: "2天", price: "20.00", discount: "3" },
  { id: 3, title: "3天", price: "30.00", discount: "3" },
  { id: 4, title: "7天", price: "60.00", discount: "3" },
];
const { deletePic, afterRead } = shiba.$hook.useUploadFile(fileList.value);

// 页面加载时执行
onMounted(() => {
  getTagList();
  getCycleList();
});

// 获取标签列表
const getTagList = async () => {
  try {
    // 使用模拟数据，实际使用时替换为API调用
    const res = await shiba.$api.public.getGrassLabel();
    tagList.value = res.data;

    if (tagList.value.length > 0) {
      label.value = tagList.value[0].id;
    }
  } catch (error) {
    uni.$u.toast("获取标签失败");
  }
};

// 获取推广周期列表
const getCycleList = async () => {
  try {
    // 使用模拟数据，实际使用时替换为API调用
    const res = await shiba.$api.api.CycleList();
    cycleList.value = res.data.cycle_list;

    if (cycleList.value.length > 0) {
      cycleId.value = cycleList.value[0].id;
    }
  } catch (error) {
    uni.$u.toast("获取推广价格失败");
  }
};

// 选择标签
const selectTag = (item) => {
  label.value = item.id;
};

// 选择推广周期
const selectCycle = (item) => {
  cycleId.value = item.id;
};

// 确认联系方式类型
const confirmContactType = (e) => {
  const selectedItem = e.value[0];
  contactType.value = selectedItem.id;
  contactTypeText.value = selectedItem.text;
  showContactPicker.value = false;
};

// 表单验证
const validateForm = () => {
  if (!title.value) {
    uni.$u.toast("请输入标题");
    return false;
  }

  if (title.value.length < 4 || title.value.length > 20) {
    uni.$u.toast("标题长度应为4-20字");
    return false;
  }

  if (!introduce.value) {
    uni.$u.toast("请输入正文内容");
    return false;
  }

  if (!label.value) {
    uni.$u.toast("请选择标签");
    return false;
  }

  if (!contactNo.value) {
    uni.$u.toast("请输入联系方式");
    return false;
  }

  if (!cycleId.value) {
    uni.$u.toast("请选择推广价格");
    return false;
  }

  return true;
};

// 提交表单
const submitForm = async () => {
  if (!validateForm()) return;

  try {
    // 处理图片
    const imageUrls = fileList.value.map((item) => item.fileUrl).join(",");

    // 构建提交数据
    const formData = {
      title: title.value,
      introduce: introduce.value,
      label: label.value,
      contact_type: contactType.value,
      contact_no: contactNo.value,
      cycle_id: cycleId.value,
      image: imageUrls,
      cate: 1, // 推广类型为1
      topic_id: shiba.$store("app").user_topic_id || "",
    };

    // 发送请求
    const res = await shiba.$api.public.PublishGrass(formData);
    const orderInfoRes = await shiba.$api.api.SubmitPay({
      pay_type: 26,
      relation_type: 1,
      relation_id: res?.data?.grass_id,
    });

    let orderInfo = orderInfoRes.data.pay_info;
    console.log(orderInfoRes, "orderInfoRes");
    uni.requestPayment({
      provider: "wxpay",
      ...orderInfo,
      success: function (res) {
        uni.$u.route({
          url: "/pages/public/result",
          type: "redirect",
          params: {
            type: "unreturnable",
            title: "发布成功",
          },
        });
      },
    });
  } catch (error) {
    uni.$u.toast("发布失败，请重试");
  }
};
</script>

<style lang="scss" scoped>
.from-content {
  width: 694rpx;
  margin: 0 auto;

  .prom {
    .from-row {
      justify-content: space-between;
      display: flex;
      width: 100%;
      flex-shrink: 0;
    }

    .tag {
      display: flex;
      gap: 20rpx;

      .tag-item-active {
        color: #f5aa00 !important;
        background-color: rgba(245, 170, 0, 0.1) !important;
      }

      .tag-item {
        position: relative;

        // &::before {
        // 	text-align: right;
        // 	content: "3";
        //     position: absolute;
        //     top: 0; /* 调整位置 */
        // 	right: 0;
        //     width: 0;
        // 	color: red;
        //     height: 0;
        //     border-bottom: 50rpx solid transparent;
        //     border-left: 50rpx solid transparent;
        //     border-right: 50rpx solid orange;
        // }

        width: 98rpx;
        height: 108rpx;
        background: #f6f7f9;
        border-radius: 12rpx 12rpx 12rpx 12rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 22rpx;
        overflow: hidden;
        .price {
          font-size: 22rpx;
          color: #333333;
        }
        .day {
          height: 50rpx;
          line-height: 50rpx;
        }

        .ribbon {
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-top: 50rpx solid orange;
          border-left: 50rpx solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ribbon text {
          position: absolute;
          top: -47rpx;
          right: 5rpx;
          color: #fff;
          font-size: 12rpx;
          // transform: rotate(80deg);
        }
      }
    }
  }

  // 联系方式
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
    padding-bottom: 20rpx;

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
</style>
<style>
page {
  background-color: #fff;
}
</style>
