import shiba from "@/shiba";
import pageJson from "@/pages.json";

// 构建路由表
function flattenRoutes(config) {
  const routes = [];
  function extractRoutes(pages, root = "") {
    pages.forEach((page) => {
      const fullPath = root ? `${root}/${page.path}` : page.path;
      routes.push({
        path: fullPath,
        needLogin: page.needLogin || false,
        style: page.style || {},
      });

      // If there are subPackages, recursively extract their routes
      if (page.subPackages) {
        page.subPackages.forEach((subPackage) => {
          extractRoutes(subPackage.pages, subPackage.root);
        });
      }
    });
  }
  extractRoutes(config.pages);

  // / Extract subPackages
  if (config.subPackages) {
    config.subPackages.forEach((subPackage) => {
      extractRoutes(subPackage.pages, subPackage.root);
    });
  }

  return routes;
}
let whitelistPage = flattenRoutes(pageJson)
  .filter((items) => items?.needLogin == false)
  .map((item) => `/${item.path}`);
console.log(
  flattenRoutes(pageJson).filter((items) => items?.needLogin),
  "----"
);
// 工具函数：标准化路径，去掉多余的斜杠并统一为小写
const normalizePath = (path) => path.replace(/\/+$/, "").toLowerCase();

// 工具函数：检查是否是白名单页面
const isInWhitePage = (url) => {
  // 只取路径部分，忽略 query 参数进行匹配
  const path = normalizePath(url.split("?")[0]);
  // 标准化白名单中的路径
  return whitelistPage.map(normalizePath).includes(path);
};

// 路由拦截逻辑
const intercept = (to) => {
  if (isInWhitePage(to.url)) {
    return true; // 如果在白名单中，直接放行
  } else {
    const userStore = shiba.$store("user");
    if (userStore && userStore.isLogin) {
      return true; // 如果用户已登录，放行
    } else {
      return false; // 否则，阻止跳转
    }
  }
};

// 需要拦截的路由方法
const methods = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];

// 已安装的 Vue 实例集合，防止重复安装拦截器
const installed = new Set();

// 插件安装函数
const install = (Vue) => {
  console.log("注册拦截器");
  if (installed.has(Vue)) return; // 如果已经安装过，直接返回
  installed.add(Vue);
  // 统一拦截逻辑
  methods.forEach((method) => {
    uni.addInterceptor(method, {
      invoke(e) {
        // 开发环境下输出日志
        if (process.env.NODE_ENV === "development") {
          console.log(e, "---");
        }
        const result = intercept(e);
        if (!result) {
          // 此处修改 auth值 使其弹出登录弹窗
          const ModalStore = shiba.$store("modal");
          ModalStore.SETKEYDATA("Auth", true);
          // 如果拦截，显示模态框提示用户登录
          // uni.showModal({
          // 	title: "提示",
          // 	content: "您还未登陆，请先登录",
          // 	confirmText: '登录',
          // 	cancelText: "暂不登录",
          // 	success: (res) => {
          // 		if (res.confirm) {
          // 			shiba.$store('modal').SETKEYDATA('Auth',true)
          // 			// 用户选择去登录，跳转到登录页面
          // 			// uni.navigateTo({
          // 			// 	url: "/pages/login/login"
          // 			// });
          // 		} else {
          // 			// 用户选择暂不登录，导航回上一个页面
          // 			// uni.navigateBack();
          // 		}
          // 	}
          // });
          return false; // 阻止默认跳转行为
        }
        return true; // 允许跳转
      },
    });
  });
};

export default {
  install,
};
