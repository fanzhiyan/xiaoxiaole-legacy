<template>
  <y-layout>
    <u-sticky bgColor="#fff">
      <view class="tabs-padding">
        <u-tabs
          :current="state.current"
          lineHeight="12rpx"
          :lineColor="`url(../../static/icon/vector_bg.png) 100% 100%`"
          :activeStyle="{ color: '#1673FE', fontSize: '36rpx', fontWeight: 'bold' }"
          @change="changeTab"
          :scrollable="false"
          :list="list"
          keyName="name"></u-tabs>
      </view>
    </u-sticky>
    <view class="">
      <y-empty icon="data" v-if="!isLoading && isComplete && DataList.length == 0" title="暂无订单"></y-empty>
      <y-errand-card
        v-for="item in DataList"
        :create_time_text="item.create_time_text"
        :is_address="item.is_address"
        :content="item.content"
        :goods_id="item.id"
        :endaddress="item.endaddress"
        :startaddress="item.startaddress"
        :price="item.price"
        :status_text="item.status_text"
        :type_title="item.type_title"></y-errand-card>
    </view>
  </y-layout>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive, computed, ref } from "vue";
import shiba from "@/shiba";
const topic_id = computed(() => shiba.$store("app").user_topic_id);
let list = ref([
  {
    id: 1,
    name: "进行中",
  },
  {
    id: 3,
    name: "已完成",
  },
  {
    id: 5,
    name: "已取消",
  },
]);
let state = reactive({
  type: 3,
  status: 1,
  current: 0,
});
const changeTab = (item) => {
  state.status = item.id;
  state.current = item.index;
  reset();
};
onLoad((opction) => {
  if (opction?.id) {
    state.status = opction.id;
    state.current = list.value.findIndex((i) => i.id == opction.id);
  }
  reset();
});

const {
  reset, // 重置函数
  TotalData, // 总数据条数 (ref)
  DataList, // 列表数据 (ref)
  isComplete, // 是否加载完毕 (ref)
  isLoading, // 是否正在加载 (ref)
} = shiba.$hook.useGetList(shiba.$api.api.GrassRunErrands, {
  manual: true,
  params: () => {
    return {
      topic_id: topic_id.value,
      type: state.type,
      status: state.status,
    };
  },
});
</script>

<style lang="scss" scoped>
.tabs-padding {
  padding: 14rpx 0;
}
</style>
