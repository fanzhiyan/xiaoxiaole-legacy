<template>
  <y-layout>
    <!-- cell列表 -->
    <view class="card-menu-cell l-pl-sm l-pr-sm">
      <view class="card-cell l-f l-f-row l-a-center l-j-between" v-for="item in CellList" @click="$u.route(item.url)">
        <view class="left-cell l-f l-a-center">
          <view class="label l-pl-sm l-text-bold">
            {{ item.name }}
          </view>
        </view>
        <view>
          <text class="shiba-next"></text>
        </view>
      </view>
    </view>
    <view class="logo" style="display: flex; align-items: center; justify-content: center">
      <up-image width="350rpx" height="350rpx" :src="$y.oss('/uploads/logo.png')" mode=""></up-image>
    </view>
    <y-fixed-bottom bottom="30rpx" v-if="IsLogin">
      <u-button @click="layOut" :customStyle="{ width: '680rpx', color: '#999999', fontWeight: 'bold', height: '80rpx' }" color="#EEEEEE" shape="circle" text="退出登录"></u-button>
    </y-fixed-bottom>
  </y-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import shiba from "@/shiba";
const IsLogin = computed(() => shiba.$store("user").isLogin);
const message = shiba.$hook.useMessageBox();
// 其他列表
let CellList = ref([
  // {
  //   id: 2,
  //   name: "常见问题",
  //   url: "/pages/public/problem",
  // },
  {
    id: 3,
    name: "意见反馈",
    url: "/pages/public/feedback",
  },
  {
    id: 4,
    name: "关于我们",
    url: "/pages/setting/agreement?title=关于我们&id=3",
  },
  {
    id: 5,
    name: "用户协议",
    url: "/pages/setting/agreement?title=用户协议&id=1",
  },
  {
    id: 6,
    name: "隐私政策",
    url: "/pages/setting/agreement?title=隐私政策&id=2",
  },
]);

const layOut = async () => {
  const res = await message.confirm({
    title: "提示",
    content: "确认退出登录吗？",
  });
  uni.$store("user").LogOut();
  uni.navigateBack();
};

// 获取设备缓存
let currentSize = ref(0);
const getStorageInfo = () => {
  uni.getStorageInfo({
    success: function (res) {
      currentSize.value = (res.currentSize / 1024).toFixed(3) + "MB";
    },
    fail: function (err) {
      currentSize.value = 0;
    },
  });
};

const ClearFileList = async () => {
  const ress = await message.confirm({
    title: "清除缓存",
    msg: "清除缓存后部分资源需要重新加载",
  });
  uni.getSavedFileList({
    success: function (res) {
      if (res.fileList.length > 0) {
        for (var i = 0; i < res.fileList.length; i++) {
          uni.removeSavedFile({
            filePath: res.fileList[i].filePath,
            complete: function (res) {
              console.log(res);
            },
          });
        }
        uni.showToast({
          icon: "none",
          title: "已清楚",
        });
        getStorageInfo();
      }
    },
  });
};

let verSion = ref(0);
const getVersion = () => {
  plus.runtime.getProperty(plus.runtime.appid, (inf) => {
    console.log(inf, "infinfinfs");
    verSion.value = inf.version;
  });
};
const getSetting = async () => {
  const res = await uni.$api.api.GetAppVersion();
  plus.runtime.getProperty(plus.runtime.appid, (inf) => {
    if (res.data.version > inf.versionCode) {
      uni.navigateTo({
        url: "/uni_modules/rt-uni-update/components/rt-uni-update/rt-uni-update",
      });
    } else {
      uni.showToast({
        icon: "none",
        title: "暂无新版本",
      });
    }
  });
};
</script>

<style lang="scss" scoped>
.card-cell:last-child {
  border-bottom: none !important;
}
.card-cell {
  border-bottom: 1rpx solid #f8f8f8;
  height: 112rpx;
  .left-cell {
    width: 200rpx;
  }
}
</style>
<style>
page {
  background-color: #fff !important;
}
</style>
