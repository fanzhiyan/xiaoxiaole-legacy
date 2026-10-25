<template>
  <y-layout>
    <block v-if="state.status == 3 || state.status == 2">
      <y-empty title="组局已失效" icon="search"></y-empty>
      <u-button @tap="navback" color="#FFD972" shape="circle" text="返回" :customStyle="{ width: '640rpx', height: '88rpx', color: '#FFD972', color: '#333' }"></u-button>
    </block>
    <block v-else>
      <view class="card issuer">
        <view class="user-issuer">
          <view class="avatar"><y-avatar :auth_status="state?.user?.auth_status" :src="$y.oss(state?.user?.avatar)"></y-avatar></view>
          <view class="user-info">
            <view class="row">
              <view class="user-left">
                <view class="user-name">{{ state.user.nickname }}</view>
                <view class="user-level">
                  <!-- <u-image width="38rpx" height="38rpx" src="/static/icon/icon-level-top.png"></u-image> -->
                  <y-grade :level_img="state.user.level_img" :level_text="state.user.level_text"></y-grade>
                </view>
              </view>
              <u-image @tap="state.modalReport = true" width="27.25rpx" height="32.05rpx" src="/static/icon/icon-waring.png" mode="aspectFit"></u-image>
            </view>
            <view class="issuer-time">{{ state.time }}</view>
          </view>
        </view>
        <view class="issuer-content">{{ state.content }}</view>
        <view class="img-content">
          <up-image radius="10" width="200rpx" @click="$y.previewImages(item)" height="200rpx" :src="item" v-for="item in state.images"></up-image>
        </view>
      </view>
      <y-coustom-group
        @look="emitsGroup"
        :status="state.status"
        :timeRemaining="state.endtime"
        :avatars="state.avatars"
        :currentStep="state.currentStep"
        :totalSteps="state.number"></y-coustom-group>

      <view class="comment-section-content">
        <view class="comment-section">
          <view class="comment-header">
            <u-image width="32rpx" height="30rpx" src="/static/icon/icon-comment.png" mode="aspectFit"></u-image>
            <view class="comment-title">留言</view>
          </view>
          <y-empty v-if="commentList.length == 0" icon="comment" title="暂无留言"></y-empty>
          <view class="comment-items">
            <view class="comment-entry" v-for="(res, index) in commentList" :key="res.id">
              <view class="comment-avatar">
                <y-avatar :gender="res?.user?.gender" :src="$y.oss(res.user.avatar)"></y-avatar>
              </view>
              <view class="comment-details">
                <view class="top">
                  <view class="name">{{ res.user.nickname }}</view>
                  <view class="like" :class="{ highlight: res.is_like }" @click="likeComment(1, res)">
                    <u-image v-if="res.is_like == 1" width="30rpx" height="30rpx" src="/static/icon/icon-collet-active.png" mode="aspectFit"></u-image>
                    <u-image v-else @click="getLike(index)" width="30rpx" height="30rpx" src="/static/icon/icon-collet.png" mode="aspectFit"></u-image>
                    <view class="num">{{ res.likes }}</view>
                  </view>
                </view>
                <view class="content parse">
                  <view class="images">
                    <u-image radius="10" @click="$y.previewImages($y.oss(item))" :src="$y.oss(item)" v-for="item in res.images_array" width="80rpx" height="80rpx"></u-image>
                  </view>
                  <u-parse :content="replaceEmojisWithImages(res.content)"></u-parse>
                </view>
                <view class="reply-box">
                  <view class="comment-entry" v-for="(reply, replyInd) in res.reply" :key="res.id">
                    <view class="comment-avatar">
                      <y-avatar :gender="reply?.user?.gender" :src="$y.oss(reply.user.avatar)"></y-avatar>
                    </view>
                    <view class="comment-details">
                      <view class="top">
                        <view class="name">{{ reply?.user?.nickname }}</view>
                        <view class="like" :class="{ highlight: reply.is_like }" @click="likeComment(2, reply)">
                          <u-image v-if="reply.is_like == 1" width="30rpx" height="30rpx" src="/static/icon/icon-collet-active.png" mode="aspectFit"></u-image>
                          <u-image v-else @click="getLike(replyInd)" width="30rpx" height="30rpx" src="/static/icon/icon-collet.png" mode="aspectFit"></u-image>
                          <view class="num">{{ reply.likes }}</view>
                        </view>
                      </view>
                      <view class="content parse">
                        <view class="images">
                          <u-image
                            radius="10"
                            @click="$y.previewImages($y.oss(replyImg))"
                            :src="$y.oss(replyImg)"
                            v-for="replyImg in reply.images_array"
                            width="80rpx"
                            height="80rpx"></u-image>
                        </view>
                        <u-parse :content="replaceEmojisWithImages(reply.content)"></u-parse>
                      </view>
                      <!-- <view class="bottom" @click="onClickReview(reply, 2, index)">
		                  {{ reply.time }}
		                  <view class="reply">回复</view>
		                </view> -->
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
      <y-review @send="sendReview" :placeholder="replyText" v-model="state.modalShowEmjio"></y-review>
      <y-report :grass_id="state.id" mode="2" v-model="state.modalReport"></y-report>

      <y-fixed-bottom bottom="10rpx" index="666">
        <u-button
          v-if="state.is_join == 0 && StoreUser.id != state.user.id && state.status == 0"
          color="#FFD972"
          shape="circle"
          text="我要加入"
          @click="joinGroupSession"
          :customStyle="{ width: '640rpx', height: '88rpx', color: '#FFD972', color: '#333' }"></u-button>
        <!-- 如果是本人发布 并且 已经加入状态 就不能退出 -->
        <u-button
          v-if="StoreUser.id == state.user.id"
          color="#FFD972"
          shape="circle"
          text="取消组局"
          @click="cancelGroupSession"
          :customStyle="{ width: '640rpx', height: '88rpx', color: '#FFD972', color: '#333' }"></u-button>
        <u-button
          v-if="StoreUser.id != state.user.id && state.is_join == 1"
          color="#FFD972"
          shape="circle"
          text="退出组局"
          @click="exitGroupSession"
          :customStyle="{ width: '640rpx', height: '88rpx', color: '#FFD972', color: '#333' }"></u-button>
        <view class="comment-input">
          <view class="home" @click="toIndex">
            <view>
              <u-image width="40rpx" height="40rpx" src="/static/icon/icon-home.png" mode="aspectFit"></u-image>
            </view>
            <view style="font-size: 25rpx">首页</view>
          </view>
          <view class="input_text" @click="onClickReview(false, 0)">
            <view class="placeholder">
              <u-image width="26rpx" height="26rpx" src="/static/icon/icon-edit.png" mode="aspectFit"></u-image>
              <!-- <view></view> -->
              <view>友善人间暖，隐露言语间</view>
            </view>
            <view class="icon">
              <u-image width="40rpx" height="40rpx" src="/static/icon/icon-emjio.png" mode="aspectFit"></u-image>
              <u-image width="40rpx" height="40rpx" src="/static/icon/icon-img.png" mode="aspectFit"></u-image>
            </view>
          </view>
        </view>
      </y-fixed-bottom>
    </block>
  </y-layout>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import shiba from "@/shiba";
import emojio from "@/shiba/utils/emjio";
const message = shiba.$hook.useMessageBox();
const StoreUser = computed(() => shiba.$store("user").user);
const appStore = computed(() => shiba.$store("app").user_topic_id);
const commentList = ref([]);
let state = reactive({
  id: "",
  // 是否能加入组局
  is_join: 1,
  content: "",
  time: "",
  avatars: [],
  user: {
    avatar: "",
    level: "",
    nickname: "",
    id: "",
    gender: 1,
  },
  modalReport: false,
  // 人数
  number: 2,
  status: "",
  images: [],
  endtime: 0,
  // 加载状态
  loading: false,
  commentLoading: false,
  // 圈子相关状态
  circle_join: 0, // 是否已加入圈子
  circle_status: 0, // 圈子加入审核状态
  modalShowEmjio: false,
});
onLoad((opction) => {
  state.id = opction?.id;
  getInfo();
  GetTeamMessage();
  getCircleInfo(); // 获取圈子信息
});

// 获取评论
const GetTeamMessage = async () => {
  const res = await shiba.$api.public.GetTeamMessage({
    team_id: state.id,
  });
  res.data.data.map((items) => {
    commentList.value.push(items);
  });
};

// 返回首页
const toIndex = () => {
  uni.switchTab({
    url: "/pages/index/index",
  });
};

// 是否能加入
const getInfo = async () => {
  const res = await shiba.$api.public.GrassTeamDetail({
    team_id: state.id,
  });
  state.endtime = res.data.endtime;
  // 此处是组局活动是否能加入
  state.is_join = res.data.is_join;
  state.user = res.data.user;
  state.time = res.data.time;
  state.content = res.data.content;
  state.status = res.data.status;

  computedTeam(res.data.number);
  state.number = res.data.number;
  state.status = res.data.status;
  state.currentStep = res.data.team_user.length + 1;
  state.images = res.data.images
    .split(",")
    .filter((items) => items.fileUrl != "")
    .map((url) => {
      return uni.$y.oss(url);
    });
};

// 根据
const computedTeam = async (number) => {
  let arr = new Array(number);
  for (var index = 0; index < arr.length; index++) {
    if (index == 0) {
      arr[0] = {
        image: uni.$y.oss(state.user.avatar),
        label: "发起人",
        value: state.user,
      };
    } else {
      arr[index] = {
        image: "",
        label: index + 1,
        value: {},
      };
    }
  }
  state.avatars = arr;
  GetTeamMember();
};
// 获取组员列表
const GetTeamMember = async () => {
  const res = await shiba.$api.public.GetTeamMember({
    team_id: state.id,
  });
  for (var index = 0; index < res.data.length; index++) {
    let data = res.data[index];
    state.avatars[index] = {
      image: uni.$y.oss(data.user.avatar),
      label: index == 0 ? "发起人" : index + 1,
      value: data.user,
    };
  }
  console.log(res, "resresres");
};

// 加入组局
const joinGroupSession = async () => {
  await message.confirm({
    title: "提示",
    content: "加入组局？",
    confirmText: "确认加入",
  });
  const res = await shiba.$api.public.JoinTeam({
    team_id: state.id,
  });
  getInfo();
};

// 取消组局
const cancelGroupSession = async () => {
  await message.confirm({
    title: "提示",
    content: "确认取消组局吗？",
    confirmText: "确认取消",
  });
  const res = await shiba.$api.public.Grass_teamCancel({
    team_id: state.id,
  });
  getInfo();
};

// 退出组局
const exitGroupSession = async () => {
  await message.confirm({
    title: "提示",
    content: "确认退出组局吗？",
    confirmText: "确认退出",
  });
  const res = await shiba.$api.public.QuitGrassTeam({
    team_id: state.id,
  });
  getInfo();
};

// ----------------评论
// 点赞

const likeUp = async () => {
  const res = await shiba.$api.public.likeGrass({
    grass_id: state.id,
  });
  console.log(res, "resresresresresres");
};

// 评论ID中间存储
let commentId = ref("");
let replyText = ref("");
let replyInd = ref("");

let replyState = reactive({
  // 回复的下标
  replyInd: "",
  // 0 直接评论 1 一级回复 2 二级回复
  type: 0,
});

// 获取圈子信息
const getCircleInfo = async () => {
  try {
    const res = await shiba.$api.public.getGrassIndex({
      id: appStore.value,
    });
    state.circle_join = res.data.is_join;
    state.circle_status = res.data.join_status;
  } catch (error) {
    uni.$u.toast("获取圈子信息失败");
  }
};

// 加入圈子请求
const joinCircle = async () => {
  try {
    await shiba.$api.public.applyJoin({
      topic_id: appStore.value,
      content: "",
      image: "",
    });
    await message.confirm({
      title: "提示",
      content: "已加入圈子",
      confirmText: "好的",
      isShowCancel: false,
    });
    await getCircleInfo();
  } catch (error) {
    uni.$u.toast("加入失败，请重试");
  }
};

// 圈子加入提示弹窗
const showCircleJoinPrompt = () => {
  message
    .confirm({
      title: "温馨提示",
      content: "加入圈子后可以发布动态、参与讨论，获得更多互动机会。现在就加入吧！",
      confirmText: "立即加入",
      cancelText: "暂不加入",
    })
    .then(() => {
      if (state.circle_status == 1) {
        joinCircle();
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

// 评论前检查是否已加入圈子
const onClickReview = (item, type, index) => {
  // 检查是否已加入圈子
  if (!state.circle_join) {
    showCircleJoinPrompt();
    return;
  }

  if (type == 0) {
    // 直接评论
    commentId.value = state.id;
    replyText.value = `请输入评论内容`;
  }
  if (type == 1) {
    // 一级回复
    commentId.value = item.id;
    replyText.value = `回复 ${item.user.nickname}`;
    replyState.replyInd = index;
  }
  if (type == 2) {
    // 二级回复
    commentId.value = item.id;
    replyText.value = `回复 ${item.user.nickname}`;
    replyState.replyInd = index;
  }
  replyState.type = type;
  state.modalShowEmjio = !state.modalShowEmjio;
};

// 评论组件
const sendReview = async (data) => {
  // 根据 上面 commentid 判断是调用回复还是调用评论接口
  if (commentId.value != state.id) {
    const res = await shiba.$api.public.ReplyTeamMessage({
      ...data,
      message_id: commentId.value,
      // type: replyState.type,
    });
    commentList.value[replyState.replyInd].reply.push(res.data);
    console.log("评论成功回复", res);
  } else {
    const res = await shiba.$api.public.TeamMessage({
      ...data,
      team_id: state.id,
    });
    commentList.value.push(res.data);
  }
};

// 转化emjio
function replaceEmojisWithImages(text) {
  // 创建一个从alt到url的映射对象
  const emojiMap = emojio.reduce(
    (acc, { url, alt }) => ({
      ...acc,
      [alt]: `<img class='emoji_img' width='25rpx' height='25rpx' src='${uni.$y.oss(`/uploads/emojis/${url}`)}' alt="${alt}" />`,
    }),
    {}
  );

  // 使用正确的正则表达式查找所有的表情符号，并用replace方法替换它们
  const result = text.replace(/\[(.*?)\]/g, (match, p1) => {
    const replacement = emojiMap[`[${p1}]`] || match;
    return replacement;
  });
  return result;
}
// 点赞
const getLike = (index) => {
  const comment = commentList.value[index];
  comment.isLike = !comment.isLike;
  comment.likeNum += comment.isLike ? 1 : -1;
};
// 点赞评论
const likeComment = async (type, item) => {
  const res = await shiba.$api.public.likeComment({
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
};

const navback = () => {
  uni.navigateBack();
};

// 查看

const emitsGroup = async (item) => {
  if (state.is_join == 0)
    return uni.showToast({
      icon: "none",
      title: "请先加团",
    });
  else {
    message
      .confirm({
        title: "联系方式",
        content: `手机号：${item.value.mobile}`,
        confirmText: "立即复制",
        cancelText: "暂不",
      })
      .then(() => {
        uni.setClipboardData({
          data: item.value.mobile,
        });
      });
  }

  // uni.$u.route({
  //   url: "/pages/public/user-home",
  //   params: {
  //     user_id: item.value.id,
  //   },
  // });
};
</script>

<style lang="scss" scoped>
.card {
  width: 702rpx;
  min-height: 196rpx;
  background: #ffffff;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  padding: 10rpx 20rpx;
  margin: 20rpx auto;
}

.issuer {
  width: 702rpx;
  background: #ffffff;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  padding: 10rpx 20rpx;
  margin: 20rpx auto;

  .issuer-content {
    font-size: 29rpx;
    color: #333333;
    padding: 10rpx 0;
    font-weight: 600;
    line-height: 1.7;
  }

  .img-content {
    display: flex;
    flex-wrap: wrap;
    gap: 30rpx;
  }

  .issuer-row {
    text-align: right;

    .tip {
      font-size: 24rpx;
      color: #333333;
      padding: 0 20rpx;
    }

    .price {
      color: #e81616;
      font-weight: bold;
    }
  }

  .user-issuer {
    display: flex;
    align-items: center;
    height: 120rpx;

    .avatar {
    }

    .user-info {
      flex: 1;
      padding: 0 20rpx;

      .row {
        display: flex;
        justify-content: space-between;

        .user-name {
          font-size: 28rpx;
          color: #000000;
          margin-right: 10rpx;
        }

        .user-left {
          display: flex;
          justify-content: space-between;
        }

        .user-level {
        }
      }

      .issuer-time {
        color: #999999;
        font-size: 24rpx;
      }
    }
  }
}

.comment-section-content {
  background-color: #fff;
  padding: 15rpx 25rpx;

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
            margin-bottom: 10rpx;

            .name {
              color: #333;
              font-size: 25rpx;
              width: 450rpx;
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
              padding: 10rpx 0;
              display: flex;
              gap: 10rpx;
            }
          }

          .reply-box {
            background-color: #fafafa;
            border-radius: 12rpx;

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
            margin-top: 20rpx;
            display: flex;
            font-size: 24rpx;
            color: #9a9a9a;

            .reply {
              color: #333;
              margin-left: 10rpx;
            }
          }
        }
      }
    }
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

    .nickname {
      padding: 0 10rpx;
    }
  }

  padding: 10rpx 14rpx;
}

.comment-input {
  width: 750rpx;
  height: 104rpx;
  margin-top: 20rpx;
  background: #ffffff;
  box-shadow: 0rpx -2rpx 4rpx 1rpx rgba(0, 0, 0, 0.06);
  border-radius: 0rpx 0rpx 0rpx 0rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10rpx;

  .home {
    width: 110rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .input_text {
    padding: 0 20rpx;
    width: 614rpx;
    height: 72rpx;
    background: #f6f7f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    }
  }
}
</style>
