<template>
  <y-layout>
    <view>
      <!-- 内容已删除的提示页面 -->
      <view v-if="state.contentDeleted" class="deleted-content">
        <view class="deleted-message">
          <view class="deleted-icon"></view>
          <view class="deleted-text">此内容已删除</view>
          <view class="deleted-desc">该帖子已被删除或不存在</view>
          <button class="back-button" @click="toBack">返回</button>
        </view>
      </view>
      
      <!-- 原有内容 - 只在内容未删除时显示 -->
      <view v-else>
        <view class="" style="padding: 15rpx">
          <view class="management-content l-bg-white">
            <view class="management-info">
              <view>
                <view class="user">
                  <view class="avatar">
                    <y-avatar :auth_status="state.user.auth_status" :src="$y.oss(state?.user?.avatar)"></y-avatar>
                  </view>
                  <view class="user-desc">
                    <view class="nickname">{{ state.user.nickname }}</view>
                    <view class="time">{{ state.graddInfo.time }}</view>
                  </view>
                </view>
              </view>
              <view class="l-f l-fs-sm l-a-center report" v-if="user_id != UserStore.id" @click="juBao(1, state.id)">
                举报
                <u-image width="26rpx" height="32rpx" src="/static/icon/icon_waring.png" mode="aspectFit"></u-image>
              </view>
              <view class="l-f l-fs-sm l-a-center report" v-if="user_id == UserStore.id" @click="DeleteManagement">
                删除帖子
                <u-image width="26rpx" height="32rpx" src="/static/icon/icon_waring.png" mode="aspectFit"></u-image>
              </view>
            </view>
            <view class="message-content" @click="$u.route('/pages/management/management-info')">
              <text @longtap="$y.copy(state?.graddInfo?.introduce)">
                {{ state?.graddInfo?.introduce }}
              </text>
            </view>
            <view class="message-imgs" v-if="state?.images_url.length != 0">
              <up-image width="200rpx" height="200rpx" radius="5" @click="$y.previewImages($y.oss(item))" :src="$y.oss(item)" v-for="item in state?.images_url"></up-image>
            </view>

            <view class="message-footer">
              <view class="footer-meta">
                <text class="tag">#{{ state.graddInfo.grass_type_text }}</text>
              </view>
              <view class="footer-tag">
                <view class="tag-item">
                  <view class="tag-icon">
                    <image width="24rpx" height="24rpx" src="/static/icon/message-chat-eye.png" mode="aspectFit"></image>
                  </view>
                  <view class="tag-num">{{ state.browses }}</view>
                </view>
                <view class="tag-item" :class="{ active: state.is_like == 1 }" @click="likeUp">
                  <view class="tag-icon">
                    <image width="24rpx" height="24rpx" src="/static/icon/message-chat-thumbs.png"></image>
                  </view>
                  <view class="tag-num">{{ state.likes }}</view>
                </view>
                <view class="tag-item">
                  <view class="tag-icon">
                    <image width="24rpx" height="24rpx" src="/static/icon/message-chat-msg.png"></image>
                  </view>
                  <view class="tag-num">{{ state.comments }}</view>
                </view>
              </view>
            </view>
          </view>
          <!-- 交流群 -->
          <view class="group_qrcode" @click="state.postShow = true">
            <view class="group_logo">
              <u-image radius="5" @tap="stateQrcode.show = true" width="120rpx" height="120rpx" :src="$y.oss(state.group_info.group_logo)"></u-image>
            </view>
            <view class="group_info">
              <view class="group_name">{{ state.group_info.name }}交流群</view>
              <view class="group_text">{{ state.group_info.group_remark }}</view>
            </view>
          </view>
          <!-- 今日热门 -->
          <view class="content-comment l-bg-white">
            <view class="comment-section">
              <y-empty title="还没有任何评论 发表第一条评论吧" icon="comment" v-if="commentList.length == 0"></y-empty>
              <view class="comment-items">
                <view class="comment-entry" v-for="(res, index) in commentList" :key="res.id">
                  <view class="comment-avatar">
                    <y-avatar :auth_status="res.user.auth_status" avatarSize="48rpx" :src="$y.oss(res.user.avatar)"></y-avatar>
                  </view>

                  <view class="comment-details">
                    <view class="top">
                      <view class="name">
                        {{ res.user.nickname }}
                        <view class="author" v-if="isAuthor(res.user, res.is_anonymity)">作者</view>
                      </view>
                      <view class="t-right" @click="juBao(2, res.id, res)">
                        <text class="shiba-checkmore icon_checkmore"></text>
                        <!-- 举报
      	              <u-image width="26rpx" height="32rpx" src="/static/icon/icon_waring.png" mode="aspectFit"></u-image> -->
                      </view>
                    </view>
                    <view class="content parse">
                      <view class="images">
                        <u-image
                          radius="10"
                          @click="$y.previewImages($y.oss(item))"
                          :src="$y.oss(item)"
                          v-for="(item, index) in res.images_array"
                          :key="index"
                          width="160rpx"
                          height="160rpx"></u-image>
                      </view>
                      <view class="msg-content" @longtap="$y.copy(res.content)">
                        {{ res.content }}
                      </view>
                      <!-- <u-parse :content="replaceEmojisWithImages(res.content)"></u-parse> -->
                    </view>
                    <view class="reply-box">
                      <view class="comment-entry" v-for="reply in res.reply" :key="reply.id">
                        <view class="comment-avatar">
                          <y-avatar avatarSize="48rpx" :auth_status="reply?.user?.auth_status" :src="$y.oss(reply.user.avatar)"></y-avatar>
                        </view>
                        <view class="comment-details">
                          <view class="top">
                            <view class="name">
                              {{ reply.user.nickname }}
                              <view class="author" v-if="isAuthor(reply.user, reply.is_anonymity)">作者</view>
                              <text class="time">{{ reply.time }}</text>
                            </view>
                            <view class="t-right" @click="juBao(3, reply.id, reply)">
                              <!--   <u-image width="26rpx" height="32rpx" src="/static/icon/icon_waring.png" mode="aspectFit"></u-image>  -->
                              <text class="shiba-checkmore icon_checkmore"></text>
                            </view>
                          </view>
                          <view class="content parse">
                            <view class="reply-tag">
                              回复
                              <text class="nickname">{{ reply.to_user.nickname }}</text>
                            </view>
                            <view class="images" v-if="reply?.images_array?.length != 0">
                              <u-image
                                radius="10"
                                @click="$y.previewImages($y.oss(replyImg))"
                                :src="$y.oss(replyImg)"
                                v-for="(replyImg, imgIndex) in reply.images_array"
                                :key="imgIndex"
                                width="160rpx"
                                height="160rpx"></u-image>
                            </view>
                            <view class="msg-content" @longtap="$y.copy(reply.content)">{{ reply.content }}</view>
                          </view>
                          <view class="bottom" @click="onClickReview(reply, 2, index)">
                            <view class="reply">回复</view>
                          </view>
                        </view>
                      </view>
                    </view>
                    <view class="bottom" @click="onClickReview(res, 1, index)">
                      {{ res.time }}
                      <view class="reply">回复</view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <y-review @send="sendReview" :replyType="replyState.type" :replyText="replyText" v-model="state.modalShowEmjio"></y-review>
        <y-report :grass_id="state.reportId" v-model="state.modalReport" :mode="state.reportMode"></y-report>
        <y-roof></y-roof>
        <y-fixed-bottom bottom="0" v-if="!state.contentDeleted">
          <view class="comment-input">
            <view class="home">
              <button class="item-action" @click="toIndex">
                <view class="icon">
                  <u-image width="40rpx" height="40rpx" src="/static/icon/home.png" mode="aspectFit"></u-image>
                </view>
                <view class="text">首页</view>
              </button>

              <button class="item-action" open-type="share">
                <view class="icon">
                  <u-image width="40rpx" height="40rpx" src="/static/icon/share.png" mode="aspectFit"></u-image>
                </view>
                <view class="text">分享</view>
              </button>
            </view>
            <view v-if="state.action == 'look'" class="input_text">
              <view class="placeholder" v-if="isLogin" @click="onClickReview(false, 0)">
                <u-image width="40rpx" height="40rpx" src="/static/icon/icon-edit.png" mode="aspectFit"></u-image>
                <!-- <view></view> -->
                <view>发布评论</view>
              </view>

              <view class="placeholder" style="color: #333" v-else @click="loginApply">
                <view>请登录后进行评论</view>
              </view>

              <view class="icon"></view>
            </view>
            <view v-if="state.action == 'edit'" class="input_text look" @click="DeleteManagement">
              <view class="placeholder">
                <u-image width="40rpx" height="40rpx" src="/static/icon/delete_icon.png" mode="aspectFit"></u-image>
                <!-- <view></view> -->
                <view>删除帖子</view>
              </view>
              <view class="icon"></view>
            </view>
          </view>
        </y-fixed-bottom>
        <y-float v-if="!state.contentDeleted">
          <view class="col-down">
            <view class="col-down-item" @click="showCreatePost = true">
              <image style="height: 108rpx; width: 108rpx" src="/static/icon/icon-fb.png"></image>
            </view>
          </view>
        </y-float>
      </view>
      <up-popup @close="state.postShow = false" :closeOnClickOverlay="true" :show="state.postShow" mode="center" round="20rpx" bgColor="transparent">
        <view class="group_poster">
          <image src="/static/public/group_bg_poster.png" mode="aspectFit" class="bg"></image>
          <view class="content">
            <view class="group_title">校园专属群:进群不迷路</view>
            <view class="group_desc">第一时间掌握全校动态</view>
            <view class="group_code">
              <up-image width="300rpx" height="300rpx" :src="$y.oss(state.group_image)" mode="aspectFit"></up-image>
            </view>
            <view class="hint">长按二维码进入校园交流群</view>
          </view>
        </view>
      </up-popup>
      <y-create-post v-model="showCreatePost" :needAuth="true" :needJoin="true" :topicId="appStore" @confirm="handleConfirm" @cancel="handleCancel" />

      <up-popup :show="showReplay" :round="20">
        <view class="popup-content">
          <view class="user">
            <view class="user-info">{{ state.reportText }}</view>
            <view class="waring" @click="JuBaoComment">举报</view>
          </view>
          <view class="cancel" @click="showReplay = false">取消</view>
        </view>
      </up-popup>
      <up-popup :show="showDelete" :round="20">
        <view class="popup-content">
          <view class="user">
            <view class="waring" @click="DeleteComment">删除评论</view>
          </view>
          <view class="cancel" @click="showDelete = false">取消</view>
        </view>
      </up-popup>
    </view>
  </y-layout>
</template>

<script setup>
import emojio from "@/shiba/utils/emjio";
import { ref, computed, onMounted, reactive } from "vue";
import { onLoad, onShareAppMessage, onReady } from "@dcloudio/uni-app";
import shiba from "../../shiba";
const appStore = computed(() => shiba.$store("app").user_topic_id);
const UserStore = computed(() => shiba.$store("user").user);
const isLogin = computed(() => shiba.$store("user").isLogin);
let user_id = ref("");
const message = shiba.$hook.useMessageBox();
const createPost = shiba.$hook.useCreatePost();
let showReplay = ref(false);
let showDelete = ref(false);
const commentList = ref([]);
let showInvite = ref(false);
// 弹出登录
const loginApply = () => {
  uni.$store("modal").SETKEYDATA("Auth", false);
  uni.$store("modal").SETKEYDATA("Auth", true);
};
const isAuthor = (user, is_anonymity = 0) => {
  return user_id.value == user.id && is_anonymity == 0;
};

// 跳转到全部回复
const toAllReply = () => {
  uni.navigateTo({
    url: "/pages/template/comment/reply",
  });
};

// 获取今日热门
let HotTopicNotice = ref([]);
const DayHotGrassTopic = async () => {
  const res = await shiba.$api.api.DayHotGrassTopic({
    topic_id: appStore.value,
  });
  HotTopicNotice.value = res.data;
};

// 点赞
const getLike = (index) => {
  const comment = commentList.value[index];
  comment.isLike = !comment.isLike;
  comment.likeNum += comment.isLike ? 1 : -1;
};

// 评论列表
const getComment = async () => {
  if (state.commentLoading) return;
  state.commentLoading = true;
  try {
    const res = await shiba.$api.public.getCommentGrass({
      grass_id: state.id,
    });
    commentList.value = res.data.data;
  } catch (error) {
    uni.$u.toast("评论加载失败");
  }
  state.commentLoading = false;
};

// 在组件加载时获取评论

const state = reactive({
  id: "",
  title: "",
  reportMode: 1,
  reportId: "",
  reportText: "",
  // 弹出评论
  showEmjio: false,
  name: "",
  user: {
    avatar: "",
    level: "",
    nickname: "",
    gender: 1,
  },
  graddInfo: {
    introduce: "",
    time: "",
    browses: "",
    label_text: "",
    grass_type_text: "",
  },
  // 视图
  modalShowEmjio: false,
  modalReport: false,
  is_like: 0,
  // 是否加入圈子
  is_join: 0,
  join_status: 0,
  // 加圈子自定义banner
  group_image: "",
  // 加载状态
  loading: false,
  commentLoading: false,

  //  浏览量 评论 点赞数
  browses: 0,
  comments: 0,
  likes: 0,
  // 自定义
  images_url: [],
  postShow: false,
  group_info: {
    group_logo: "",
    group_image: "",
    name: "",
    icon: "",
    group_remark: "",
  },
  // 新增：内容是否已删除
  contentDeleted: false,
});

/**
 * 举报
 */
const juBao = (type, id, item) => {
  console.log("type: ", type);
  console.log("id: ", id);
  console.log("id: ", item);
  state.reportMode = type;
  state.reportId = id;
  // 此处新增判断 如果是自己发的 应该展示删除
  if (item && item.user.id == UserStore.value.id) {
    showDelete.value = true;
    return;
  }

  if (type > 1) {
    showReplay.value = true;
    state.reportText = `@${item.user.nickname}:${item.content}`;
  } else {
    state.modalReport = true;
  }
};
// 评论举报
const JuBaoComment = () => {
  showReplay.value = false;
  state.modalReport = true;
};
// 评论删除
const DeleteComment = async () => {
  const res = await shiba.$api.api.delComment({
    topic_id: appStore.value,
    item_id: state.reportId,
    type: state.reportMode == 2 ? "comment" : "reply",
  });
  showDelete.value = false;
  getComment();
};
// 获取动态详情

const getGraddInfo = async () => {
  const res = await shiba.$api.public.getGrassDetail({
    grass_id: state.id,
  });
  if (res.data) {
    user_id.value = res.data.user_id;
    state.graddInfo.introduce = res.data.introduce;
    state.graddInfo.grass_type_text = res.data.grass_type_text;
    state.graddInfo.time = res.data.time;
    state.graddInfo.browses = res.data.browses;
    state.graddInfo.label_text = res.data.label_text;
    state.title = res.data.title;
    state.user = res.data.user;
    state.name = res.data.name;
    state.is_like = res.data.is_like;
    state.browses = res.data.browses;
    state.comments = res.data.comments;
    state.likes = res.data.likes;
    state.images_url = res.data.images_url.split(",").filter((items) => items != "") || [];
  } else {
    state.contentDeleted = true; // 内容已删除
  }
};

// 获取加群二维码

let stateQrcode = reactive({
  group_code: "",
  show: false,
  icon: "",
});
const getQrcodeInfo = async () => {
  const res = await shiba.$api.public.getGrassIndex({
    id: appStore.value,
  });
  state.is_join = res.data.is_join;
  state.join_status = res.data.join_status;
  state.group_image = res.data.group_image;
  state.group_info.group_image = res.data.group_image;
  state.group_info.group_logo = res.data.icon;
  state.group_info.icon = res.data.icon;
  state.group_info.name = res.data.name;
  state.group_info.group_remark = res.data.group_remark;
};

const GetQwRoomCode = async () => {
  const res = await shiba.$api.api.QwRoomCode({
    topic_id: appStore.value,
  });
  stateQrcode.icon = `data:image/png;base64,${res.data.qr_url}`;
};

// 加入请求
const sendForm = async () => {
  if (state.loading) return;
  state.loading = true;
  try {
    await shiba.$api.public.applyJoin({
      topic_id: appStore.value,
      content: "",
      image: "",
    });
    await message.confirm({
      content: "已加入圈子",
      confirmText: "好的",
      isShowCancel: false,
    });
    await getQrcodeInfo();
  } catch (error) {
    uni.$u.toast("加入失败，请重试");
  }
  state.loading = false;
};

// 点赞

const likeUp = async () => {
  if (state.loading) return;
  state.loading = true;
  try {
    await shiba.$api.public.likeGrass({
      grass_id: state.id,
    });
    state.is_like = Number(!Boolean(state.is_like));
    state.likes = state.is_like == 1 ? state.likes + 1 : state.likes - 1;
  } catch (error) {
    uni.$u.toast("操作失败，请重试");
  }
  state.loading = false;
};

// 评论ID中间存储
let commentId = ref("");
let replyText = ref("");

let replyState = reactive({
  // 回复的下标
  replyInd: "",
  // 0 直接评论 1 一级回复 2 二级回复
  type: 0,
});
const onClickReview = (item, type, index) => {
  // // 检查是否已加入圈子
  // if (!state.is_join) {
  //   CircledPrompt();
  //   return;
  // }
  replyState.type = type;
  if (type == 0) {
    // 那么就是直接评论
    commentId.value = state.id;
    replyText.value = `请输入评论内容`;
  }
  if (type == 1) {
    // 那么就是1级回复
    commentId.value = item.id;
    replyText.value = `@${item.user.nickname}： ${item.content}`;
  }

  if (type == 2) {
    // 那么就是1级回复
    commentId.value = item.id;
    replyText.value = `@${item.user.nickname}： ${item.content}`;
  }
  replyState.type = type;
  state.modalShowEmjio = !state.modalShowEmjio;
};

// 评论组件
const sendReview = async (data) => {
  if (state.commentLoading) return;
  state.commentLoading = true;
  try {
    if (commentId.value != state.id) {
      // 回复评论（一级或二级）
      const res = await shiba.$api.public.replyCommentGrass({
        ...data,
        grasscomment_id: commentId.value,
        type: replyState.type,
      });
      // 找到一级评论
      let parentIndex = -1;
      let replyIndex = -1;
      commentList.value.forEach((item, idx) => {
        if (item.id == commentId.value) parentIndex = idx;
        else {
          // 查找二级
          let subIdx = item.reply?.findIndex((r) => r.id == commentId.value);
          if (subIdx >= 0) {
            parentIndex = idx;
            replyIndex = subIdx;
          }
        }
      });
      if (parentIndex != -1) {
        // 只允许两级，所有回复都 push 到一级的 reply
        commentList.value[parentIndex].reply.push(res.data);
        uni.$u.toast("回复成功");
      }
    } else {
      // 一级评论
      const res = await shiba.$api.public.commentGrass({
        ...data,
        grass_id: commentId.value,
      });
      commentList.value.unshift({
        ...res.data,
        reply: [],
      });
    }
  } catch (e) {
    console.log(e, "e");
    uni.$u.toast("评论失败");
  }
  state.modalShowEmjio = false;
  state.commentLoading = false;
};

// 发布帖子

// 点赞评论
const likeComment = async (type, item) => {
  if (item.liking) return; // 防止重复点击
  item.liking = true;
  try {
    await shiba.$api.public.likeComment({
      type: type,
      item_id: item.id,
    });
    if (!Boolean(item.is_like)) {
      item.is_like = 1;
      item.likes++;
    } else {
      item.is_like = 0;
      item.likes--;
    }
  } catch (error) {
    uni.$u.toast("操作失败，请重试");
  }
  item.liking = false;
};

// 返回首页
const toIndex = () => {
  uni.switchTab({
    url: "/pages/index/index",
  });
};
// 查看
const lookComment = () => {
  uni.$u.route({
    url: "/pages/management/comment",
    params: {},
  });
};
// #ifdef MP-WEIXIN
// 写一个函数 用于生成微信小程序 分享
uni.showShareMenu({
  menus: ["shareAppMessage", "shareTimeline"],
});
onShareAppMessage(() => {
  return {
    type: 0,
    title: state?.graddInfo?.introduce,
    path: `/pages/management/management-info?id=${state.id}&pic=${appStore.value}&type=share`,
  };
});

// #endif

const initialX = ref(300);
const initialY = ref(300);
onReady(() => {
  try {
    const systemInfo = uni.getSystemInfoSync();
    const screenWidth = systemInfo.windowWidth;
    const screenHeight = systemInfo.windowHeight;

    // Constants in rpx (adjust as needed)
    const buttonWidthRpx = 140; // Based on min-width 120 + padding 10*2
    const buttonHeightRpx = 140; // Based on min-height 120 + padding 10*2
    const offsetBottomRpx = 120; // Desired offset from bottom
    const paddingRightRpx = 30; // Desired padding from right

    // Convert rpx to px
    const rpxToPxRatio = screenWidth / 750;
    const buttonWidthPx = buttonWidthRpx * rpxToPxRatio;
    const buttonHeightPx = buttonHeightRpx * rpxToPxRatio;
    const offsetBottomPx = offsetBottomRpx * rpxToPxRatio;
    const paddingRightPx = paddingRightRpx * rpxToPxRatio;

    // Calculate final coordinates in px
    initialX.value = screenWidth - buttonWidthPx - paddingRightPx;
    initialY.value = screenHeight - 300;
  } catch (e) {}
});

onLoad((opction) => {
  state.id = opction?.id;
  state.action = opction?.action || "look";
  getComment();
  getGraddInfo();
  DayHotGrassTopic();
  getQrcodeInfo();
  GetQwRoomCode();
  hasPrePage();
});
// 删除
const DeleteManagement = async () => {
  await message.confirm({
    title: "温馨提示",
    content: "确定删除本条帖子？",
    confirmText: "确定",
  });
  const res = await shiba.$api.api.GrassDelItem({
    grass_id: state.id,
  });
  uni.navigateBack();
};
// 添加入圈提示弹窗
const CircledPrompt = () => {
  if (state.loading) return;
  message
    .confirm({
      title: "温馨提示",
      content: "加入圈子后可以发布动态、参与讨论，获得更多互动机会。现在就加入吧！",
      confirmText: "立即加入",
      cancelText: "暂不加入",
    })
    .then(() => {
      if (state.join_status == 1) {
        sendForm();
      } else {
        uni.$u.route({
          url: "/pages/public/join-circle",
          params: {
            id: appStore.value,
          },
        });
      }
    })
    .catch(() => {
      // 用户取消，不做处理
    });
};

// 修改发帖按钮点击事件
const showInviteHandler = () => {
  createPost.show({
    needAuth: true,
    needJoin: true,
    topicId: appStore.value,
  });
};

const showCreatePost = ref(false);
const topicId = ref("");

let isPage = ref(false);
const hasPrePage = () => {
  const pages = getCurrentPages();
  isPage.value = pages.length > 1;
};

// 返回首页
const toHome = () => {
  uni.switchTab({ url: "/pages/index/index" });
};

// 返回上一页
const toBack = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.qrcode-group {
  .qrcode-content {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    justify-content: center;
  }

  .tip-text {
    text-align: center;
    font-size: 27rpx;
    line-height: 70rpx;
    font-weight: bold;
    // margin-top: 50rpx;
    color: #333;
  }

  .qrcode-title {
    font-weight: bold;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 32rpx;
  }

  width: 500rpx;
  height: 500rpx;
}

.content-comment {
  padding: 10rpx 15rpx;

  .comment-section {
    .comment-header {
      display: flex;
      align-items: center;
      height: 80rpx;
      gap: 20rpx;

      .comment-title {
        font-size: 28rpx;
        color: #202020;
        font-weight: bold;
      }
    }

    .comment-items {
      .comment-entry {
        margin: 10rpx 0;
        display: flex;
        padding: 10rpx;

        .comment-avatar {
          image {
            width: 64rpx;
            height: 64rpx;
            border-radius: 50%;
            background-color: #f2f2f2;
          }
        }

        .comment-details {
          flex: 1;
          padding-left: 20rpx;
          font-size: 30rpx;

          .top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            // margin-bottom: 10rpx;

            .name {
              color: #000;
              font-size: 26rpx;
              width: 450rpx;
              gap: 15rpx;
              display: flex;
              align-items: center;
            }

            .time {
              font-size: 24rpx;
              color: #cccccc;
              padding-left: 10rpx;
              font-weight: 400 !important;
            }

            .t-right {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              gap: 0 10rpx;
              color: #ababab;
              font-size: 24rpx;
            }

            .like {
              display: flex;
              align-items: center;
              color: #9a9a9a;
              font-size: 26rpx;

              .num {
                margin-left: 4rpx;
                color: #9a9a9a;
              }
            }

            .highlight {
              color: #333;

              .num {
                color: #333;
              }
            }
          }

          .content {
            margin-bottom: 10rpx;
            font-size: 24rpx;

            .images {
              // padding: 10rpx 0;

              display: flex;
              gap: 15rpx;
              flex-wrap: wrap;
            }
          }

          .reply-box {
            border-radius: 12rpx;

            .name {
              .time {
                font-size: 24rpx;
                color: #cccccc;
              }
            }

            .comment-entry {
              border-radius: 20rpx 20rpx 20rpx 20rpx;
              background-color: #f7f8fc;

              .bottom {
                // margin-top: 5rpx;
                display: flex;
                justify-content: flex-end !important;
                font-size: 24rpx;
                color: #9a9a9a;

                .reply {
                  color: #999999;
                  margin-left: 10rpx;
                }
              }
            }

            .item {
              padding: 20rpx;
              display: flex;
              flex-wrap: wrap;
              align-items: center;

              .comment-avatar {
                margin-right: 20rpx;
              }

              .username {
                font-size: 24rpx;
                width: calc(100% - 200rpx);
                flex-shrink: 0;
                color: #999999;
              }

              .text {
                font-size: 24rpx;
              }
            }

            .all-reply {
              font-size: 24rpx;
              padding: 20rpx;
              display: flex;
              color: #333;
              align-items: center;

              .more {
                margin-left: 6rpx;
              }
            }
          }

          .bottom {
            margin-top: 15rpx;
            display: flex;
            justify-content: space-between;
            font-size: 24rpx;
            color: #9a9a9a;

            .reply {
              color: #999999;
              margin-left: 10rpx;
            }
          }
        }
      }
    }
  }
}

.management-content {
  padding: 10rpx 20rpx;
  border-radius: 10rpx;
  margin: 15rpx 0;

  .report {
    font-size: 24rpxp;
    color: #999999;
    gap: 10rpx;
  }

  .message-imgs {
    display: flex;
    gap: 20rpx;
    flex-wrap: wrap;
  }

  .message-action {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100rpx;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #999999;

      .icon {
        padding: 10rpx 0;
      }

      .label {
        font-size: 24rpx;
      }
    }
  }

  .message-footer {
    // border-bottom: 1rpx solid #f8f8f8;
    padding-bottom: 10rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .footer-meta {
      gap: 20rpx;
      display: flex;

      .tag {
        font-size: 24rpx;
        color: #aaaaaa;
      }

      .time-stamp {
        color: #999999;
        font-size: 24rpx;
      }

      .viewer-count {
        color: #999999;
        font-size: 24rpx;
      }
    }

    .footer-tag {
      display: flex;
      gap: 20rpx;
      align-items: center;

      .tag-item {
        display: flex;
        gap: 5rpx;
        align-items: center;

        .tag-icon {
          image {
            width: 24rpx;
            height: 24rpx;
          }
        }

        .tag-num {
          color: #aaaaaa;
          font-size: 22rpx;
        }
      }
    }
  }
}

.message-content {
  font-size: 29rpx;
  padding: 20rpx 0rpx;
  line-height: 1.6;
  color: #333333;
  font-weight: 400;

  .message-imgs {
    display: flex;
    // width: 100%;
    gap: 10rpx;
    flex-wrap: wrap;
    background-color: red;
  }

  .tag {
    background: rgba(254, 179, 36, 0.2);
    border-radius: 28rpx 28rpx 28rpx 28rpx;
    padding: 5rpx 20rpx;
    margin-right: 5rpx;
    font-size: 16rpx;
    color: #f5aa00;
  }
}

.management-info {
  display: flex;
  justify-content: space-between;

  .user {
    display: flex;
    align-items: center;

    .avatar {
    }

    .user-desc {
      padding: 0 10rpx;

      .nickname {
        height: 40rpx;
        font-size: 28rpx;
        font-weight: bold;
      }

      .time {
        font-size: 24rpx;
        color: #bbbbbb;
      }
    }
  }
}

.comment-input {
  width: 750rpx;
  height: 104rpx;
  background: #ffffff;
  box-shadow: 0rpx -2rpx 4rpx 1rpx rgba(0, 0, 0, 0.06);
  border-radius: 0rpx 0rpx 0rpx 0rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10rpx;

  .home {
    width: 180rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .item-action {
      padding: 0;
      margin: 0;
      background: transparent !important;

      &::after {
        border: 0;
      }

      width: 160rpx;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .text {
        font-size: 20rpx;
        margin-top: 5rpx;
      }
    }
  }

  .input_text {
    padding: 0 20rpx;
    width: 484rpx;
    height: 72rpx;
    background: #f7f8fc;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 36rpx 36rpx 36rpx 36rpx;

    .placeholder {
      display: flex;
      gap: 15rpx;
      font-size: 28rpx;
      color: #999999;
    }

    .icon {
      display: flex;
      gap: 20rpx;
      margin-bottom: 15rpx;
    }
  }

  .look {
    display: flex;
    gap: 15rpx;
    align-items: center;
    font-size: 28rpx;

    .placeholder {
      color: #1673fe !important;
    }

    border: solid 1rpx #1673fe;
  }
}

.emjio-content {
  padding: 20rpx;
  // height: 600rpx;

  .text-content {
    padding-bottom: 20rpx;
    border-radius: 20rpx;
    overflow: hidden;
    background: #f8f8f8;

    :deep(.u-textarea) {
      overflow: hidden;
      background: #f8f8f8;
    }

    .content-imgs {
      height: 120rpx;
      padding: 0 20rpx;
    }
  }

  .icon-action {
    display: flex;
    justify-content: space-between;
    height: 90rpx;
    align-items: center;

    .left-action {
      padding: 20rpx 0;
      display: flex;
      gap: 20rpx;
    }

    .btn-send {
      background-color: #f8f8f8;
      width: 100rpx;
      height: 50rpx;
      border-radius: 50rpx;
      display: flex;
      align-items: center;
      color: #333;
      font-size: 27rpx;
      justify-content: center;
    }
  }

  .scroll-emjio {
    height: 260rpx;

    .emjios {
      display: flex;
      flex-wrap: wrap;

      .emjio-item {
        width: calc(100% / 10);
        height: 70rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.parse {
  // :deep(._root) {
  //   word-break: break-all;
  //   /* 强制单词内换行 */
  //   font-weight: 400;
  //   color: #333 !important;
  //   font-size: 30rpx;
  //   overflow-wrap: break-word;
  //   /* 长单词或URL换行 */
  // }
}

.col-down {
  margin: 50rpx 20rpx;

  .col-down-item {
    padding: 30rpx 0;
  }
}

.create-popup {
  width: 750rpx;
  height: 556rpx;
  background: #ffffff;
  border-radius: 24rpx 24rpx 0rpx 0rpx;

  .title {
    color: #666666;
    height: 90rpx;
    text-align: center;
    line-height: 90rpx;
    color: #666666;
    font-size: 28rpx;
  }

  .action-item {
    margin: 20rpx auto;

    width: 686rpx;
    height: 160rpx;
    background: #f7f8fc;
    background-color: #f7f8fc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;
    border-radius: 10rpx;

    .next {
      width: 50rpx;
      flex-shrink: 0;
      color: #333;
    }

    .content-info {
      width: 500rpx;

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

// ----------
.active {
  color: #e34c4c; // 红色
  filter: brightness(0) saturate(100%) invert(32%) sepia(99%) saturate(7492%) hue-rotate(349deg) brightness(97%) contrast(101%);
}

// 交流群
.group_qrcode {
  border-radius: 10rpx;
  padding: 10rpx 0;
  min-height: 150rpx;
  background-color: #fff;
  margin-bottom: 10rpx;
  border-bottom: 1rpx solid #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10rpx;
  .group_logo {
    width: 130rpx;
  }
  .group_info {
    width: calc(100% - 150rpx);
    .group_name {
      font-size: 32rpx;
      font-weight: bold;
      height: 50rpx;
    }
    .group_text {
      font-size: 26rpx;
      color: #b1b1b1;
    }
  }
}

.content-comment {
  border-radius: 10rpx;

  .msg-content {
    padding: 10rpx 0;
    font-size: 24rpx;
    color: #666666;
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    text-align: right;

    .reply {
      color: #999999;
    }
  }
}

.group_poster {
  width: 600rpx;
  height: 760rpx;
  position: relative;

  .bg {
    position: absolute;
    z-index: 11;
    width: 600rpx;
    height: 760rpx;
  }

  .content {
    position: absolute;
    z-index: 112;
    width: 100%;

    .group_title {
      color: #ffffff;
      font-size: 36rpx;
      text-align: center;
      font-weight: bold;
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
    }

    .group_desc {
      text-align: center;
      color: #ffffff;
    }

    .group_code {
      margin: 70rpx auto;
      width: 300rpx;
      height: 300rpx;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
    }

    .hint {
      text-align: center;
      color: #999999;
    }
  }
}

.icon_checkmore {
  color: #999999;
  font-size: 60rpx;
}

.popup-content {
  .user {
    min-height: 200rpx;
    border-bottom: 1rpx solid #999999;
    background: #ffffff;
    border-radius: 20rpx 20rpx 0rpx 0rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .user-info {
      font-size: 28rpx;
      color: #999999;
      line-height: 40rpx;
      padding: 10rpx;
    }

    .waring {
      color: #1673fe;
      font-weight: bold;
      font-size: 36rpx;
      height: 70rpx;
      line-height: 70rpx;
    }
  }

  .cancel {
    text-align: center;
    line-height: 100rpx;
    font-size: 32rpx;
    color: #999999;
  }
}

.reply-tag {
  flex-shrink: 0;
  font-size: 22rpx;
  margin-right: 10rpx;

  .nickname {
    color: #1673fe;
  }
}

.author {
  flex-shrink: 0;
  width: 50rpx;
  flex-shrink: 0;
  height: 30rpx;
  font-size: 16rpx;
  line-height: 30rpx;
  color: #fff;
  background-color: orangered;
  text-align: center;
  border-radius: 10rpx;
}

/* 新增：内容已删除的样式 */
.deleted-content {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  padding: 40rpx;
  
  .deleted-message {
    text-align: center;
    width: 100%;
    
    .deleted-icon {
      margin-bottom: 50rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 120rpx;
      height: 120rpx;
      background-color: #ff6b6b;
      border-radius: 50%;
      margin: 0 auto 50rpx;
      
      &::before {
        content: '!';
        font-size: 60rpx;
        font-weight: bold;
        color: #fff;
        line-height: 1;
      }
    }
    
    .deleted-text {
      font-size: 36rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 20rpx;
    }
    
    .deleted-desc {
      font-size: 28rpx;
      color: #999;
      margin-bottom: 60rpx;
      line-height: 1.5;
    }
    
    .back-button {
      background-color: #1673fe;
      color: #fff;
      border: none;
      border-radius: 8rpx;
      width: 200rpx;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 32rpx;
      margin: 0 auto;
      
      &::after {
        border: none;
      }
      
      &:active {
        background-color: #0d5dd6;
      }
    }
  }
}

</style>

<style>
page {
  background-color: #f8f8f8;
}
</style>
