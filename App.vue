<script>
import shiba from "@/shiba";

export default {
  onLaunch: function (opction) {
	  console.log(opction,'opction')
    // 检查小程序更新
    // #ifdef MP-WEIXIN
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate);
    });

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        },
      });
    });

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    });
    // #endif
    // 以下是仅在H5环境下执行的代码（用于测试和调试）
    // #ifdef H5
    // 设置用户登录状态为true，并设置一个固定的token值
    uni.$store("user").SETKEYDATA("token", "752d0a0f-e01b-461c-a9fb-fa265bb88a7d");
    // uni.$store("user").SETKEYDATA("token", "");
    uni.$store("user").SETKEYDATA("isLogin", true);
    // uni.$store("user").GetUser();

    // // uni.$store("user").SETKEYDATA("token", "2a3ee15e-5d75-4876-b623-e30d37da0726");
    // if (uni.getStorageSync("token")) {
    //   //x		token: a5e2c65e-df14-404b-b2b6-f68812ec79a5
    //   uni.$store("user").SETKEYDATA("token", uni.getStorageSync("token"));
    // } else {
    //   uni.$store("user").SETKEYDATA("token", "e46a3d85-92f4-41de-841f-e2f0b7b7ef57");
    // }
    // 上面一行的token被注释掉了，可以作为备用token使用
    // #endif

    // 初始化应用数据存储
    uni.$store("app").init();

    // 初始化事件总线
    uni.$store("eventBus").init();

    // 获取屏幕信息并存入 store
    const info = uni.getSystemInfoSync();
    uni.$store("app").setScreenInfo({
      width: info.windowWidth,
      height: info.windowHeight,
      safeArea: info.safeArea,
    });

    // 清除所有弹窗的显示状态
    const clearPopupShownStatus = () => {
      const popList = shiba.$store("app").pop;
      if (popList && popList.length > 0) {
        popList.forEach((popup) => {
          uni.removeStorageSync(`popup_shown_${popup.type}_${popup.id}`);
        });
      }
    };
    clearPopupShownStatus();

    // 获取用户存储实例，并检查是否已登录
    const userStore = shiba.$store("user");
    const isLogin = userStore.isLogin;

    // 如果用户已登录，则调用GetUser方法获取用户信息
    if (isLogin) {
      userStore.GetUser();
    }
    
    // 检查启动选项中是否存在特定的查询参数（type为'share'的情况）
    if (opction?.query?.type == "share" && opction?.query?.pic_id) {
      // 若是分享类型，则保存用户话题ID到应用存储中
      shiba.$store("app").SETKEYDATA("user_topic_id", opction.query.pic_id);
    }else{
		// 根据是否存在用户话题ID决定跳转页面
		if (shiba.$store("app").user_topic_id) {
		  // 如果存在用户话题ID，则跳转至首页
		  // uni.switchTab({
		  //   url: "/pages/index/index",
		  // });
		} else {
		  // 否则重定向到圈子列表页面
		  uni.redirectTo({
		    url: "/pages/public/switch",
		  });
		}
	}

   
  },
  onShow: function () {
    uni.hideTabBar();
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss" scoped>
@import "uview-plus/index.scss";
.ow-break {
  overflow-wrap: break-word;
  word-break: break-word; /* 兼容性更好 */
}
</style>
<style lang="scss">
/* #ifdef H5 */
uni-toast {
  z-index: 99999 !important;
}
/* #endif */
text,
view {
  word-break: break-all;
  overflow-wrap: break-word;
}

::v-deep(.u-image) {
  background-color: transparent !important;
}

::v-deep(.u-button) {
  // border: none !important;

  &::after {
    border: none;
  }
}

// 清楚小程序默认样式
.reset {
  margin: 0;
  padding: 0;
  outline: none;
  border-radius: 0;
  background-color: transparent;
  line-height: inherit;

  &::after {
    border: none;
  }
}
</style>
