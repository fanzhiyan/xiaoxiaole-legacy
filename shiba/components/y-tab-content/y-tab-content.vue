<template>
  <swiper @change="changeCurrent" class="swiper-box" :current="modelValue" :duration="500">
    <!-- 动态 -->
    <swiper-item>
      <view @scrolltolower="ReachBottom(0)" scroll-y="true" class="swiper-item">
        <view scroll-x="true" class="condition">
          <view class="condition-scroll">
            <view class="condition-item skeleton-row" :class="{ active: stateInfo.grassLabelId == item.id }" @click="changeFiltrate(item)" v-for="item in state.grassLabel">
              {{ item.title }}
            </view>
          </view>
        </view>

        <y-empty icon="data" title="暂无新动态" v-if="state.grassList.length == 0"></y-empty>
        <!-- 内容区域 消息卡片 -->
        <view class="message-card skeleton-row" v-for="item in state.grassList">
          <view class="message-card__header">
            <view class="user-info">
              <view class="user-avatar">
                <y-avatar size="64rpx" :src="$y.oss(item.user.avatar)"></y-avatar>
              </view>
              <view class="user-details">
                <view class="user-name">
                  <view class="name">
                    {{ item?.user?.nickname }}
                  </view>
                  <view class="time">
                    {{ item.time }}
                  </view>
                </view>
                <view class="user-level">
                  <!--  <u-image width="109rpx" height="38rpx" src="/static/public/level-xxs.png" mode="aspectFit"></u-image> -->
                  <y-grade :level_img="item.user.level_img" :level_text="item.user.level_text"></y-grade>
                </view>
              </view>
            </view>
            <view class="more-options">
              <view class="opction-item">
                <u-image
                  width="80rpx"
                  height="33rpx"
              </view>
              <view class="opction-item">
                <text class="shiba-checkmore" @click="report(item)"></text>
              </view>
            </view>
          </view>
          <view class="message-content" @click="$u.route(`/pages/management/management-info?id=${item.id}`)">
            <text class="tag">{{ item.label_text }}</text>
            <text class="title_lable">{{ item.title }}</text>
            <text class="content_text">{{ item.introduce }}</text>
          </view>
          <view class="media-gallery" v-if="item?.imageArray?.length == 0" @click="$u.route('/pages/management/management-info')">
            <u-image width="216rpx" height="226rpx" :src="$y.oss(items)" mode="aspectFit" v-for="items in item.imageArray"></u-image>
          </view>
          <view class="message-footer">
            <view class="meta-info">
              <view class="time-stamp">{{ item.time }}</view>
              <view class="viewer-count">{{ item.browses }}人围观</view>
            </view>
            <view class="action-buttons">
              <view class="button message" @click="stateInfo.warmShow = true">
                <u-image width="26rpx" @click="HelpBump(item)" height="34rpx" src="/static/icon/icon-down.png" mode="aspectFit"></u-image>
              </view>
              <view class="button pin" @click="$u.route(`/pages/management/management-info?id=${item.id}`)">
                <u-image width="26rpx" height="34rpx" src="/static/icon/icon-msg.png" mode="aspectFit"></u-image>
              </view>
            </view>
          </view>
        </view>
      </view>
    </swiper-item>
    <!-- 跑腿 -->
    <swiper-item>
      <view scroll-y="true" @scrolltolower="ReachBottom(1)" class="swiper-item">
        <!-- 内容区域 消息卡片 -->
        <view scroll-x="true" class="condition">
          <view class="condition-scroll">
            <view class="condition-item" :class="{ active: stateErrandInfo.ErrandLabelId == item.id }" @click="changeErrandFiltrate(item)" v-for="item in state.errandLabel">
              {{ item.name }}
            </view>
          </view>
        </view>
        <y-empty icon="data" title="暂无新的跑腿" v-if="state.errandList.length == 0"></y-empty>
        <view class="message-card message-card-errand" v-for="item in state.errandList">
          <view class="message-card__header">
            <view class="user-info">
              <view class="user-avatar">
                <y-avatar :src="$y.oss(item?.user?.avatar)" size="64rpx"></y-avatar>
              </view>
              <view class="user-details">
                <view class="user-name">
                  <view class="name">
                    {{ item?.user?.nickname }}
                  </view>
                  <view class="time">
                    {{ item.time }}
                  </view>
                </view>
                <view class="user-level">
                  <y-grade :level_img="item.user.level_img" :level_text="item.user.level_text"></y-grade>
                </view>
              </view>
            </view>
            <view class="more-options">
              <view class="state">{{ item.status_text }}</view>
            </view>
          </view>
          <view class="message-content" @click="$u.route(`/pages/management/errand-info?id=${item.id}`)">
            {{ item.content }}
          </view>

          <view class="message-footer">
            <view class="price-content">
              <text class="tips">佣金</text>
              <text class="l-price price">{{ item.price }}</text>
            </view>
            <view class="" style="display: flex; gap: 10rpx">
              <u-button
                @click="completeRunErrands(item)"
                :customStyle="{
                  width: '136rpx',
                  color: '#333333',
                  height: '48rpx',
                }"
                shape="circle"
                color="#1673FE"
                text="确认完成"
                v-if="(item.is_self == 1) & (item.status == 2)"></u-button>
              <u-button
                @click="ReceiveCancelUser(item)"
                :customStyle="{
                  width: '136rpx',
                  color: '#333333',
                  height: '48rpx',
                }"
                shape="circle"
                color="#1673FE"
                text="取消"
                v-if="(item.is_self == 1) & (item.status == 0)"></u-button>
              <!-- 接单人 -->
              <u-button
                v-if="(item.status == 0) & (item.is_self == 0) & (item.is_auth == 0)"
                :customStyle="{
                  width: '136rpx',
                  color: '#333333',
                  height: '48rpx',
                }"
                shape="circle"
                color="#1673FE"
                text="接单"
                @click="receivingOrder(item)"></u-button>

              <u-button
                v-if="(item.status == 1) & (item.is_self == 0) & (item.is_auth == 0)"
                :customStyle="{
                  width: '136rpx',
                  color: '#333333',
                  height: '48rpx',
                }"
                shape="circle"
                color="#1673FE"
                text="送达"
                @click="delivered(item)"></u-button>
              <u-button
                @click="ReceiveCancel(item)"
                v-if="(item.status == 1) & (item.is_self == 0) & (item.is_auth == 0)"
                :customStyle="{
                  width: '136rpx',
                  color: '#333333',
                  height: '48rpx',
                }"
                shape="circle"
                color="#1673FE"
                text="取消订单"></u-button>
            </view>
          </view>
        </view>
      </view>
    </swiper-item>
    <!-- 组局 -->
    <swiper-item>
      <view scroll-y="true" @scrolltolower="ReachBottom(2)" class="swiper-item">
        <!-- 内容区域 消息卡片 -->
        <view scroll-x="true" class="condition">
          <view class="condition-scroll">
            <view class="condition-item" :class="{ active: stateInfo.GroupLabelId == item.id }" @click="changeGroupFiltrate(item)" v-for="item in state.groupLabel">
              {{ item.name }}
            </view>
          </view>
        </view>
        <y-empty icon="data" title="暂无新组局" v-if="state.groupList == 0"></y-empty>
        <view
          class="message-card group_booking"
          @click="$u.route(`/pages/management/group-info?id=${item.id}`)"
          :class="{ group_booking_cancel: item.status == 2 || item.status == 3 }"
          v-for="item in state.groupList">
          <view class="mark_status" v-if="item.status >= 2">
            <view class="logo_mark">
              {{ item.status == 2 ? "已失效" : "已取消" }}
            </view>
          </view>
          <view class="message-card__header">
            <view class="user-info">
              <view class="user-avatar">
                <y-avatar size="64rpx" :src="$y.oss(item.user.avatar)"></y-avatar>
              </view>
              <view class="user-details">
                <view class="user-name">
                  <view class="name">
                    {{ item?.user?.nickname }}
                  </view>
                  <view class="time">
                    {{ item.time }}
                  </view>
                </view>
                <view class="user-level">
                  <y-grade :level_img="item.user.level_img" :level_text="item.user.level_text"></y-grade>
                </view>
              </view>
            </view>
          </view>
          <view class="message-content">
            <text class="tag">{{ item?.grass_team_type?.name }}</text>
            {{ item.title }}
          </view>
          <view class="media-gallery">
            <u-image width="216rpx" height="226rpx" :src="$y.oss(img)" mode="aspectFit" v-for="img in item.images"></u-image>
          </view>
          <view class="message-footer">
            <view class="group-booking">
              <view class="label">{{ item.remain_number }}</view>
              <view scroll-x="true" :show-scrollbar="false" class="user-list">
                <view class="avatar-list-row">
                  <u-avatar size="33rpx" :src="$y.oss(userTrem?.user?.avatar)" v-for="userTrem in item.treamList"></u-avatar>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </swiper-item>
  </swiper>
  <y-roof></y-roof>
  <y-report :grass_id="state.reportId" v-model="state.modalReport"></y-report>
  <y-message-box selector="message-tab"></y-message-box>
</template>

<script setup>
import { reactive, computed, ref, watch } from "vue";
import shiba from "@/shiba";
const emits = defineEmits(["changeIndex", "update:modelValue"]);
const message = shiba.$hook.useMessageBox("message-tab");
const appStore = computed(() => shiba.$store("app").user_topic_id);
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
});

// 分类数据
const state = reactive({
  // 要举报的某一条
  reportId: "",
  modalReport: false,
  //
  grassList: [],
  grassLabel: [],
  grassPagination: {
    page: 1,
    limit: 15,
    total: 0,
  },
  // 跑腿
  errandList: [],
  errandLabel: [
    {
      id: -1,
      name: "全部",
    },
    {
      id: 1,
      name: "我发布的",
    },
    {
      id: 2,
      name: "我帮助的",
    },
  ],
  errandPagination: {
    page: 1,
    limit: 15,
    total: 0,
  },

  // 组局
  groupList: [],
  groupLabel: [],
  groupPagination: {
    page: 1,
    limit: 15,
    total: 0,
  },
});

/**
 * ---------------
 * 举报
 * ---------------
 */
const report = (item) => {
  state.reportId = item.id;
  state.modalReport = true;
};

/**
 * -----------------------
 *   动态
 * -------------------------
 */
const stateInfo = reactive({
  // 当前圈子动态选中的id
  grassLabelId: -1,
  // 组局选中的id
  GroupLabelId: false,
});
// 筛选
const changeFiltrate = (item) => {
  // 中间值
  let centerId = stateInfo.grassLabelId;
  stateInfo.grassLabelId = item.id;
  if (centerId != item.id) {
    state.grassPagination.page = 1;
    state.grassList.length = 0;
    GetGrassInfo();
  }
};
const getGrassLabel = async () => {
  const res = await shiba.$api.public.getGrassLabel();
  state.grassLabel = res.data;
  state.grassLabel.unshift({
    title: "全部",
    id: -1,
  });
};
// 获取圈子动态
let GrassList = reactive([]);
const GetGrassInfo = async () => {
  const res = await shiba.$api.public.GetGrassInfo({
    topic_id: appStore.value,
    label: stateInfo.grassLabelId < 0 ? "" : stateInfo.grassLabelId,
    ...state.grassPagination,
    keyword: "",
  });
  res.data.data.map((ii) => {
    let imgUrlArr = ii.images_url.split(",").filter((item) => item != "");
    state.grassList.push({
      ...ii,
      imageArray: imgUrlArr,
    });
  });
};
/**
 * -----------------------
 *   组局
 * -------------------------
 */
// 筛选
const changeGroupFiltrate = (item) => {
  // 中间值
  let centerId = stateInfo.GroupLabelId;
  stateInfo.GroupLabelId = item.id;
  if (centerId != item.id) {
    state.groupPagination.page = 1;
    state.groupList.length = 0;
    getGroupList();
  }
};
const getTypeLabel = async () => {
  const res = await shiba.$api.public.getType();
  state.groupLabel = res.data;
  state.groupLabel.unshift({
    name: "全部",
    id: -1,
  });
  changeGroupFiltrate(state.groupLabel[0]);
};
// 获取组局列表
const getGroupList = async () => {
  const res = await shiba.$api.public.GrassTeamList({
    topic_id: appStore.value,
    type_id: stateInfo.GroupLabelId < 0 ? "" : stateInfo.GroupLabelId,
    ...state.groupPagination,
    keyword: "",
  });
  res.data.data.map((ii) => {
    let tream = new Array(ii.number);
    ii.team_user.map((items, index) => {
      tream[index] = items || {};
    });
    console.log(tream, "tream");
    state.groupList.push({
      ...ii,
      images: ii.images.split(",").filter((item) => item != ""),
      // 等几人根据 numebr循环
      treamList: tream,
    });
  });
};
/**
 * -----------------------
 *  跑腿
 * -------------------------
 */

const stateErrandInfo = reactive({
  // 当前圈子动态选中的id
  ErrandLabelId: -1,
});
// 筛选
const changeErrandFiltrate = (item) => {
  // 中间值
  let centerId = stateErrandInfo.ErrandLabelId;
  stateErrandInfo.ErrandLabelId = item.id;
  if (centerId != item.id) {
    state.errandPagination.page = 1;
    state.errandList.length = 0;
    getErrandList();
  }
};
// 获取跑腿数据
const getErrandList = async (item) => {
  const res = await shiba.$api.public.GrassRunErrands({
    topic_id: appStore.value,
    type: stateErrandInfo.ErrandLabelId < 0 ? "" : stateErrandInfo.ErrandLabelId,
    ...state.errandPagination,
  });
  res.data.data.map((ii) => {
    state.errandList.push(ii);
  });
};

// 加载数据方法
const loadData = async (type) => {
  console.log(type, "typetypetype");
  switch (type) {
    case 0:
      getGrassLabel();
      GetGrassInfo();
      break;
    case 1:
      getErrandList();
      // 请求获取跑腿
      break;
    case 2:
      getTypeLabel();
      // 请求获取组局
      break;
  }
};
// 跑腿接单
const receivingOrder = async (item) => {
  const confirm = await message.confirm({
    title: "提示",
    content: "若订单信息不明确，进入详情页联系发单人",
    confirmText: "确认接单",
  });
  const res = await shiba.$api.public.ReceiveErrands({
    run_errands_id: item.id,
  });
  item.status = 1;
  // let index = state.errandList.findIndex((items) => items.id == item.id);

  // if (index != -1) {
  //   state.errandList.splice(index, 1);
  // }
};
// 跑腿接单人取消订单
const ReceiveCancel = async (item) => {
  const confirm = await message.confirm({
    title: "提示",
    content: "取消订单？",
    confirmText: "确认取消",
  });
  const res = await shiba.$api.public.ReceiveCancel({
    run_errands_id: item.id,
  });
  item.status = 5;
  // let index = state.errandList.findIndex((items) => items.id == item.id);
  // console.log(index, "indexindex");
  // if (index != -1) {
  //   state.errandList.splice(index, 1);
  // }
};
// 发单人取消订单
const ReceiveCancelUser = async (item) => {
  const confirm = await message.confirm({
    title: "提示",
    content: "取消订单？",
    confirmText: "确认取消",
  });
  const res = await shiba.$api.public.cancelGrassRunErrands({
    run_errands_id: item.id,
  });
  item.status = 5;
  // let index = state.errandList.findIndex((items) => items.id == item.id);
  // if (index != -1) {
  //   state.errandList.splice(index, 1);
  // }
};
// 发单人 确认完成订单
const completeRunErrands = async (item) => {
  const confirm = await message.confirm({
    title: "提示",
    content: "请及时点击“完成”按钮确认订单，跑腿才可收到佣金",
    confirmText: "完成",
  });
  const res = await shiba.$api.public.completeRunErrands({
    run_errands_id: item.id,
  });
  item.status = 3;
  // let index = state.errandList.findIndex((items) => items.id == item.id);
  // if (index != -1) {
  //   state.errandList.splice(index, 1);
  // }
};
// 接单人点送达
const delivered = async (item) => {
  const confirm = await message.confirm({
    title: "提示",
    content: "请提醒客户点击“完成”确认订单，佣金进入“我的”--“钱包”。",
    confirmText: "确认",
  });
  const res = await shiba.$api.public.delivered({
    run_errands_id: item.id,
  });
  item.status = 2;
  // let index = state.errandList.findIndex((items) => items.id == item.id);
  // if (index != -1) {
  //   state.errandList.splice(index, 1);
  // }
};
// 监听modelValue变化
watch(
  () => props.modelValue,
  (val) => {
    // 初始化时加载数据
    if ((val === 0) & (state.grassList.length === 0) || (val === 1) & (state.errandList.length === 0) || (val === 2) & (state.groupList.length === 0)) {
      loadData(val);
    }
  },
  {
    immediate: true,
  }
);

// 底部加载更多时候
const ReachBottom = (newValue) => {
  if (newValue == 0) {
    state.grassPagination.page++;
    GetGrassInfo();
  }
  if (newValue == 2) {
    state.groupPagination.page++;
    getGroupList();
  }
  if (newValue == 1) {
    state.errandPagination.page++;
    getErrandList();
  }
};

/**
 *-----------
 * 帮忙置顶
 * --------
 */

// 置顶\
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

// 新增一个方法来刷新当前选项卡的数据
const refreshCurrentTabData = () => {
  switch (props.modelValue) {
    case 0:
      // 刷新动态数据
      state.grassPagination.page = 1;
      state.grassList = [];
      GetGrassInfo();
      break;
    case 1:
      // 刷新跑腿数据
      state.errandPagination.page = 1;
      state.errandList = [];
      getErrandList();
      break;
    case 2:
      // 刷新组局数据
      state.groupPagination.page = 1;
      state.groupList = [];
      getGroupList();
      break;
  }
};

const changeCurrent = (e) => {
  console.log(e.detail.current, "changeCurrentchangeCurrentchangeCurrentchangeCurrent");
  emits("update:modelValue", e.detail.current);
};

defineExpose({
  ReachBottom,
  refreshCurrentTabData,
});
</script>

<style lang="scss" scoped>
.swiper-box {
  height: 100vh;
}

.status-row {
  width: 710rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;

  .switch-button {
    width: 126rpx;
    height: 54rpx;
    background: #f8f8f8;
    border-radius: 27rpx;
    display: flex;
    align-items: center;
    font-size: 24rpx;
    justify-content: center;
  }
}

.university-cell {
  display: flex;

  .university-cell-item {
    width: 130rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .icon {
      margin-bottom: 10rpx;
    }

    .label {
      font-size: 24rpx;
    }
  }
}

.university-card {
  height: 200rpx;
  margin-top: 200rpx;
  position: relative;

  // &::before {
  // 	position: absolute;
  // 	width: 100%;
  // 	bottom: 0;
  // 	border-radius: 20rpx 20rpx 0 0;
  // 	height: 100rpx;
  // 	background-color: #fff;
  // 	content: "";
  // }

  .university-info {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 20rpx;
  }

  .university-image {
    width: 200rpx;
    height: 200rpx;
    border-radius: 10rpx;
    margin-right: 20rpx;
  }

  .university-details {
    display: flex;
    width: calc(100% - 170rpx);
    flex-direction: column;
    justify-content: center;

    .university-title {
      height: 80rpx;
    }

    .university-name {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }

    .university-description {
      font-size: 24rpx;
      color: #666;
      width: 88rpx;
      height: 48rpx;
      background-color: #fff;
      text-align: center;
      margin-bottom: 10rpx;
      border-radius: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .university-members {
      font-size: 24rpx;
      color: #333;
      height: 70rpx;
      align-items: center;
      display: flex;
      justify-content: space-between;

      .university-num {
        font-size: 26rpx;
        color: #333333;
      }

      .add {
        padding: 5rpx 25rpx;
        height: 48rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fec93a;
        border-radius: 24rpx;
        color: #333333;
        font-weight: bold;
      }
    }
  }
}

.condition {
  height: 100rpx;

  .condition-scroll {
    display: flex;
    align-items: center;
    gap: 20rpx;
    flex-direction: row;
    height: 80rpx;
    padding: 0 20rpx;
  }

  .condition-item {
    flex-shrink: 0;
    background: #f6f7f9;
    border-radius: 28rpx;
    padding: 8rpx 10rpx;
    font-size: 22rpx;
  }

  .active {
    background-color: rgba(255, 212, 96, 0.3);
    color: #f5aa00;
    font-weight: bold;
  }
}

.freshman_support_zone {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10rpx;

  .freshman-classify {
    width: 600rpx;
  }

  .search {
    .shiba-search {
      color: #d9d9d9;
      font-size: 42rpx;
    }

    display: flex;
    align-items: center;
    justify-content: center;
    width: 70rpx;

    position: relative;

    &::before {
      position: absolute;
      content: "";
      width: 5rpx;
      height: 25rpx;
      background-color: #cdcdcd;
      left: 0;
      border-radius: 10rpx;
    }
  }
}

.message-card {
  width: 670rpx;
  margin: 0 auto;
  background-color: white;
  overflow: hidden;
  border-bottom: 1rpx solid #f8f8f8;
  padding-bottom: 10rpx;

  &__header {
    padding: 10rpx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .user-info {
      display: flex;
      align-items: center;

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 5rpx;
      }

      .user-details {
        display: flex;

        .user-name {
          .name {
            // line-height: 40rpx;
            margin-bottom: 5rpx;
            font-size: 25rpx;
          }

          .time {
            color: #a7a7a7;
            font-size: 22rpx;
            font-weight: 400;
          }
        }

        .user-level {
          margin: 0 10rpx;
          font-size: 0.875rem;
        }
      }
    }

    .more-options {
      width: 120rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .opction-item {
        font-size: 35rpx;
        font-weight: bold;
      }
    }
  }

  .message-content {
    font-size: 32rpx;
    padding: 15rpx 0rpx;
    line-height: 1.6;
    color: #333333;
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 10rpx;

    .tag {
      background: rgba(254, 179, 36, 0.2);
      border-radius: 28rpx 28rpx 28rpx 28rpx;
      padding: 5rpx 20rpx;
      // margin-right: 20rpx;
      font-size: 16rpx;
      color: #f5aa00;
    }
    .title_lable {
    }
  }

  .media-gallery {
    gap: 10rpx;
    display: flex;
    flex-wrap: wrap;
  }

  .message-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx;

    .action-buttons {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48rpx;
      width: 180rpx;
      background: rgb(246, 247, 249, 0.4);
      border-radius: 24rpx 24rpx 24rpx 24rpx;

      .button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        opacity: 0.7;
        padding: 0 10rpx;
      }
    }

    .meta-info {
      gap: 20rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      color: #999999;

      .time-stamp {
        font-size: 22rpx;
      }

      .viewer-count {
        font-size: 22rpx;
      }
    }
  }
}

.stateInfo_content {
  width: 750rpx;
  height: 624rpx;
  padding: 20rpx;

  .close {
    display: flex;
    justify-content: flex-end;
  }

  .content {
    font-size: 28rpx;
    color: #666666;
    line-height: 1.5;
  }

  .cancel-out {
    margin: 20rpx 0;
  }

  .school-content-info {
    display: flex;
    height: 130rpx;
    justify-content: space-between;
    align-items: center;
    margin: 20rpx 0;

    .avatar {
      width: 100rpx;
    }

    .name {
      width: 450rpx;
      font-weight: bold;
      font-size: 32rpx;
      color: #333;
      margin-bottom: 5rpx;
    }

    .share {
      width: 138rpx;
      height: 48rpx;
      background: #ffd972;
      border-radius: 24rpx 24rpx 24rpx 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

// 帮助
.message-card-errand {
  border-bottom: 1rpx solid #f9f9f9;

  .more-options {
    justify-content: flex-end;
  }

  .message-footer {
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;

    .price-content {
      .tips {
        font-size: 24rpx;
        color: #333333;
      }

      .price {
        color: #e81616;
        margin: 0 10rpx;
      }
    }
  }

  .state {
    width: 80rpx;
    height: 30rpx;
    font-size: 15rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffcfac;
    border-radius: 15rpx 15rpx 15rpx 15rpx;
  }
}

// 拼团
.group_booking {
  .message-footer {
    justify-content: flex-end;
  }

  .group-booking {
    width: 242rpx;
    height: 48rpx;
    background: #fec93a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rpx;
    font-weight: bold;
    border-radius: 24rpx;

    .label {
      font-size: 24rpx;
      color: #333333;
      text-align: center;
      width: 100rpx;
      flex-shrink: 0;
    }

    .user-list {
      display: flex;
      gap: 5rpx;
      width: 140rpx;

      .avatar-list-row {
        display: flex;
        gap: 15rpx;
      }
    }
  }

  .group-list {
    width: 192rpx;
    height: 48rpx;
    background: #fec93a;
    border-radius: 24rpx 24rpx 24rpx 24rpx;
  }
}

.create-popup {
  width: 750rpx;
  height: 556rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: 24rpx 24rpx 0rpx 0rpx;

  .action-item {
    margin: 20rpx 0;
    width: 686rpx;
    height: 117rpx;
    background: #f4f4f4;
    border-radius: 59rpx 59rpx 59rpx 59rpx;
    background-color: #f4f4f4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;

    .next {
      width: 50rpx;
      flex-shrink: 0;
      color: #333;
    }

    .content-info {
      width: 460rpx;

      .content-label {
        font-size: 28rpx;
        color: #333333;
        font-weight: bold;
      }

      .content-values {
        color: #999999;
        font-size: 24rpx;
      }
    }
  }
}

// 付费帮顶
.warm-content {
  height: 70vh;

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
        background-color: #ffd972;
        color: #333333;
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
      height: 560rpx;

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
          padding-right: 90rpx;
          font-size: 40rpx;
        }
      }
    }
  }
}
// 1.人数已满，0.人数不足，2.失效，3.已取消'
.group_booking_cancel {
  position: relative;
  .mark_status {
    position: absolute;
    width: 100%;
    height: 100%;
    color: red;
    font-size: 45rpx;
    z-index: 9997;
    background-color: rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    .logo_mark {
      padding: 5rpx 10rpx;
      border-radius: 10rpx;
      font-size: 28rpx;
      background-color: #ffd972;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
  }
}
</style>
<style>
.swiper-item {
  height: 100vh;
}
</style>
