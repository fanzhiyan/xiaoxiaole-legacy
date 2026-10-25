<template>
  <y-layout>
    <view class="search-box">
      <u-search @search="searchKey" placeholder="请输入关键字进行搜索" searchIconColor="#A6CCFE" bgColor="transparent" borderColor="#1673FE" :show-action="false"></u-search>
    </view>
    <view class="errand-card" v-for="item in DataList">
      <y-errand-card
        :create_time_text="item.create_time_text"
        :is_address="item.is_address"
        :content="item.content"
        :goods_id="item.id"
        :endaddress="item.endaddress"
        :startaddress="item.startaddress"
        :price="item.price"
        :status_text="item.status_text"
        :type_title="item.type_title"
        :user_id="item.user_id" />
    </view>
    <y-empty icon="search" v-if="!isLoading && isComplete && DataList.length == 0" :title="state.keyword == '' ? '输入关键字进行搜索' : '未搜索到符合条件的跑腿'"></y-empty>
  </y-layout>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { reactive, computed, ref } from "vue";
import shiba from "@/shiba";
const topic_id = computed(() => shiba.$store("app").user_topic_id);
onLoad(() => {
  reset();
});
let state = reactive({
  keyword: "",
  type: "",
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
      keyword: state.keyword,
    };
  },
});
const searchKey = (item) => {
  state.keyword = item;
  reset();
};
</script>

<style lang="scss" scoped>
.search-box {
  width: 690rpx;
  margin: 20rpx auto;
}
.errand-card {
  border-bottom: 1rpx solid #f9f9f9;
}
</style>
<style>
page {
  background-color: #fff;
}
</style>
