<template>
  <up-navbar :title="state.title" :title-style="{ fontWeight: 'bold', fontSize: '30rpx' }" :placeholder="true" auto-back bg-color="#fff"></up-navbar>
  <view class="parse">
    <up-parse :content="state.content"></up-parse>
  </view>
</template>

<script setup>
import { onLoad ,onShareAppMessage} from "@dcloudio/uni-app";
import { reactive, computed,ref } from "vue";
import shiba from "@/shiba";
	const topic_id = computed(() => shiba.$store("app").user_topic_id);
let state = reactive({
  type: "",
  id: "",
  title: "",
  content: "",
});
onLoad((opction) => {
  state.type = opction?.type;
  state.id = opction?.id;
  getInfo();
});
const getInfo = async () => {
  if (state.type == "classifyDetail") {
    const res = await shiba.$api.api.GetClassifyDetail({
      id: state.id,
    });
    state.title = res.data.title;
    state.content = res.data.content;
  } else {
    const res = await shiba.$api.api.GetBannerDetail({
      id: state.id,
    });
    state.title = res.data.title;
    state.content = res.data.content;
  }
};

// #ifdef MP-WEIXIN
// 写一个函数 用于生成微信小程序 分享
uni.showShareMenu({
  menus: ["shareAppMessage", "shareTimeline"],
});
onShareAppMessage(() => {
  return {
    type: 0,
	title:state.title,
    path: `/pages/promotion/promotion?id=${state.id}&pic=${topic_id.value}&type=share`,
  };
});
// #endif

</script>

<style lang="scss" scoped>
.parse {
  padding: 20rpx;
}
</style>
