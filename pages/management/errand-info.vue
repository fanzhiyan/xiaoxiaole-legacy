<template>
  <y-layout :coustom="true">
    <up-navbar title="跑腿详情" bgColor="transparent" title-color="#fff" left-icon-color="#fff" :placeholder="true">
      <template #left>
        <u-icon @click="toBack" v-if="isPage" name="arrow-left" size="19" color="#fff"></u-icon>
        <u-icon @click="toHome" v-else name="home" size="20" color="#fff"></u-icon>
      </template>
    </up-navbar>
    <view class="logo" v-if="!IsLogin" style="">
      <view class="text_tips">为了隐私安全 请登录后查看跑腿订单详情</view>
      <!-- <up-image width="300rpx" height="300rpx" :src="$y.oss('/uploads/logo.png')" mode=""></up-image> -->
      <u-button :customStyle="{ background: '#1673fe', width: '400rpx', height: '80rpx' }" color="#1673fe" shape="circle" text="立即登录查看" @click="loginApply"></u-button>
    </view>
    <block v-if="IsLogin">
      <view class="status-nav">
        <view class="avatar">
          <up-image
            v-if="state.status == 3 || state.status == 2 || state.status == 1"
            width="84rpx"
            height="84rpx"
            src="/static/icon/sucess_errand.png"
            mode="aspectFit"></up-image>
          <up-image v-else width="84rpx" height="84rpx" src="/static/icon/order_pedding.png" mode="aspectFit"></up-image>
        </view>
        <view class="nav-info">
          <view class="status">{{ getStatusText }}</view>
          <view class="desc">
            <up-parse :content="statusDesc"></up-parse>
          </view>
        </view>
      </view>
      <view class="card issuer">
        <view class="user-issuer">
          <view class="avatar"><up-avatar :src="$y.oss(state?.user?.avatar)"></up-avatar></view>
          <view class="user-info">
            <view class="row">
              <view class="user-name">{{ state?.user?.nickname }}</view>
            </view>
            <view class="issuer-time">{{ state?.time }}</view>
          </view>
        </view>
        <view class="issuer-content">{{ state.content }}</view>
        <!-- 上传的图片信息 -->
        <view class="images" @click="$y.previewImages(state.image,index)">
          <up-image radius="5" v-for="(item,index) in state.image" width="140rpx" height="140rpx" :src="item" mode=""></up-image>
        </view>
        <block class="" v-if="state.is_address == 1">
          <view class="address-start">{{ state.startaddress }}</view>
          <view class="address-end">{{ state.endaddress }}</view>
        </block>
      </view>

      <view class="mark-card">
        <view class="header">备注</view>
        <view class="header-card">{{ state.remark || "未备注" }}</view>
        <block v-if="state.is_self == 0">
          <view class="header">接单须知</view>
          <view class="header-card">
            <view>1.请谨慎接单，接单即承诺严格履行服务责任，需按时完成配送服务，否则需承担违约赔偿责任。</view>
            <view>2.请确保手机畅通，因无法接通导致订单取消，客户损失的需对平台及客户合理损失担责，多次违规将依平台规则限制/封禁账号</view>
            <view>3.严禁违规跳单，绕过平台交易。绕过平台交易的订单平台将不负任何责任</view>
          </view>
        </block>
      </view>

      <view class="card-recive" v-if="state.is_self == 1 && (state.status == 1 || state.status == 2 || state.status == 6)">
        <view class="user-row">
          <view class="user-lable">
            <view>
              <u-avatar size="72rpx" :src="$y.oss(state.receice.avatar)"></u-avatar>
            </view>
            <view>{{ state.receice.nickname }}</view>
          </view>
          <view class="user-report" @click="state.serviceShow = true">
            举报
            <u-image width="26rpx" height="32rpx" src="/static/icon/icon_waring.png" mode="aspectFit"></u-image>
          </view>
        </view>
        <view class="user-receiving">
          <view class="call-phone">接单人电话:{{ state.receice.mobile }}</view>
          <view>
            <up-image @click="callPhone" width="40rpx" height="40rpx" src="/static/icon/icon-phone.png" mode="aspectFit"></up-image>
          </view>
        </view>
      </view>

      <!-- 如果是发单人 -->

      <view v-if="state.status != 0 && (state.user_type == 'push' || state.user_type == 'receive')" class="card card-info">
        <!-- <view class="card-title">订单信息</view> -->
        <view class="card-cell">
          <view class="label">订单编号</view>
          <view class="value">
            <up-copy :content="state.order_sn">
              <text>{{ state.order_sn }}</text>
              <text class="copy">复制</text>
            </up-copy>
          </view>
        </view>
        <!--   <view class="card-cell" v-if="state.is_self == 0">
      <view class="label">待帮助人</view>
      <view class="value">{{ state.user.nickname }}</view>
    </view> -->
        <view class="card-cell">
          <view class="label">下单时间</view>
          <view class="value">{{ $u.timeFormat(state.create_time, "yyyy-mm-dd hh:MM:ss") }}</view>
        </view>
        <view class="card-cell" v-if="state.status == 1">
          <view class="label">接单时间</view>
          <view class="value">{{ $u.timeFormat(state.receiving_time, "yyyy-mm-dd hh:MM:ss") }}</view>
        </view>
        <view class="card-cell" v-if="state.status == 1">
          <view class="label">预计送达时间</view>
          <view class="value">{{ $u.timeFormat(state.expected_time, "yyyy-mm-dd hh:MM:ss") }}</view>
        </view>
        <view class="card-cell" v-if="state.status == 2">
          <view class="label">送达时间</view>
          <view class="value">{{ $u.timeFormat(state.delivered_time, "yyyy-mm-dd hh:MM:ss") }}</view>
        </view>
        <view class="card-cell" v-if="state.status == 3">
          <view class="label">完成时间</view>
          <view class="value">{{ $u.timeFormat(state.complete_time, "yyyy-mm-dd hh:MM:ss") }}</view>
        </view>
        <view class="card-cell" v-if="state.status == 5">
          <view class="label">取消时间</view>
          <view class="value">{{ $u.timeFormat(state.cancel_time, "yyyy-mm-dd hh:MM:ss") }}</view>
        </view>
        <view class="card-cell" v-if="state.status == 6">
          <view class="label">申请取消时间</view>
          <view class="value">{{ $u.timeFormat(state.apply_cancel_time, "yyyy-mm-dd hh:MM:ss") }}</view>
        </view>
        <view class="card-cell" v-if="state.is_self == 1">
          <view class="label">订单金额</view>
          <view class="value">{{ state.pay_price }}</view>
        </view>
        <view class="card-cell" v-if="state.is_self == 0">
          <view class="label">佣金金额</view>
          <view class="value">{{ state.price }}</view>
        </view>
        <view class="card-cell" v-if="state.is_self == 0 && (state.status == 1 || state.status == 2 || state.status == 6)">
          <view class="label">发单人电话</view>
          <view @click="callPhone" class="value l-f l-a-center l-j-end" style="gap: 10rpx">
            {{ state.mobile }}
            <up-image @click="callPhone" width="40rpx" height="40rpx" src="/static/icon/icon-phone.png" mode="aspectFit"></up-image>
          </view>
        </view>
        <!-- <view class="card-cell" v-if="state.is_self == 1 && (state.status == 1 || state.status == 2 || state.status == 6)">
      <view class="label">接单人电话</view>
      <view @click="callPhone" class="value l-f l-a-center l-j-end" style="gap: 10rpx">
        {{ state.receice.mobile }}
        <up-image @click="callPhone" width="40rpx" height="40rpx" src="/static/icon/icon-phone.png" mode="aspectFit"></up-image>
      </view>
    </view> -->
      </view>

      <!-- <view class="card card-info" v-if="state.status >= 1 && state.status <= 3">
    <view class="card-title">接单信息</view>
    <view class="card-cell">
      <view class="label">手机号</view>
      <view class="value">{{ state.mobile }}</view>
    </view>
    <view class="card-cell">
      <view class="label">备注</view>
      <view class="value">{{ state.remark ? state.remark : "暂无备注" }}</view>
    </view>
    <view class="card-cell col-grid">
      <view class="label">图片</view>
      <view class="value">
        <u-image width="180rpx" v-for="item in state.images" height="180rpx" @click="$y.previewImages($y.oss(item))" :src="$y.oss(item)" mode="aspectFit"></u-image>
      </view>
    </view>
  </view> -->
      <!-- <view class="card card-info">
    <view class="card-title">服务流程</view>
    <view class="step">
      <uni-steps :options="stepsList" :active="currentStepIndex"></uni-steps>
    </view>
  </view> -->

      <view class="rule-text" v-if="(state.user_type == 'receive' || state.user_type == 'user') && state.status == 0">
        接单即代表你已阅读并同意
        <text class="rule-blue" @click="$u.route('/pages/setting/agreement?title=校小乐接单协议&id=12')">《校小乐接单协议》</text>
      </view>
      <y-float>
        <view class="contant-float">
          <!-- <button open-type="contact" class="contact"></button> -->
          <image style="width: 120rpx; height: 120rpx" @tap="state.serviceShow = true" src="/static/icon/icon_service.png" mode="aspectFit"></image>
          <!--  <view class="contant-box" @tap="callPhone">
        <text class="shiba-phone"></text>
      </view> -->
        </view>
      </y-float>
      <y-fixed-bottom bottom="20rpx">
        <view class="l-bg-white">
          <view class="fixed-content" v-if="state.status < 2 && state.is_self == 0">请在 {{ $u.timeFormat(state.expected_time, "yyyy-mm-dd hh：MM：ss") }} 之前送达！</view>
          <view class="fixed-bottom">
            <view class="commission l-price" v-if="state.is_self == 0 && state.status == 0">{{ state.price }}</view>

            <!-- 发单人按钮 -->
            <template v-if="state.user_type == 'push'">
              <!-- <u-button
            v-if="state.status === 3 || state.status === 5"
            :customStyle="{ fontWeight: 'bold', width: '240rpx', height: '90rpx', fontSize: '32rpx' }"
            shape="circle"
            color="#1673FE"
            plain
            text="删除订单"
            @click="deleteOrder"></u-button> -->
              <u-button
                v-if="state.status === 5"
                :customStyle="{ fontWeight: 'bold', width: '410rpx', height: '90rpx', fontSize: '32rpx' }"
                shape="circle"
                color="#1673FE"
                text="重新发布"
                @click="reset"></u-button>
              <u-button
                v-if="state.status === 3"
                :customStyle="{ fontWeight: 'bold', width: '410rpx', height: '90rpx', fontSize: '32rpx' }"
                shape="circle"
                color="#1673FE"
                text="订单已完成"></u-button>

              <u-button
                v-if="state.status == 2"
                @click="completeRunErrands(state)"
                :customStyle="{ fontWeight: 'bold', width: '410rpx', height: '90rpx', fontSize: '32rpx' }"
                shape="circle"
                color="#1673FE"
                text="确认完成订单"></u-button>
              <u-button
                v-if="state.status == 1"
                @click="ReceiveCancelUser(state)"
                :customStyle="{ fontWeight: 'bold', width: '520rpx', height: '90rpx', fontSize: '32rpx' }"
                plain
                shape="circle"
                color="#1673FE"
                text="申请取消"></u-button>
              <u-button
                v-if="state.status === 0"
                @click="ReceiveCancelUser(state)"
                :customStyle="{ fontWeight: 'bold', width: '630rpx', height: '90rpx', fontSize: '32rpx' }"
                plain
                shape="circle"
                color="#1673FE"
                text="取消订单"></u-button>
            </template>
            <!-- 接单人按钮 -->
            <template v-if="state.user_type == 'receive'">
              <u-button
                v-if="state.status == 0 && state.user_type == 'receive'"
                :customStyle="{ fontWeight: 'bold', width: '440rpx', height: '90rpx', fontSize: '32rpx' }"
                shape="circle"
                color="#1673FE"
                text="您已取消不能接单"
                @click="receivingOrder()"></u-button>
              <!-- 已接单状态 -->
              <template v-if="state.status === 1">
                <u-button
                  v-if="state.status === 1"
                  :customStyle="{ fontWeight: 'bold', width: '200rpx', height: '90rpx', fontSize: '32rpx' }"
                  shape="circle"
                  color="#1673FE"
                  text="联系发布人"
                  @click="callPhone"></u-button>
                <u-button
                  :customStyle="{ fontWeight: 'bold', width: '240rpx', height: '90rpx', fontSize: '32rpx' }"
                  shape="circle"
                  color="#BBBBBB"
                  text="取消订单"
                  @tap="ReceiveCancel"
                  plain></u-button>
                <u-button
                  :customStyle="{ fontWeight: 'bold', width: '240rpx', height: '90rpx', fontSize: '32rpx' }"
                  shape="circle"
                  color="#1673FE"
                  text="确认送达"
                  @click="delivered()"></u-button>
              </template>
              <!-- 待接单人确认取消状态 -->
              <template v-if="state.status === 6">
                <u-button
                  :customStyle="{ fontWeight: 'bold', width: '410rpx', height: '90rpx', fontSize: '32rpx' }"
                  shape="circle"
                  color="#1673FE"
                  text="同意取消"
                  @click="agreeCancel()"></u-button>
                <u-button
                  @click="rejectCancel()"
                  :customStyle="{ fontWeight: 'bold', width: '220rpx', height: '90rpx', fontSize: '32rpx' }"
                  shape="circle"
                  color="#E4350C"
                  text="拒绝"></u-button>
              </template>
              <!-- 已完成状态 -->
              <!-- <u-button
            v-if="state.status === 3 || state.status === 5"
            :customStyle="{ fontWeight: 'bold', width: '630rpx', height: '90rpx', fontSize: '32rpx' }"
            shape="circle"
            color="#1673FE"
            text="删除订单"
            @click="deleteOrder"></u-button> -->
            </template>
            <!-- 路人 -->
            <template v-if="state.user_type == 'user'">
              <u-button
                v-if="state.status == 0 && state.user_type == 'user'"
                :customStyle="{ fontWeight: 'bold', width: '440rpx', height: '90rpx', fontSize: '32rpx' }"
                shape="circle"
                color="#1673FE"
                text="立即抢单"
                @click="receivingOrder"></u-button>
            </template>
          </view>
        </view>
      </y-fixed-bottom>
    </block>
    <y-message-box selector="errand-info"></y-message-box>
    <y-service-qrcode title="联系客服" desc="长按识别联系客服" :imgUrl="$y.oss(sys_image)" v-model="state.serviceShow"></y-service-qrcode>
  </y-layout>
</template>

<script setup>
import { onLoad, onPullDownRefresh,onShareAppMessage } from "@dcloudio/uni-app";
import shiba from "../../shiba";
import { computed, nextTick, reactive, ref, watch } from "vue";
const message = shiba.$hook.useMessageBox("errand-info");
const appStore = computed(() => shiba.$store("app").user_topic_id);
const sys_image = computed(() => shiba.$store("app").System?.sys_image);
const IsLogin = computed(() => shiba.$store("user").isLogin);
let id = "";
onPullDownRefresh(() => {
  GrassErrandsDetail();
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
});
onLoad((opction) => {
  id = opction?.id;

  if (shiba.$store("user").isLogin) {
    GrassErrandsDetail();
    getTopic();
  }

  hasPrePage();
});

let state = reactive({
  user_type: "",
  image: [],
  serviceTime: 0,
  // 是否联系客服弹窗打开
  serviceShow: false,
  is_self: 0,
  content: "",
  status: 0,
  price: "",
  time: "",
  create_time_text: "",
  mobile: "",
  remark: "",
  receice: {
    avatar: "",
  },
  user: {
    id: "",
    nickname: "",
    mobile: "",
    avatar: "",
    level: 0,
    gender: 1,
  },
  order_sn: "",
  images: [],
  join_status: "",
  // ----结束时间
  endtime: "",
  // 送达时间
  delivered_time: "",
  // 申请取消时间
  apply_cancel_time: 0,
  // 取消时间
  cancel_time: 0,
  // 期望送达时间
  expected_time: "",
  is_address: 0,
  pay_price: 0,
  receice: {
    mobile: "",
    avatar: "",
  },
});

// 事件处理
const getTopic = async () => {
  const res = await shiba.$api.public.getGrassIndex({
    id: appStore.value,
  });
  state.join_status = res.data.join_status;
};

const statusConfigMap = {
  // 发单人配置
  sender: {
    0: {
      steps: ["已发单", "待接单", "已接单", "送达", "完成"],
      current: 1,
    }, // 待接单状态
    1: {
      steps: ["已发单", "待接单", "已接单", "送达", "完成"],
      current: 2,
    }, // 已接单
    2: {
      steps: ["已发单", "待接单", "已接单", "送达", "完成"],
      current: 3,
    }, // 已送达
    3: {
      steps: ["已发单", "待接单", "已接单", "送达", "完成"],
      current: 4,
    }, // 已完成
    4: {
      steps: ["已发单", "待接单", "已失效"],
      current: 2,
    }, // 已失效
    5: {
      steps: ["已发单", "待接单", "已取消"],
      current: 2,
    }, // 已取消
    6: {
      steps: ["已发单", "待接单", "已接单", "待确认取消"],
      current: 3,
    }, // 待接单人确认取消
  },
  // 接单人配置
  receiver: {
    0: {
      steps: ["待接单", "已接单", "送达", "完成"],
      current: 0,
    }, // 待接单状态
    1: {
      steps: ["待接单", "已接单", "送达", "完成"],
      current: 1,
    }, // 已接单
    2: {
      steps: ["待接单", "已接单", "送达", "完成"],
      current: 2,
    }, // 已送达
    3: {
      steps: ["待接单", "已接单", "送达", "完成"],
      current: 3,
    }, // 已完成
    4: {
      steps: ["待接单", "已失效"],
      current: 1,
    }, // 已失效
    5: {
      steps: ["待接单", "已取消"],
      current: 1,
    }, // 已取消
    6: {
      steps: ["待接单", "已接单", "待确认取消"],
      current: 2,
    },
  },
};

const stepsList = ref([]);
const currentStepIndex = ref(0);

const updateSteps = () => {
  const isSender = state.is_self === 1;
  const role = isSender ? "sender" : "receiver";
  const status = state.status.toString();

  // 获取对应状态配置
  const config = statusConfigMap[role][status] || {};

  // 生成步骤列表
  stepsList.value =
    config.steps?.map((title) => ({
      title,
      error: false,
    })) || [];

  // 设置当前步骤索引
  currentStepIndex.value = config.current || 0;

  // 处理失效/取消状态的特殊样式
  if ([4, 5].includes(state.status)) {
    stepsList.value = stepsList.value.map((step, index) => ({
      ...step,
      error: index < currentStepIndex.value,
    }));
  }
};

// 使用方法：

const GrassErrandsDetail = async () => {
  console.log(id, "    debugger;");
  if (!id) return;
  const res = await shiba.$api.public.GrassErrandsDetail({
    id: id,
  });
  state.serviceTime = res.time;
  state.user_type = res.data.user_type;

  state.content = res.data.content;
  state.price = res.data.price;
  state.time = res.data.time;
  state.order_sn = res.data.order_sn;
  state.create_time = res.data.create_time;
  state.endtime = res.data.endtime;
  state.remark = res.data.remark;
  state.images = res.data.image.split(",");
  state.status = res.data.status;
  state.is_self = res.data.is_self;
  state.is_address = res.data.is_address;
  state.expected_time = res.data.expected_time;
  state.delivered_time = res.data.delivered_time;
  state.complete_time = res.data.complete_time;
  state.refund_time = res.data.refund_time;
  state.receiving_time = res.data.receiving_time;
  state.apply_cancel_time = res.data.apply_cancel_time;
  state.cancel_time = res.data.cancel_time;
  state.endtime = res.data.endtime;
  state.startaddress = res.data.startaddress;
  state.endaddress = res.data.endaddress;
  state.mobile = res.data.user?.mobile;
  state.mobileKnight = res.data.receice?.mobile;
  state.image = res.data.image
    .split(",")
    .filter((i) => i != "")
    .map((items) => uni.$y.oss(items));
  if (state.status == 1 || state.status == 2 || state.status == 6) {
    state.receice = res.data.receice;
  }
  state.user = res.data.user;
  state.pay_price = res.data.pay_price;
  updateSteps();
};

// 跑腿接单
const receivingOrder = async (item) => {
  const confirm = await message.confirm({
    content: "请确认是否接单？",
    confirmText: "确认接单",
  });
  try {
    const res = await shiba.$api.public.ReceiveErrands({
      run_errands_id: id,
    });
    GrassErrandsDetail();
  } catch (error) {
    if (error.code == 21) {
      CircledPrompt();
    } else if (error.code == 2) {
      await message.confirm({
        title: "温馨提示",
        content: "你还未进行身份认证,完成认证后再进行接单",
        confirmText: "去认证",
      });
      uni.$u.route("/pages/errand/errand-auth");
    }
  }
};

// 跑腿接单人取消订单
const ReceiveCancel = async (item) => {
  const confirm = await message.confirm({
    content: "取消订单？",
    confirmText: "确定",
  });
  const res = await shiba.$api.api.GrassRunErrandsCancel({
    run_errands_id: id,
  });
  GrassErrandsDetail();
};
// 加入请求
const sendForm = async () => {
  const res = await shiba.$api.public.applyJoin({
    topic_id: appStore.value,
    content: "",
    image: "",
  });
  const messags = await message.confirm({
    title: "提示",
    content: "已加入圈子",
    confirmText: "好的",
    isShowCancel: false,
  });
};

// 发单人取消订单
const ReceiveCancelUser = async (item) => {
  let content = "确定取消订单吗？";
  // 如果是已经接单了 要提示
  if (state.status == 1) {
    // 用服务器时间判断
    if (state.serviceTime - state.receiving_time > 1800) {
      content = "您的订单接单人已接单，取消订单需要接单人确认，确定取消订单吗?";
    } else {
      content = "您的订单接单人已接单，取消订单会收取一定的费率，确认取消吗？";
    }
  }
  const confirm = await message.confirm({
    title: "温馨提示",
    content: content,
    confirmText: "确定",
  });
  const res = await shiba.$api.api.GrassRunErrandsCancel({
    run_errands_id: id,
  });

  GrassErrandsDetail();
};
// 发单人 确认完成订单
const completeRunErrands = async (item) => {
  const confirm = await message.confirm({
    title: "提示",
    content: "请确认该订单已完成<br/>确认完成订单后<br/>平台仍会保障你的权益",
    confirmText: "确认",
  });
  const res = await shiba.$api.public.completeRunErrands({
    run_errands_id: id,
  });
  GrassErrandsDetail();
};
// 接单人点送达
const delivered = async (item) => {
  const confirm = await message.confirm({
    title: "提示",
    content: "确认送达？",
    confirmText: "确认",
  });
  const res = await shiba.$api.public.delivered({
    run_errands_id: id,
  });
  GrassErrandsDetail();
  // let index = state.errandList.findIndex((items) => items.id == item.id);
  // if (index != -1) {
  //   state.errandList.splice(index, 1);
  // }
};

const deleteOrder = async () => {
  const confirm = await message.confirm({
    content: "确认删除订单？",
    confirmText: "确认删除",
  });
  const res = await shiba.$api.api.DelRunOrder({
    run_errands_id: id,
  });
  uni.$u.route({
    type: "navigateBack",
  });
};

const agreeCancel = async () => {
  const confirm = await message.confirm({
    content: "确认同意取消订单？",
    confirmText: "确认同意",
  });
  const res = await shiba.$api.api.receiveAuthCancel({
    run_errands_id: id,
    type: 1,
  });
  GrassErrandsDetail();
};

const rejectCancel = async () => {
  const confirm = await message.confirm({
    content: "确认拒绝取消订单？",
    confirmText: "确认拒绝",
  });
  const res = await shiba.$api.api.receiveAuthCancel({
    run_errands_id: id,
    type: 2,
  });
  GrassErrandsDetail();
};

// 联系发单人电话
const callPhone = () => {
  // 判断角色 联系哪个
  console.log(state.is_self == 0 ? state.mobile + "" : state.receice.mobile + "", "-");
  uni.makePhoneCall({
    phoneNumber: state.is_self == 0 ? state.mobile + "" : state.receice.mobile + "",
  });
};
const getStatusText = computed(() => {
  if (state.status === 0) return "未被接单";
  if (state.status === 1) return "订单进行中";
  if (state.status === 2) return "订单已送达";
  if (state.status === 3) return "订单已完成";
  if (state.status === 4) return "订单已失效";
  if (state.status === 5) return "订单已取消";
  if (state.status === 6) return "待确认取消";
  return "未知状态";
});

// 1. 创建一个 ref 来存储状态描述
const statusDesc = ref("");
// 2. 使用 watch 监听状态变化
watch(
  // 监听多个数据源
  [() => state.is_self, () => state.status],
  // 回调函数
  () => {
    if (state.is_self === 0) {
      switch (state.status) {
        case 0:
          statusDesc.value = "暂无跑腿员接单，您可以立即抢单";
          break;
        case 1:
          statusDesc.value = "请尽快完成订单";
          break;
        case 2:
          statusDesc.value = `送达时间：${uni.$u.timeFormat(state.delivered_time, "yyyy-mm-dd hh:MM:ss")}`;
          break;
        case 3:
          statusDesc.value = `完成时间：${uni.$u.timeFormat(state.complete_time, "yyyy-mm-dd hh:MM:ss")}`;
          break;
        case 4:
          statusDesc.value = "订单已失效";
          break;
        case 5:
          statusDesc.value = `取消时间：${uni.$u.timeFormat(state.cancel_time, "yyyy-mm-dd hh:MM:ss")}`;
          break;
        case 6:
          statusDesc.value = "发单人申请取消订单<br/>如有异议请联系发单人 <br/> 无法联系请联系本校客服";
          break;
        default:
          statusDesc.value = "";
      }
    } else {
      switch (state.status) {
        case 0:
          statusDesc.value = "暂无跑腿员接单";
          break;
        case 1:
          statusDesc.value = `接单时间：${uni.$u.timeFormat(state.receiving_time, "yyyy-mm-dd hh:MM:ss")}`;
          break;
        case 2:
          statusDesc.value = `接单人已经送达<br/>待您确认完成<br/>如若订单未送达/完成请联系官方客服进行咨询处理`;
          break;
        case 3:
          statusDesc.value = `完成时间：${uni.$u.timeFormat(state.complete_time, "yyyy-mm-dd hh:MM:ss")}`;
          break;
        case 4:
          statusDesc.value = "订单已失效";
          break;
        case 5:
          statusDesc.value = `取消时间：${uni.$u.timeFormat(state.cancel_time, "yyyy-mm-dd hh:MM:ss")} <br/>订单金额已原路返回至您的账户`;
          break;
        case 6:
          statusDesc.value = "请联系接单人确认取消<br/>无法解决请联系本校客服";
          break;
        default:
          statusDesc.value = "";
      }
    }
  },
  // 立即执行一次
  { immediate: true }
);

const reset = () => {
  uni.$u.route({
    url: "/pages/management/create-runner",
    params: {
      topic_id: appStore.value,
      id,
    },
  });
};

let isPage = ref(false);
const hasPrePage = () => {
  const pages = getCurrentPages();
  isPage.value = pages.length > 1;
};

// 返回首页
const toHome = () => {
  uni.switchTab({ url: "/pages/errand/errand" });
};

// 返回上一页
const toBack = () => {
  uni.navigateBack();
};

// 弹出登录
const loginApply = () => {
  uni.$store("modal").SETKEYDATA("Auth", false);
  uni.$store("modal").SETKEYDATA("Auth", true);
};

watch(
  () => IsLogin.value,
  (item) => {
    if (item) {
      GrassErrandsDetail();
    }
  },
  {
    deep: true,
  }
);

// #ifdef MP-WEIXIN
// 写一个函数 用于生成微信小程序 分享
uni.showShareMenu({
  menus: ["shareAppMessage", "shareTimeline"],
});
onShareAppMessage(() => {
  return {
    type: 0,
    title: state.content,
    path: `/pages/management/errand-info?id=${id}&pic=${appStore.value}&type=share`,
  };
});
// #endif
</script>

<style lang="scss" scoped>
.status-nav {
  width: 100%;
  height: 172rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  gap: 10rpx;

  .avatar {
    width: 120rpx;
    height: 120rpx;
    align-items: center;
    display: flex;
  }

  .nav-info {
    width: calc(100% - 200rpx);

    .status {
      font-size: 32rpx;
      color: #fff;
      font-weight: bold;
    }

    .desc {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}

.card {
  width: 702rpx;
  background: #ffffff;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  padding: 10rpx 20rpx;
  margin: 20rpx auto;
}

.issuer {
  width: 702rpx;
  background: #ffffff;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  padding: 10rpx 20rpx;
  margin: 20rpx auto;

  .issuer-content {
    font-size: 28rpx;
    color: #333333;
    padding: 10rpx 0;
    font-weight: 600;
    line-height: 1.5;
    word-wrap: break-word;
    /* 老版本浏览器 */
    overflow-wrap: break-word;
    /* 新标准 */
  }
  .images {
    display: flex;
    gap: 10rpx;
  }

  .address-start {
    width: 690rpx;
    min-height: 72rpx;
    background: rgba(255, 165, 21, 0.1);
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    margin: 20rpx auto;
    padding-top: 10rpx;
    padding-bottom: 10rpx;
    position: relative;
    padding-left: 100rpx;
    color: rgba(102, 102, 102, 1);

    &::after {
      position: absolute;
      width: 48rpx;
      height: 48rpx;
      background: #ffa515;
      content: "取";
      border-radius: 48rpx;
      left: 10rpx;
      display: flex;
      align-items: center;
      color: #fff;
      justify-content: center;
    }
  }

  .address-end {
    display: flex;
    margin: 20rpx auto;
    align-items: center;
    width: 690rpx;
    min-height: 72rpx;
    padding-left: 100rpx;
    padding-top: 10rpx;
    padding-bottom: 10rpx;
    background: rgba(22, 115, 254, 0.2);
    color: rgba(102, 102, 102, 1);
    border-radius: 36rpx;
    position: relative;

    &::before {
      position: absolute;
      content: "送";
      width: 48rpx;
      height: 48rpx;
      background: rgba(22, 115, 254, 1);
      border-radius: 0rpx 0rpx 0rpx 0rpx;
      border-radius: 48rpx;
      left: 10rpx;
      display: flex;
      align-items: center;
      color: #fff;
      justify-content: center;
    }
  }

  .issuer-row {
    text-align: right;

    .tip {
      font-size: 24rpx;
      color: #333333;
      padding: 0 20rpx;
    }

    .price {
      color: #e81616;
      font-weight: bold;
    }
  }

  .user-issuer {
    display: flex;
    align-items: center;
    height: 120rpx;

    .avatar {
    }

    .user-info {
      padding: 0 20rpx;

      .row {
        display: flex;

        .user-name {
          font-size: 28rpx;
          color: #000000;
          margin-right: 10rpx;
          font-weight: bold;
        }

        .user-level {
        }
      }

      .issuer-time {
        color: #999999;
        font-size: 24rpx;
      }
    }
  }
}

// 订单信息
.card-info {
  width: 690rpx;
  // height: 340rpx;
  border: solid 1rpx #eeeeee;

  .card-cell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 60rpx;

    .label {
      color: #999;
      font-size: 24rpx;
      width: 180rpx;
    }

    .value {
      font-size: 24rpx;
      color: #333333;
      width: calc(100% - 140rpx);
      display: flex;
      justify-content: flex-end;
      .copy {
        color: #1a76f2;
        padding: 0 10rpx;
      }
    }
  }

  .col-grid {
    justify-content: flex-end;
    align-items: flex-start;
    flex-direction: column;

    .label {
      width: 100%;
      text-align: left;
      margin-bottom: 20rpx;
    }

    .value {
      flex-wrap: wrap;
      width: 100%;
      display: flex;
      gap: 10rpx;
    }
  }
}

.step {
  padding: 50rpx 0;
}

.fixed-bottom {
  display: flex;
  align-items: center;
  justify-content: center;

  .commission {
    width: 200rpx;
    text-align: center;
    color: red;
    font-size: 36rpx;
    font-weight: bold;
  }
}

.mark-card {
  margin: 0 auto;
  padding: 15rpx;
  width: 690rpx;
  border-radius: 8rpx 8rpx 8rpx 8rpx;
  border: 2rpx solid #eeeeee;

  .header {
    color: rgba(51, 51, 51, 1);
    font-size: 30rpx;
    font-weight: bold;
  }

  .header-card {
    font-size: 30rpx;
    padding: 10rpx 0;
    color: rgba(102, 102, 102, 1);
    line-height: 1.5;
  }
}

.fixed-content {
  width: 690rpx;
  height: 66rpx;
  background: rgba(228, 53, 12, 0.1);
  border-radius: 8rpx 8rpx 8rpx 8rpx;
  margin: 20rpx auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: rgba(228, 53, 12, 1);
}

.contant {
  width: 150rpx;
  height: 150rpx;
  background: none;
  /* 清除背景 */
  border: none;
  /* 清除边框 */
  padding: 0;
  /* 清除内边距 */
  margin: 0;
  /* 清除外边距 */
  line-height: normal;
  /* 重置行高 */
  display: flex;
  /* 保持 flex 布局 */
  align-items: center;
  /* 垂直居中 */
  justify-content: center;
  /* 水平居中 */
  flex-direction: column;
}

.contant-float {
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
  // // position: relative;
  // width: 120rpx;
  // height: 120rpx;

  // .contact {
  //   position: absolute;
  //   opacity: 0;
  //   width: 120rpx;
  //   height: 120rpx;
  //   border-radius: 120rpx;
  //   z-index: 12;
  // }

  // .icon_service {
  //   width: 120rpx;
  //   height: 120rpx;
  //   border-radius: 120rpx;
  //   position: absolute;
  //   z-index: 1;
  // }
}

.contant-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100rpx;
  height: 100rpx;
  background: #1673fe;
  border-radius: 120rpx;

  .shiba-phone {
    transform: rotate(10deg);
    font-size: 60rpx;
    color: #fff;
  }
}

.card-recive {
  width: 690rpx;
  margin: 20rpx auto;

  .user-row {
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .user-lable {
      display: flex;
      align-items: center;
      gap: 10rpx;
      font-size: 28rpx;
      font-weight: bold;
    }

    .user-report {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      gap: 10rpx;
    }
  }

  .user-receiving {
    width: 690rpx;
    height: 72rpx;
    background: #f7f8fc;
    border-radius: 72rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #1673fe;
  }
}
.images {
}

.rule-text {
  text-align: center;
  padding: 10rpx 0;
  font-size: 28rpx;
  .rule-blue {
    color: #1673fe;
  }
}

.logo {
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .text_tips {
    color: #333;
    font-size: 30rpx;
    margin: 20rpx 0;
  }
}
</style>
<style>
page {
  background: url(../../static/public/errand_bg.png) no-repeat top center;
  /* #ifdef H5 */
  background-size: 100% 254rpx;
  /* #endif */
  /* #ifdef MP-WEIXIN */
  background-size: 100% 354rpx;
  /* #endif */
  background-color: #fff;
}
</style>
