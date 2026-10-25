<template>
  <up-navbar autoBack :placeholder="true" :title="state.title"></up-navbar>
  <view class="l-p">
    <u-parse :content="state.content"></u-parse>
  </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import shiba from "../../shiba";
import { reactive } from "vue";
let id = null;
onLoad((opction) => {
  id = opction?.id;
  getInfo();
});
let state = reactive({
  title: "",
  content: "",
});
const getInfo = async () => {
  const res = await shiba.$api.api.GetRichtext({
    id: id,
  });
  state.content = res.data.content;
  state.title = res.data.title;
};
</script>

<style></style>
