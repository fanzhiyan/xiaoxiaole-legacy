<template>
  <up-navbar title="圈内经验" :placeholder="true" :auto-back="true" bgColor="transparent"></up-navbar>
  <view class="user-level">
    <view class="bg-level">
      <y-level-role :role="user.level" :src="$y.oss(user.level_img)" width="200rpx" height="200rpx"></y-level-role>
    </view>
    <view class="bg">
      <up-image width="638rpx" height="155rpx" src="/static/level/level_bg.png" mode="aspectFit"></up-image>
    </view>
    <view class="content">
      <view class="user-level-pro">
        经验值已经达到
        <text class="level-pro">
          <text class="current-pro">{{ levelInfo.expCurrent }}</text>
          /
          <text class="total-pro">{{ levelInfo.expEnd }}</text>
        </text>
      </view>
      <view>
        <up-line-progress :percentage="levelInfo.progress" activeColor="#8D5710"></up-line-progress>
      </view>
    </view>
  </view>
  <view class="container">
    <!-- 经验等级盒子 -->
    <view class="box experience-box">
      <view class="table-container">
        <view class="table-row header">
          <view class="col">等级</view>
          <view class="col">圈内头衔</view>
          <view class="col">经验值</view>
        </view>
        <view v-for="item in levelData" :key="item.level" class="table-row data-row">
          <view class="col">{{ item.level }}</view>
          <view class="col" style="display: flex; align-items: center; justify-content: center">
            <y-level-role :role="item.level" :src="$y.oss(item.image)" width="48rpx" height="48rpx"></y-level-role>
          </view>
          <view class="col">{{ item.condition }}</view>
        </view>
      </view>
    </view>

    <!-- 获取经验盒子 -->
    <view class="box get-exp-box">
      <view class="table-container">
        <view class="table-row header">
          <view class="col">类别</view>
          <view class="col">条件</view>
          <view class="col">经验值</view>
        </view>
        <view v-for="(item, index) in expRules" :key="index" class="table-row data-row" :class="{ 'merged-row': item.merged }">
          <view class="col">{{ item.category || "2222" }}</view>
          <view class="col">{{ item.condition }}</view>
          <view class="col">+{{ item.exp }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import shiba from "../../shiba";
import { onLoad, onReachBottom, onShow } from "@dcloudio/uni-app";
import emojio from "@/shiba/utils/emjio";
const user = computed(() => shiba.$store("user").user);
const levelData = ref([]);
const expRules = [
  { category: "加入圈子", condition: "初次加入圈子", exp: 1 },
  { category: "每日登录", condition: "每日浏览圈子首页", exp: 1 },
  { category: "优质内容", condition: "在圈内发布动态", exp: 1, merged: true },
  { category: "优质内容", condition: "在圈内发布动态被评论", exp: 1, merged: true },
  { category: "优质内容", condition: "在圈内发布动态被直接转发", exp: 1, merged: true },
  { category: "优质内容", condition: "在圈内发布动态被点赞", exp: 1, merged: true },
];

/**
 * --
 * 经验 角色等级
 * --
 *
 */

let levelInfo = reactive({
  expCurrent: 0,
  expEnd: 0,
  progress: 0,
  level: "",
});

const GetLevelInfo = async () => {
  const res = await shiba.$api.public.GetLevelInfo();
  levelInfo.expCurrent = res.data.exp[0];
  levelInfo.expEnd = res.data.exp[1];
  levelInfo.progress = ((res.data.exp[0] / res.data.exp[1]) * 100).toFixed(2);
  levelData.value = res.data.levelList;
};

onLoad(() => {
  GetLevelInfo();
});
</script>

<style lang="scss">
.container {
  padding: 20rpx;
}

.box {
  overflow: hidden;
  border: solid #ffd460;
  border-radius: 12rpx;
  margin-bottom: 32rpx;
  .title {
    font-size: 32rpx;
    font-weight: 600;
    color: #303133;
    margin-bottom: 24rpx;
    padding-bottom: 16rpx;
    border-bottom: 1px solid #ebeef5;
  }
}

.table-container {
  .table-row {
    display: flex;
    padding: 16rpx 0;

    &.header {
      background-color: #ffd460;
      font-weight: 500;
    }

    &.data-row {
      border-bottom: 1px solid #ebeef5;

      &:last-child {
        border-bottom: none;
      }
    }

    .col {
      flex: 1;
      text-align: center;
      font-size: 28rpx;
      color: #606266;
      padding: 0 12rpx;

      &:nth-child(2) {
        flex: 2;
      }
    }
  }
}

.get-exp-box {
  .merged-row {
    .col:first-child {
      // visibility: hidden; // 保持列宽一致
    }
  }
}
</style>

<style scoped lang="scss">
.user-level {
  width: 640rpx;
  margin: 0 auto;
  height: 295rpx;
  position: relative;
  .bg {
    bottom: 0;
    position: absolute;
  }
  .bg-level {
    position: absolute;
    z-index: 1000;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .content {
    width: 100%;
    color: #8d5710;
    bottom: 0;
    position: absolute;
    z-index: 999;
    padding-top: 50rpx;
    height: 155rpx;
    padding-left: 30rpx;
    padding-right: 30rpx;
    .user-level-pro {
      height: 60rpx;
      .level-pro {
        color: #8d5710;
        .current-pro {
          font-size: 32rpx;
          color: #8d5710;
          font-weight: bold;
        }
        .total-pro {
        }
      }
    }
  }
}
.data-row:nth-child(2n) {
  background-color: #fff !important;
}
</style>
<style>
page {
  background-color: #fffaec;
}
</style>
