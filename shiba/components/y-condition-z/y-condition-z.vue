<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
  <view class="content">
    <!--  :enable-back-to-top="currentIndex===tabIndex" 在微信小程序上可以多加这一句，因为默认是允许点击返回顶部的，但是这个页面有多个scroll-view，会全部返回顶部，所以需要控制是当前index才允许点击返回顶部 -->
    <!-- 如果当前页已经加载过数据或者当前切换到的tab是当前页，才展示当前页数据（懒加载） -->
    <z-paging v-if="firstLoaded || isCurrentPage" ref="paging" v-model="dataList" @query="queryList" :fixed="false">
      <view class="condition-scroll">
        <view class="condition-item skeleton-row" :class="{ active: stateInfo.grassLabelId == item.id }" @click="changeFiltrate(item)" v-for="item in state.grassLabel">
          {{ item.title }}
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
            </view>
            <view class="opction-item">
              <text class="shiba-checkmore" @click="report(item)"></text>
            </view>
          </view>
        </view>
        <view class="message-content" @click="$u.route(`/pages/management/management-info?id=${item.id}`)">
          <text class="tag">{{ item.label_text }}</text>
          {{ item.title }}
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
    </z-paging>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
      dataList: [],
      // 当前组件是否已经加载过了
      firstLoaded: false,
      // 是否滚动到当前页
      isCurrentPage: false,
    };
  },
  props: {
    // 当前组件的index，也就是当前组件是swiper中的第几个
    tabIndex: {
      type: Number,
      default: function () {
        return 0;
      },
    },
    // 当前swiper切换到第几个index
    currentIndex: {
      type: Number,
      default: function () {
        return 0;
      },
    },
  },
  watch: {
    currentIndex: {
      handler(newVal) {
        if (newVal === this.tabIndex) {
          // 懒加载，当滑动到当前的item时，才去加载
          if (!this.firstLoaded) {
            // 这里需要延迟渲染z-paging的原因是为了避免在一些平台上立即渲染可能引发的底层报错问题
            this.$nextTick(() => {
              setTimeout(() => {
                this.isCurrentPage = true;
              }, 100);
            });
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 接收父组件传过来的刷新列表要求
    reload() {
      this.$nextTick(() => {
        // 刷新列表数据(如果不希望列表pageNo被重置可以用refresh代替reload方法)
        this.$refs.paging && this.$refs.paging.reload();
      });
    },
    queryList(pageNo, pageSize) {
      // 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
      // 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
      // 模拟请求服务器获取分页数据，请替换成自己的网络请求
      const params = {
        pageNo: pageNo,
        pageSize: pageSize,
        type: this.tabIndex + 1,
      };
      this.$request
        .queryList(params)
        .then((res) => {
          //将请求的结果数组传递给z-paging
          this.$refs.paging.complete(res.data.list);
          this.firstLoaded = true;
        })
        .catch((res) => {
          // 如果请求失败写this.$refs.paging.complete(false);
          // 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
          // 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
          this.$refs.paging.complete(false);
        });
    },
    itemClick(item) {
      console.log("点击了", item.title);
    },
  },
};
</script>

<style>
/* 注意:父节点需要固定高度，z-paging的height:100%才会生效 */
.content {
  height: 100%;
}

.item {
  position: relative;
  height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0rpx 30rpx;
}

.item-detail {
  padding: 5rpx 15rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: white;
  background-color: #007aff;
}

.item-line {
  position: absolute;
  bottom: 0rpx;
  left: 0rpx;
  height: 1px;
  width: 100%;
  background-color: #eeeeee;
}
</style>
