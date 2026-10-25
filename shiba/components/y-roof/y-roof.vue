<template>
  <!-- 付费置顶 -->
  <up-popup @close="toggleModal('cancel')" zIndex="99999" :show="StateOpction.show" mode="bottom" :round="20">
    <view class="warm-content">
      <view class="title">{{ StateOpction.title }}</view>
      <view class="warm-prices">
        <view class="tips">{{ StateOpction.content }}</view>
        <scroll-view :show-scrollbar="false" scroll-y="true" class="price-list">
          <view class="price-item" @tap="checkRadio(item)" v-for="item in StateOpction.data">
            <!-- <view class="tag">8折</view> -->
            <view class="radio-txt">
              <y-radio :modelValue="state.stateCheckRadio == item.id"></y-radio>
              <text class="label_text">{{ item.title }}</text>
            </view>
            <view>
              <view class="price-num">￥{{ item.price }}</view>
            </view>
          </view>
        </scroll-view>
        <view class="foot-inform">
          <view class="btn" @tap="toggleModal('confirm')">{{ StateOpction.confirmText }}</view>
          <view class="foot-left">
            <y-radio size="32rpx" v-model="state.isArgain"></y-radio>
            已阅读并同意
            <text @tap="$y.ViewProtocol('服务说明', 6)">《服务说明》</text>
          </view>
        </view>
      </view>
    </view>
  </up-popup>
</template>

<script setup lang="ts">
import { inject, reactive, ref, watch } from "vue";
import { defaultOptions, messageDefaultOptionKey } from "./index";
import { MessageOptions, MessageResult, MessageMerge } from "./type";
import { isFunction } from "../libs/utils";
import shiba from "../..";

// 获取组件的 props
const props = defineProps({
  selector: {
    type: String,
  },
});

// 根据 selector 获取对应的 message 选项 key
const popupOpctionKey = props.selector ? `${messageDefaultOptionKey}${props.selector}` : messageDefaultOptionKey;

// 注入 message 选项
const messageOption = inject(popupOpctionKey, ref<MessageOptions>(defaultOptions));
/**
 * 定义响应式的 StateOption，用于存储 message 选项的状态
 */
let StateOpction = reactive<Omit<MessageOptions & MessageMerge, "onConfirm" | "onCancel">>({
  title: "付费置顶",
  type: "confirm",
  confirmText: "开始置顶",
  show: false,
  content: "动态置顶成功后，将会 全校制定曝光 ，适合寻物品， “我爱你”，生日祝福等场景。",
  data: [],
  grass_id: "",
});

// 选择的值
let state = reactive({
  stateCheckRadio: "",
  isArgain: false,
});
const checkRadio = (item) => {
  state.stateCheckRadio = item.id;
};

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
  console.log(result, "result");
  StateOpction.show = false;
  if (isFunction(onConfirm)) {
    onConfirm(result);
  }
};

/**
 * 处理取消操作
 * @param result - 取消结果
 */
const handleCancel = (result: MessageResult) => {
  StateOpction.show = false;
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
function toggleModal(action: "confirm" | "cancel") {
  console.log(11111, action, state);
  // const payload = StateOpction.type == "confirm" ? { action, value:state. } : { action };
  switch (action) {
    case "confirm":
      setTopUp();
      break;
    case "cancel":
      handleCancel({
        action: "confirm",
        value: "cancel",
      });
      break;
  }
}
// 置顶
const setTopUp = async () => {
  if (!state.isArgain) return uni.$y.toast("请阅读并同意服务说明");
  if (!state.stateCheckRadio) return uni.$y.toast("请选择置顶时间");
  const res = await shiba.$api.public.SetTopUpItem({
    grass_id: StateOpction.grass_id,
    top_up_id: state.stateCheckRadio,
  });
  uni.requestPayment({
    provider: "wxpay",
    ...res.data,
    success(res) {
      console.log(res, "置顶成功");
      handleConfirm({
        action: "confirm",
        value: StateOpction.grass_id,
      });
      uni.$u.route({
        url: "/pages/public/result",
        params: {
          // title: "置顶成功",
          // type: "comment",

          title: "置顶成功",
          pageTitle: "置顶",
          success: true,
          showPay: false,
          showManagement: false,
          showHome: true,
          showBack: true,
        },
      });
    },
    fail(e) {
      uni.$u.route({
        url: "/pages/public/result",
        params: {
          title: "置顶失败",
          pageTitle: "支付失败",
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

/**
 * 初始化 message 选项
 * @param option - message 选项
 */
const initMessage = (option: MessageOptions & MessageMerge) => {
  if (!option) return;
  StateOpction.show = option.show;
  StateOpction.title = option.title;
  StateOpction.type = option.type;
  StateOpction.content = option.content;
  StateOpction.data = option.data;
  StateOpction.grass_id = option.grass_id;
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
// 付费帮顶
.warm-content {
  min-height: 900rpx;

  .title {
    height: 100rpx;
    color: #333;
    text-align: center;
    line-height: 100rpx;
    border-bottom: 1rpx solid #eeeeee;
  }

  .warm-prices {
    padding: 20rpx;

    .tips {
      font-size: 28rpx;
      color: #333333;
    }

    .foot-inform {
      .foot-left {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999999;

        text {
          color: #2999f8;
        }

        gap: 10rpx;
        font-size: 24rpx;
        height: 80rpx;
      }

      .btn {
        background-color: #2999f8;
        color: #fff;
        font-size: 32rpx;
        height: 88rpx;
        border-radius: 88rpx;
        width: 640rpx;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .price-list {
      margin-bottom: 30rpx;
      height: 400rpx;

      .active {
        border: 1rpx solid #1673fe;
      }

      .price-item {
        width: 686rpx;
        margin: 20rpx auto;
        height: 88rpx;
        background: #f5f5f5;
        border-radius: 20rpx 20rpx 20rpx 20rpx;
        border: 1rpx solid #f5f5f5;
        display: flex;
        padding: 0 10rpx;
        justify-content: space-between;
        align-items: center;
        position: relative;
        font-size: 28rpx;
        color: #333333;

        .tag {
          position: absolute;
          right: 0;
          content: "";
          top: 0;
          width: 80rpx;
          height: 32rpx;
          background: #1673fe;
          border-radius: 0rpx 20rpx 0rpx 20rpx;
          font-size: 19rpx;
          text-align: center;
          line-height: 32rpx;
        }

        .radio-txt {
          display: flex;

          .label_text {
            color: #333;
            font-weight: bold;
            padding-left: 20rpx;
          }
        }

        .price-num {
          color: #e81616;
          // padding-right: 90rpx;
          font-size: 40rpx;
        }
      }
    }
  }
}
</style>
