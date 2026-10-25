<template>
  <up-popup 
    :show="isShow" 
    @close="handleClose" 
    closeable="true" 
    :round="20" 
    mode="center"
  >
    <view class="popup-content">
      <view class="title">{{ currentPopup?.title }}</view>
      <view class="image">
        <up-image 
          width="320rpx" 
          height="320rpx" 
          :src="$y.oss(currentPopup?.image)" 
          mode="aspectFit"
          @click="handleImageClick"
        ></up-image>
      </view>
      <view class="desc" v-if="currentPopup?.content">{{ currentPopup?.content }}</view>
    </view>
  </up-popup>
</template>

<script setup>
import { reactive, computed, ref, onMounted, watch } from "vue";
import shiba from "@/shiba";

// 获取弹窗列表
const popList = computed(() => shiba.$store("app").pop || []);

// 动态生成路由映射关系
const routePopupMap = computed(() => {
  const map = {};
  popList.value.forEach(item => {
    if (item.page_url) {
      // 确保page_url以'/'开头
      const normalizedUrl = item.page_url.startsWith('/') ? item.page_url : '/' + item.page_url;
      map[normalizedUrl] = item.type;
    }
  });
  return map;
});

// 获取当前页面路由
const getCurrentRoute = () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  return '/' + currentPage.route;
};

// 获取当前页面对应的弹窗
const currentPopup = computed(() => {
  const currentRoute = getCurrentRoute();
  const popupType = routePopupMap.value[currentRoute];
  
  if (!popupType) return null;
  
  return popList.value.find(item => 
    item.type === popupType && 
    item.status === 1 && 
    shouldShowPopup(item)
  );
});

// 内部状态控制显示隐藏
const isShow = ref(false);

// 检查是否应该显示弹窗
const shouldShowPopup = (popup) => {
  if (!popup) return false;
  const shown = uni.getStorageSync(`popup_shown_${popup.type}_${popup.id}`);
  return !shown;
};

// 记录弹窗显示时间
const recordPopupShow = () => {
  if (!currentPopup.value) return;
  uni.setStorageSync(`popup_shown_${currentPopup.value.type}_${currentPopup.value.id}`, true);
};

// 处理弹窗关闭
const handleClose = () => {
  isShow.value = false;
  recordPopupShow();
};

// 处理图片点击
const handleImageClick = () => {
  if (currentPopup.value?.url) {
    uni.navigateTo({
      url: currentPopup.value.url
    });
  }
};

// 监听路由变化自动检查是否需要显示弹窗
onMounted(() => {
  // 检查是否需要显示当前页面的弹窗
  if (currentPopup.value && shouldShowPopup(currentPopup.value)) {
    isShow.value = true;
  }
});

// 监听popList变化
watch(popList, () => {
  if (currentPopup.value && shouldShowPopup(currentPopup.value)) {
    isShow.value = true;
  }
}, { deep: true });
</script>

<style lang="scss" scoped>
.popup-content {
  width: 600rpx;
  height: 640rpx;
  position: relative;
  border-radius: 20rpx;
  background: url(../../../static/public/bg_service.png);
  background-size: 100% 100%;

  .image {
    height: 450rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title {
    font-size: 32rpx;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
  }

  .desc {
    text-align: center;
    color: #999;
    padding: 0 30rpx;
  }
}
</style> 