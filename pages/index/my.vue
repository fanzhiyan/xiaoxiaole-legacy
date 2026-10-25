<template>
  <y-layout :coustom="true">
    <y-status-navbar></y-status-navbar>
    <view class="info-content">
      <view class="user-card" v-if="IsLogin">
        <view class="user-card__avatar" @click="$u.route('/pages/my/user')">
          <u-avatar size="100rpx" :src="$y.oss(user.avatar)"></u-avatar>
        </view>
        <view class="user-card__data">
          <view class="user-card__info">
            <view class="user-card__name" @click="$u.route('/pages/my/user')">{{ user.nickname }}</view>
            <view class="user-card__status" :class="{ 'user-card__status_real': state.auth_status >= 2 }" @click="routeAuth">
              {{ state.auth_status < 2 ? "未认证" : "已认证" }}
            </view>
          </view>
          <view class="user-card__school">
            <view class="school-name" @click="$u.route('/pages/public/switch')">
              {{ state.name }}
            </view>
            <text class="shiba-down"></text>
          </view>
        </view>
        <view class="arrow" @click="$u.route('/pages/my/user')">
          <view class="shiba-next"></view>
        </view>
      </view>

      <view class="user-card" v-else>
        <view class="user-card__avatar">
          <u-avatar size="100rpx"></u-avatar>
        </view>
        <view class="user-card__data" @click="loginApply">
          <view class="user-card__info">
            <view class="user-card__name">游客</view>
            <view class="user-card__status">去登录</view>
          </view>
          <view class="user-card__school">
            <view class="school-name">登录后可查看更多内容</view>
          </view>
        </view>
        <view class="arrow">
          <view class="shiba-next"></view>
        </view>
      </view>
    </view>
    <!-- 帖子 -->
    <view class="my-action" v-if="IsLogin">
      <view class="action-item" @click="$u.route('/pages/management/my-management')">
        <image src="/static/public/group_1.png" mode=""></image>
        <view class="text-content">我的帖子</view>
      </view>
      <view class="action-item" @click="$u.route('/pages/my/my-comment')">
        <image src="/static/public/group_2.png" mode=""></image>
        <view class="text-content">我的评论</view>
      </view>
      <view class="action-item" @click="$u.route('/pages/errand/receiving-workstation')">
        <image src="/static/public/group_3.png" mode=""></image>
        <view class="text-content">跑腿平台</view>
      </view>
      <view class="action-item" @click="$u.route('/pages/my/wallet')">
        <image src="/static/public/group_4.png" mode=""></image>
        <view class="text-content">跑腿收益</view>
      </view>
    </view>
    <!-- cell -->
    <view class="cell-list">
      <view class="cell-item" @tap="routeMap(item)" v-for="item in RouteList">
        <view class="cell-icon">
          <up-image :src="item.icon" width="40rpx" height="40rpx"></up-image>
        </view>
        <view class="cell-lable">
          {{ item.name }}
          <text class="shiba-next"></text>
        </view>
      </view>
    </view>
    <view class="logo" style="display: flex; align-items: center; justify-content: center">
      <up-image width="300rpx" height="300rpx" :src="$y.oss('/uploads/logo.png')" mode=""></up-image>
    </view>
    <!-- 保证弹窗 -->
    <up-popup mode="center" :closeable="true" @close="state.show = false" :show="state.show" bgColor="transparent">
      <view class="work-qrcode">
        <view class="qrcode-info">
          <up-image radius="10" :src="$y.oss(state.kefu_image)" width="300rpx" height="300rpx"></up-image>
        </view>
        <view class="qrcode-value">长按识别二维码关注公众号</view>
      </view>
    </up-popup>
    <y-service-qrcode :title="stateModal.title" :desc="stateModal.desc" :imgUrl="stateModal.image" v-model="stateModal.serviceShow"></y-service-qrcode>
    <y-tabbar></y-tabbar>
  </y-layout>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import shiba from "@/shiba";
import { onLoad, onReachBottom, onShow } from "@dcloudio/uni-app";
import emojio from "@/shiba/utils/emjio";
const user = computed(() => shiba.$store("user").user);
const IsLogin = computed(() => shiba.$store("user").isLogin);
const topic_id = computed(() => shiba.$store("app").user_topic_id);
onShow(() => {
  getGrassInfo();
});

let stateModal = reactive({
  image: "",
  content: "",
  title: "联系客服",
  desc: "长按识别联系客服",
  serviceShow: false,
});

let RouteList = reactive([
  // {
  //   id: 1,
  //   name: "跑腿平台",
  //   icon: "/static/public/icon-51.png",
  //   url: "/pages/errand/errand-auth",
  // },
  {
    id: 2,
    name: "开通校园集市",
    icon: "/static/public/icon-52.png",
    type: "action",
    action: "Service",
  },
  {
    id: 3,
    name: "商务合作",
    icon: "/static/public/icon-53.png",
    type: "action",
    action: "Service",
  },
  {
    id: 4,
    name: "封禁申诉",
    icon: "/static/public/icon-54.png",
    type: "action",
    action: "BanAppeal",
  },
  {
    id: 5,
    name: "本校客服",
    icon: "/static/public/icon-55.png",
    type: "action",
    action: "ServiceSchool",
  },
  {
    id: 6,
    name: "官方客服",
    icon: "/static/public/icon-56.png",
    type: "action",
    action: "Service",
  },
  {
    id: 7,
    name: "集市规范",
    icon: "/static/public/icon-57.png",
    url: "/pages/setting/agreement?id=8",
  },
  {
    id: 8,
    name: "系统设置",
    icon: "/static/public/icon-58.png",
    url: "/pages/setting/setting",
  },
]);

/**
 * --
 * 经验 角色等级
 * --
 *
 */

let state = reactive({
  is_auth: 0,
  AccountID: "",
  AppID: "",
  is_run_auth: 0,
  show: false,
  kefu_image: "",
});
// 获取动态
// 获取首页详情
// run_auth_status：跑腿认证状态：0.未申请，1.待审核，2.审核通过
// auth_status：身份认证状态：0.未申请，1.待审核，2.审核通过
const getGrassInfo = async () => {
  const res = await shiba.$api.public.getGrassIndex({
    id: topic_id.value,
  });
  state.run_auth_status = res.data.run_auth_status;
  state.auth_status = res.data.auth_status;
  state.name = res.data.name;
  state.AppID = res.data.AppID;
  state.AccountID = res.data.AccountID;
  state.kefu_image = res.data.kefu_image;
  // if (state.run_auth_status == 2) {
  //   RouteList[0].url = "/pages/errand/receiving-workstation";
  // }
};

// 获取消息
let Notification = ref([]);
let noticePage = 1;
const GetNotification = async () => {
  const res = await shiba.$api.api.GetNotification({
    type: 2,
    page: noticePage,
  });
  res.data.data.map((items) => {
    Notification.value.push(items);
  });
};

/**
 *-----------
 * 帮忙置顶
 * --------
 */

const HelpBumpRef = shiba.$hook.useRoofBox();
const HelpBump = async (item) => {
  // 获取置顶价格
  const { data } = await shiba.$api.api.getTopUp();
  const res = await HelpBumpRef.confirm({
    data: data,
    grass_id: item.id,
    title: "付费置顶",
  });
};

// 打开联系客服IMG
const open = () => {};

// 跳转公众号
const ToMpWEchart = () => {
  wx.openBusinessView({
    bizType: "mp_profile", // 业务类型，mp_profile表示公众号，其他业务类型请参考官方文档
    extInfo: {
      username: state.AccountID,
      path: "pages/index/index",
      isMainPage: false,
    },
    success(res) {
      // 成功回调
      console.log("成功打开公众号");
    },
    fail(err) {
      // 失败回调
      console.error("打开公众号失败", err);
    },
  });
};

const routeMap = (item) => {
  if (item.type == "action") {
    switch (item.action) {
      case "Service":
        // 跳转公众号
        uni.$y.ToWeChatFollowByArticle("BJXXLXYJS");
        break;
      case "BanAppeal":
        // 打开本校二维码
        stateModal.desc = "长按识别联系客服申诉";
        stateModal.image = "";
        stateModal.title = "封禁申诉";
        stateModal.serviceShow = true;
        break;
      case "ServiceSchool":
        // 打开二维码
        stateModal.desc = "长按识别联系本校客服";
        stateModal.image = "";
        stateModal.title = "本校客服";
        stateModal.serviceShow = true;
        break;
      default:
        break;
    }
  } else {
    uni.$u.route({
      url: item.url,
    });
  }
};

const routeAuth = (item) => {
  uni.$u.route({
    url: "/pages/public/real-auth",
    params: {},
  });
};

// 弹出登录
const loginApply = () => {
  uni.$store("modal").SETKEYDATA("Auth", false);
  uni.$store("modal").SETKEYDATA("Auth", true);
};
</script>

<style lang="scss" scoped>
.info-content {
  .user-card {
    display: flex;
    align-items: center;
    padding: 10rpx 20rpx;
    justify-content: space-between;
    width: 100%;
    .user-card__avatar {
      width: 120rpx;
    }
    .arrow {
      width: 30rpx;
    }
    .user-card__data {
      width: calc(100% - 120rpx - 30rpx);
      .user-card__info {
        display: flex;
        gap: 10rpx;
        .user-card__name {
          font-size: 32rpx;
          color: rgba(51, 51, 51, 1);
          font-weight: bold;
        }
        .user-card__status {
          width: 88rpx;
          height: 34rpx;
          background: #bbbbbb;
          border-radius: 4rpx 4rpx 4rpx 4rpx;
          text-align: center;
          font-size: 24rpx;
          color: #fff;
        }
        .user-card__status_real {
          background: rgb(22, 115, 254) !important;
        }
      }
      .user-card__school {
        font-size: 24rpx;
        color: #333333;
        font-weight: 500;
        display: flex;
      }
    }
  }
}
.my-action {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;
  .action-item {
    margin: 10rpx 0;
    width: 330rpx;
    height: 120rpx;
    position: relative;
    .text-content {
      display: flex;
      align-items: center;
      position: absolute;
      top: 60%;
      left: 25%;
      transform: translate(-50%, -50%);
      justify-content: center;
      font-size: 28rpx;
      color: #666666;
    }
    image {
      position: absolute;
      width: 330rpx;
      height: 120rpx;
    }
  }
}
.cell-list {
  .cell-item {
    padding: 0 20rpx;
    height: 110rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .cell-lable {
      height: 109rpx;
      border-bottom: 1rpx solid #eeeeee;
      width: calc(100% - 70rpx);
      justify-content: space-between;
      display: flex;
      align-items: center;
      color: #333333;
      justify-content: space-between;
    }
    .cell-icon {
      width: 70rpx;
    }
  }
}

// 弹出保证金
.work-qrcode {
  width: 600rpx;

  border-radius: 20rpx;
  background: linear-gradient(180deg, #c6ddff 0%, #ffffff 22%);
  .qrcode-info {
    width: 300rpx;
    margin: 0 auto;
    padding-top: 100rpx;
    padding-bottom: 20rpx;
  }
  .qrcode-title {
    font-size: 28rpx;
    color: #999999;
    text-align: center;
  }
  .qrcode-value {
    height: 90rpx;
    font-size: 28rpx;
    color: #999999;
    text-align: center;
    line-height: 1.5;
  }
}
</style>

<style>
page {
  background: url(../../static/public/bg_user.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
