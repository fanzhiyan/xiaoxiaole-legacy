<template>
  <y-layout>
    <view class="form-content">
      <view class="notice" v-if="noticeShow">
        <view class="notice-card">
          <up-notice-bar bgColor="#fdf1e5" :text="run_message"></up-notice-bar>
          <text class="icon shiba-close" @click="closeNotice"></text>
        </view>
      </view>
      <view class="form-row l-f l-a-center l-j-between">
        <view class="form-lable">互助类型</view>
        <view class="form-value" @click="openClassifyModal">
          <text :style="{ color: selectedTypeTitle ? '#1673FE' : '' }">{{ selectedTypeTitle || "请选择" }}</text>
          <text class="shiba-next"></text>
        </view>
      </view>
      <view class="form-row l-f l-a-center l-j-between textarea-box">
        <up-textarea
          maxlength="500"
          v-model="state.content"
          placeholder="点击填写具体需求，如从指定地点取快递并送至某宿舍、帮忙打印资料等等有偿互助内容（注意：敏感信息不要在此填写 ）"
          auto-height
          count></up-textarea>
      </view>
      <!-- 地址 -->
      <view class="address">
        <view class="address-header">
          <view class="lable">地址</view>
          <view class="switch-icon">
            <u-switch v-model="state.is_address" :active-value="1" :inactive-value="0"></u-switch>
          </view>
        </view>
        <view class="address-content" v-if="state.is_address == 1">
          <view class="address-start">
            <view class="address-lable">取</view>
            <view class="address-value">
              <input type="text" v-model="state.startaddress" placeholder="请输入取物地址" />
            </view>
          </view>
          <view class="address-end">
            <view class="address-lable end_send">送</view>
            <view class="address-value">
              <input type="text" v-model="state.endaddress" placeholder="请输入送物地址" />
            </view>
          </view>
        </view>
      </view>
      <!-- 期望送达时间 -->
      <view class="form-row l-f l-a-center l-j-between" @click="state.timeShow = true">
        <view class="form-lable">期望送达时间</view>
        <view class="form-value">
          {{ state.expected_time_text || "请选择" }}
          <text class="shiba-next"></text>
        </view>
      </view>
      <!-- 互助佣金 -->
      <view class="runner">
        <vihew class="title">互助佣金</vihew>
        <view class="runner_content">
          <view class="input_se">
            <input type="text" v-model="state.price" placeholder="请输入互助佣金" />
          </view>
          <view class="price">元</view>
        </view>
        <view class="price_tag">
          <view class="price_item" @click="state.price = item.price" v-for="item in state.priceList" :key="item.id">{{ item.title }}</view>
        </view>
      </view>
      <!-- 互助佣金 -->
      <view class="runner">
        <vihew class="title">联系方式(仅接单人可见)</vihew>
        <view class="contant">
          <input type="text" v-model="state.mobile" placeholder="请输入联系方式" />
        </view>
      </view>
      <!-- 上传图片 -->
      <view class="runner">
        <vihew class="title">上传图片(选填)</vihew>
        <view class="image_upload">
          <u-upload width="140rpx" height="140rpx" :fileList="fileList1" @afterRead="afterRead" @delete="deletePic"></u-upload>
        </view>
      </view>
      <!-- 备注(选填) -->
      <view class="runner">
        <vihew class="title">备注(选填)</vihew>
        <view class="remark">
          <up-textarea auto-height v-model="state.remark" maxlength="500" placeholder="请输入备注内容" count></up-textarea>
        </view>
      </view>
    </view>
    <view class="" style="display: flex; align-items: center; justify-self: center">
      <up-image width="260rpx" height="260rpx" :src="$y.oss('/uploads/logo.png')" mode=""></up-image>
    </view>
    <y-fixed-bottom bottom="0">
      <view class="runner_btn">
        <view class="runner_rule">
          <y-radio size="34rpx" v-model="state.agree"></y-radio>
          已阅读并同意
          <text class="rule" @tap="$y.ViewProtocol('校小乐发单协议', 10)">《校小乐发单协议》</text>
        </view>
        <u-button @click="submitData" shape="circle" :customStyle="{ width: '640rpx', height: '88rpx', color: '#fff', fontSize: '32rpx' }" color="#1673FE" :disabled="state.isSubmitting" :loading="state.isSubmitting">
          <view v-if="state.isSubmitting">
            发布中...
          </view>
          <view v-else-if="state.price > 0">
            <text style="padding-right: 10rpx">￥{{ state.price }}</text>
            支付发布
          </view>
          <text v-else>支付发布</text>
        </u-button>
      </view>
    </y-fixed-bottom>

    <!-- 选择互助类型 -->
    <up-popup :show="state.showClassifyModal" @close="state.showClassifyModal = false" :round="20">
      <view class="theme-popup">
        <view class="title">选择互助类型</view>
        <view class="theme-content">
          <scroll-view scroll-y="true" class="top-time-list-scroll" :show-scrollbar="false">
            <view class="top-time-list">
              <view @click="selectClassify(item)" v-for="item in state.GrassRunList" :key="item.id" class="top-time-item" :class="{ active: state.temp_type_id === item.id }">
                <view class="lable">
                  {{ item.title }}
                </view>
                <up-image v-if="state.temp_type_id === item.id" src="/static/icon/check_sucess.png" mode="aspectFit" width="48rpx" height="48rpx"></up-image>
              </view>
            </view>
          </scroll-view>
          <view class="theme-content-btn">
            <u-button @tap="cancelTopTime" shape="circle" text="取消" plain :customStyle="{ width: '300rpx', height: '88rpx' }" color="#1673FE"></u-button>
            <u-button @tap="confirmTopTime" shape="circle" text="确定" :customStyle="{ width: '300rpx', height: '88rpx' }" color="#1673FE"></u-button>
          </view>
        </view>
      </view>
    </up-popup>

    <y-pickup-selector @confirm="confirmTime" v-model="state.timeShow"></y-pickup-selector>
  </y-layout>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive, ref, computed } from "vue";
import shiba from "@/shiba";
import { isEmpty, validatePhoneNumber } from "@/shiba/rules/from";
const topic_id = computed(() => shiba.$store("app").user_topic_id);
const System = computed(() => shiba.$store("app").System);
const run_message = computed(() => shiba.$store("app")?.System?.run_message);
const state = reactive({
  /**
   * 内容
   */
  content: "",
  /**
   * 取物地址
   */
  startaddress: "",
  /**
   * 送物地址
   */
  endaddress: "",
  /**
   * 期望送达时间
   */
  expected_time: "",
  expected_time_text: "",

  /**
   * 图片
   */
  image: [], // 这里存图片对象，提交时转字符串
  /**
   * 是否填写地址：1.是，0.否
   */
  is_address: "0",
  /**
   * 手机号
   */
  mobile: "",
  /**
   * 佣金
   */
  price: "",
  /**
   * 备注
   */
  remark: "",
  /**
   * 学校id
   */
  topic_id: "",
  /**
   * 互助类型id
   */
  type_id: "",
  temp_type_id: "", // 新增
  // 预设的价格
  priceList: [
    {
      id: 1,
      price: 5,
      title: "5元",
    },
    {
      id: 2,
      price: 10,
      title: "10元",
    },
    {
      id: 3,
      price: 15,
      title: "15元",
    },
    {
      id: 4,
      price: 20,
      title: "20元",
    },
    {
      id: 5,
      price: 50,
      title: "50元",
    },
  ],
  // 互助类型
  GrassRunList: [],
  classifyList: [], // 互助分类列表
  showClassifyModal: true, // 控制弹窗显示
  timeShow: false,
  agree: false,
  // 按钮状态控制
  isSubmitting: false,
});
// 图片上传相关
const fileList1 = ref([]);
const { deletePic, afterRead } = shiba.$hook.useUploadFile(fileList1.value);
const submitData = async () => {
  // 防止重复提交
  if (state.isSubmitting) return;
  
  if (!state.agree) return uni.$y.toast("请先阅读并同意协议");
  // 校验互助类型
  if (isEmpty(state.type_id)) return uni.$y.toast("请选择互助类型");
  // 校验内容
  if (isEmpty(state.content)) return uni.$y.toast("请输入内容");

  // 校验地址
  if (state.is_address == 1) {
    if (isEmpty(state.startaddress)) return uni.$y.toast("请输入取物地址");
    if (isEmpty(state.endaddress)) return uni.$y.toast("请输入送物地址");
  }
  // 校验期望送达时间（如需必填可加）
  if (isEmpty(state.expected_time)) return uni.$y.toast("请选择期望送达时间");
  // 校验佣金
  if (isEmpty(state.price) || Number(state.price) < 0) return uni.$y.toast("请输入正确的佣金");
  // 校验联系方式
  if (!validatePhoneNumber(state.mobile)) return uni.$y.toast("请输入正确手机号");
  // 校验学校id
  // if (isEmpty(state.topic_id)) return uni.$y.toast("请选择学校");
  // 校验图片
  // if (!fileList1.value || fileList1.value.length === 0) return uni.$y.toast("请上传图片");

  // 设置提交状态为true，禁用按钮
  state.isSubmitting = true;

  try {
    // 组装数据
    const requestData = {
      content: state.content,
      image: fileList1.value.map((item) => item.fileUrl).join(","),
      is_address: state.is_address,
      mobile: state.mobile,
      price: state.price,
      topic_id: topic_id.value,
      type_id: state.type_id,
    };

    // 可选字段
    if (state.is_address == 1) {
      requestData.startaddress = state.startaddress;
      requestData.endaddress = state.endaddress;
    }
    if (state.expected_time) {
      requestData.expected_time = state.expected_time;
    }
    if (state.remark) {
      requestData.remark = state.remark;
    }

    // 提交
    const res = await shiba.$api.public.PublishRunErrands(requestData);
    // #ifdef H5
    state.isSubmitting = false; // H5环境下直接跳转前恢复按钮状态
    uni.$emit('changePageRunner')
    uni.$u.route({
      url: "/pages/public/result",
      type: "redirect",
      params: {
        title: "您的跑腿订单已发布成功",
        pageTitle: "发布结果",
        success: true,
        showPay: false,
        showManagement: false,
        showMyBtn: true,
        showHome: true,
        showBack: false,
      },
    });
    return; // H5环境下直接返回，不执行支付逻辑
    // #endif
    uni.requestPayment({
      provider: "wxpay",
      ...res.data,
      fail: () => {
        state.isSubmitting = false; // 支付失败后恢复按钮状态
        uni.$u.route({
          url: "/pages/public/result",
          type: "redirect",
          params: {
            title: "支付失败",
            pageTitle: "发布结果",
            success: false,
            showPay: true,
            showManagement: false,
            showHome: true,
            showBack: true,
            payType: "微信支付",
          },
        });
      },
      success(res) {
        state.isSubmitting = false; // 支付成功后恢复按钮状态
        uni.$emit('changePageRunner')
        uni.$u.route({
          url: "/pages/public/result",
          type: "redirect",
          params: {
            payType: "微信支付",
            title: "您的跑腿订单已发布成功",
            pageTitle: "发布结果",
            success: true,
            showPay: false,
            showManagement: false,
            showHome: true,
            showMyBtn: true,
          },
        });
      },
    });
  } catch (error) {
    // 出现错误时恢复按钮状态
    state.isSubmitting = false;
  }
};

onLoad((opction) => {
  if (opction?.id) {
    GrassErrandsDetail(opction?.id);
  }
  getGrassRunType();
});

// 获取互助类型分类
const getGrassRunType = async () => {
  const res = await shiba.$api.public.getGrassRunType();
  state.GrassRunList = res.data;
  console.log(res, "resresres");
};

// 如果是重新发布 需要回显填充数据
const GrassErrandsDetail = async (id) => {
  const res = await shiba.$api.public.GrassErrandsDetail({
    id,
  });
  state.content = res.data.content;
  state.startaddress = res.data.startaddress;
  state.endaddress = res.data.endaddress;
  state.expected_time_text = res.data.expected_time_text;
  state.expected_time = res.data.expected_time;
  state.is_address = res.data.is_address;
  state.price = res.data.price;
  state.mobile = res.data.mobile;
  state.remark = res.data.remark || "";
  state.type_id = res.data.type_id;
  fileList1.value = res.data.image.split(",").map((items) => {
    return {
      type: "image",
      url: items,
      thumb: uni.$y.oss(items),
      size: 8291,
      name: "",
      file: {},
      status: "success",
      message: "",
      fullurl: uni.$y.oss(items),

      fileUrl: items,
    };
  });
};
// 计算金额
const totalMoney = computed(() => {
  return (state.price * (1 + System.value?.service_rate / 100)).toFixed(2);
});

const selectClassify = (item) => {
  state.temp_type_id = item.id;
};

const confirmTopTime = () => {
  state.type_id = state.temp_type_id;
  state.showClassifyModal = false;
};

const cancelTopTime = () => {
  state.showClassifyModal = false;
};

// 计算当前选中的互助类型title
const selectedTypeTitle = computed(() => {
  const found = state.GrassRunList.find((item) => item.id === state.type_id);
  return found ? found.title : "";
});

// 打开弹窗时同步临时变量
const openClassifyModal = () => {
  state.temp_type_id = state.type_id;
  state.showClassifyModal = true;
};
const confirmTime = (item) => {
  state.expected_time = item.timestamp; // 用于提交
  state.expected_time_text = item.formattedValue; // 用于页面展示
};
// 展示
let noticeShow = ref(!false);
const closeNotice = () => {
  noticeShow.value = false;
};
</script>

<style lang="scss" scoped>
.form-content {
  padding: 20rpx 0;

  .form-row {
    padding: 0 20rpx;
    min-height: 100rpx;
    border-bottom: 1rpx solid #f8f8f8;

    .form-lable {
      font-size: 28rpx;
      color: #333333;
      font-weight: bold;
    }

    .form-value {
      font-size: 28rpx;
      color: #999999;
    }
  }

  .upload-box {
    padding: 20rpx;

    .lable {
      height: 70rpx;
      font-weight: bold;
      color: #333333;
      font-size: 28rpx;
    }
  }

  .notice {
    border-bottom: 1rpx solid #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 132rpx;
    background: #ffffff;
    border-radius: 0rpx 0rpx 0rpx 0rpx;

    .notice-card {
      width: 690rpx;
      height: 72rpx;
      background: #fdf1e5;
      border-radius: 8rpx 8rpx 8rpx 8rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 24rpx;
      color: #ffaa00;
      padding: 0 10rpx;

      :deep(.u-notice__left-icon) {
        display: none;
      }

      .icon {
        font-size: 45rpx;
        font-weight: 500;
      }
    }
  }
}

.tips {
  padding: 10rpx;
  color: #999999;

  .tips-text {
    font-weight: bold;
    color: #000;
    font-size: 24rpx;
  }
}

.theme-popup {
  .title {
    color: #333333;
    line-height: 100rpx;
    text-align: center;
    height: 100rpx;
    font-size: 32rpx;
    font-weight: bold;
  }

  .theme-content {
    height: 550rpx;

    .theme-content-scroll {
      height: 400rpx;
      width: 700rpx;
      margin: 0 auto;

      .tag-list {
        display: flex;
        align-items: flex-start;
        flex-direction: row;
        // height: 400rpx;
        width: 700rpx;
        flex-wrap: wrap;
        justify-content: space-between;

        .tag-item {
          margin: 20rpx 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10rpx;
          flex-shrink: 0;
          width: 330rpx;
          height: 84rpx;
          background: #f7f8fc;
          color: #999999;
          border-radius: 20rpx 20rpx 20rpx 20rpx;
        }

        .active {
          color: #1673fe;
          border: 2rpx solid #1673fe;
        }
      }
    }

    .theme-content-btn {
      display: flex;
      justify-content: space-between;
      height: 100rpx;
      margin-top: 20rpx;
    }
  }
}

.top-time-list-scroll {
  height: 400rpx;
  width: 680rpx;
  margin: 0 auto;
}

.top-time-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  width: 100%;
}

.top-time-item {
  height: 80rpx;
  padding: 0 30rpx;
  border-radius: 20rpx;
  background: #f7f8fc;
  color: #999;
  font-size: 28rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2rpx solid #f7f8fc;
  font-size: 32rpx;
  font-weight: 700;

  .lable {
    width: 70%;
  }

  .price {
    font-size: 29rpx;
    font-weight: bold;
  }

  &.active {
    color: #1673fe;
    border: 2rpx solid #1673fe;
    background: #fff;
  }

  // &.disabled {
  //   color: #ccc;
  //   background: #f0f0f0;
  //   pointer-events: none;
  // }
}

.address {
  .address-header {
    padding: 0 20rpx;
    height: 90rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .lable {
      font-weight: 600;
      font-size: 28rpx;
      color: #333333;
    }


  }

  .address-content {
    .address-start,
    .address-end {
      background: #f7f8fc;
      margin: 20rpx auto;
      height: 72rpx;
      width: 690rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15rpx;
      border-radius: 200rpx 200rpx 200rpx 200rpx;
    }

    .address-lable {
      width: 48rpx;
      height: 48rpx;
      background: #ffa515;
      font-size: 28rpx;
      color: #fff;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
      border-radius: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .end_send {
      background: #1673fe;
    }

    .address-value {
      width: calc(100% - 70rpx);
    }
  }
}

.runner {
  padding: 10rpx 20rpx;
  border-bottom: 1rpx solid #f8f8f8;

  .title {
    color: #333333;
    font-size: 28rpx;
    height: 90rpx;
    line-height: 90rpx;
    font-weight: bold;
  }

  .runner_content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .input_se {
      padding: 0 20rpx;
      align-items: center;
      display: flex;
      width: 642rpx;
      height: 72rpx;
      background: #f7f8fc;
      border-radius: 20rpx 20rpx 20rpx 20rpx;
    }

    .price {
      width: calc(100% - 642rpx);
      text-align: center;
    }
  }

  .price_tag {
    display: flex;
    gap: 10rpx;

    .price_item {
      width: 130rpx;
      height: 72rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20rpx 0;
      background: #f7f8fc;
      border-radius: 20rpx 20rpx 20rpx 20rpx;
    }
  }

  .contant {
    height: 72rpx;
    background: #f7f8fc;
    display: flex;
    align-items: center;
    padding: 0 15rpx;
  }

  .remark {
    width: 690rpx;

    background: #f7f8fc;
    border-radius: 10rpx;
  }
}

.runner_btn {
  background: #f7f8fc;
  padding: 10rpx;

  .runner_rule {
    height: 90rpx;
    gap: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10rpx 0;
    color: #999999;
    font-size: 24rpx;

    .rule {
      font-weight: bold;
      color: #1673fe;
    }
  }
}

.textarea-box {
  background-color: #fff;

  :deep(.u-textarea) {
    width: 100%;
    padding: 15rpx 10rpx;
    background: #f7f8fc;
  }
}

.remark {
  :deep(.u-textarea) {
    width: 100%;
    padding: 15rpx 10rpx;
    background: #f7f8fc;
  }
}
</style>
<style>
page {
  background-color: #fff !important;
}
</style>
