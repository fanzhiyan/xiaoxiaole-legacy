<template>
  <view v-if="visible">

    <!-- 移动浮标 -->
    <view class="fixed_move"
      v-if="isMove"
      :style="{
        'width': sizes + 'rpx',
        'height': sizes + 'rpx'
      }"
    >
      <movable-area class="movable-area">
        <movable-view
          class="fixed"
          damping="40"
          direction="all"
          :x="position.x"
          :y="position.y"
          :animation="true"
          :style="{
            'width': sizes + 'rpx',
            'height': sizes + 'rpx'
          }"
        >
          <image class="img" :src="imgSrc" mode="heightFix" @tap="floatTapEvent" />
        </movable-view>
      </movable-area>
    </view>

    <!-- 非移动浮标 -->
    <view class="fixed_not_move"
      v-else
      :style="{
        'width': sizes + 'rpx',
        'height': sizes + 'rpx',
        'right': right + 'rpx',
        'bottom': bottom + 'rpx'
      }"
    >
      <image class="img" :src="imgSrc" mode="heightFix" @tap="floatTapEvent" />
    </view>

  </view>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    isMove: {
      type: Boolean,
      default: true
    },
    sizes: {
      type: Number,
      default: 100
    },
    right: {
      type: Number,
      default: 70
    },
    bottom: {
      type: Number,
      default: 250
    },
    imgSrc: {
      type: String,
      default: 'https://gd-filems.dancf.com/mps/mcm79j/mcm79j/b7fd55ad-4759-4040-8d83-671f3ffa6846.png'
    }
  },
  data () {
    return {
      position: {
        x: 300,
        y: 580
      }
    }
  },
  created () {
    this.initPosition()
  },
  methods: {
    // 初始化浮标的位置
    initPosition () {
      let system = uni.getSystemInfoSync()
      this.position = {
        x: system.screenWidth - this.right,
        y: system.screenHeight - this.bottom
      }
    },
    // 浮标点击事件
    floatTapEvent () {
      console.log('floatTapEvent')
      this.$emit('floatTapEvent')
    }
  }
}
</script>

<style lang="scss" scoped>
.fixed_move {
  overflow: hidden;
  height: 100upx !important;
  .movable-area {
    width: 750upx;
    height: 100vh;
    .fixed {
      position: fixed;
      border-radius: 100%;
      z-index: 1000;
      @include flexLayout(center, center);
      .img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }
  }
}

.fixed_not_move {
  @include flexLayout;
  position: fixed;
  bottom: 350upx;
  z-index: 2;
  .img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
}
</style>
