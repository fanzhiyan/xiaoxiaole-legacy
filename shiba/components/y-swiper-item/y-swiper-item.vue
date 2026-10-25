<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
  <view class="content">
    <!--  :enable-back-to-top="currentIndex===tabIndex" 在微信小程序上可以多加这一句，因为默认是允许点击返回顶部的，但是这个页面有多个scroll-view，会全部返回顶部，所以需要控制是当前index才允许点击返回顶部 -->
    <!-- 如果当前页已经加载过数据或者当前切换到的tab是当前页，才展示当前页数据（懒加载） -->
    <z-paging v-if="firstLoaded || isCurrentPage" ref="paging" v-model="dataList" @query="queryList" :fixed="false">
      <!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
      <view class="item" v-for="(item, index) in dataList" :key="index" @click="itemClick(item)">
        <view class="item-title">{{ item.title }}</view>
        <view class="item-detail">{{ item.detail }}</view>
        <view class="item-line"></view>
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
      const dataList = [
        {
          title: "项目 1",
          detail: "这是项目 1 的详细信息。",
        },
        {
          title: "项目 2",
          detail: "这是项目 2 的详细信息。",
        },
        {
          title: "项目 3",
          detail: "这是项目 3 的详细信息。",
        },
        {
          title: "项目 4",
          detail: "这是项目 4 的详细信息。",
        },
        {
          title: "项目 5",
          detail: "这是项目 5 的详细信息。",
        },
        {
          title: "项目 6",
          detail: "这是项目 6 的详细信息。",
        },
        {
          title: "项目 7",
          detail: "这是项目 7 的详细信息。",
        },
        {
          title: "项目 8",
          detail: "这是项目 8 的详细信息。",
        },
        {
          title: "项目 9",
          detail: "这是项目 9 的详细信息。",
        },
        {
          title: "项目 10",
          detail: "这是项目 10 的详细信息。",
        },
      ];
      this.$refs.paging.complete(dataList);
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
  border: solid;
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
